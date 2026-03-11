import {inject, Injectable, OnDestroy} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {retry, Subject, Subscription, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BroadcastRequest} from '@models/broadcast-request';

export interface  WsMessage {
  channel: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService implements OnDestroy {

  private sockets = new Map<string, WebSocketSubject<any>>();
  private subscriptions = new Map<string, Subscription>();

  private manualClose = new Set<string>();
  private reconnectAttempts = new Map<string, number>();

  private messageSubject = new Subject<WsMessage>();
  message$ = this.messageSubject.asObservable();

  private username!: string;

  private http = inject(HttpClient)

  private httpBase = 'http://192.168.112.245:8082/ws/notify/broadcast'
  private wsBase = 'ws://192.168.112.245:8082/ws/notify';


  init(username: string) {
    this.username = username;
  }

  connect(channel: string) {

    if (this.sockets.has(channel)) return;

    const url = `${this.wsBase}?user=${this.username}&canal=${channel}`;

    const socket$ = webSocket<any>({
      url,
      deserializer: msg => {
        try {
          return JSON.parse(msg.data);
        } catch {
          return msg.data; // si no es JSON, devuelve el texto tal cual
        }
      },

      openObserver: {
        next: () => {
          console.log(`WS conectado canal ${channel}`);
          this.reconnectAttempts.set(channel, 0);
        }
      },

      closeObserver: {
        next: () => {

          console.log(`WS cerrado canal ${channel}`);

          this.sockets.delete(channel);
          this.subscriptions.delete(channel);

          if (this.manualClose.has(channel)) {
            this.manualClose.delete(channel);
            return;
          }

          const attempt = (this.reconnectAttempts.get(channel) ?? 0) + 1;
          this.reconnectAttempts.set(channel, attempt);

          const delay = Math.min(2000 * Math.pow(2, attempt), 30000);

          console.log(`Reintentando ${channel} en ${delay} ms`);

          setTimeout(() => this.connect(channel), delay);

        }
      }
    });

    const sub = socket$.subscribe({
      next: msg => {

        if (!msg?.message) return;

        this.messageSubject.next({
          channel,
          message: msg.message
        });

      },
      error: err => console.error('WS error', err)
    });

    this.sockets.set(channel, socket$);
    this.subscriptions.set(channel, sub);
  }

  sendWs(channel: string, message: string) {
    this.sockets.get(channel)?.next(message);
  }

  send(channel: string, message: string){
    const request: BroadcastRequest = {
      cannal : channel,
      message,
    }

    return this.http.post(`${this.httpBase}`, request)
  }

  disconnect(channel: string) {

    this.manualClose.add(channel);

    this.subscriptions.get(channel)?.unsubscribe();
    this.sockets.get(channel)?.complete();

    this.sockets.delete(channel);
    this.subscriptions.delete(channel);

    console.log(`WS desconectado canal ${channel}`);
  }

  ngOnDestroy() {
    this.sockets.forEach((_, channel) => this.disconnect(channel));
  }

}
