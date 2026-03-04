import {inject, Injectable, OnDestroy} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {retry, Subject, Subscription, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BroadcastRequest} from '@models/broadcast-request';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService implements OnDestroy {

  private sockets = new Map<string, WebSocketSubject<string>>();
  private subscriptions = new Map<string, Subscription>();

  private messageSubject = new Subject<string>();
  message$ = this.messageSubject.asObservable();

  private readonly MAX_MESSAGES = 100;
  private username!: string;
  private manualClose = new Set<string>();

  private urlWs = 'http://localhost:8082/ws/notify/broadcast'
  private http = inject(HttpClient)

  init(username: string) {
    this.username = username;
  }

  connect(channel: string) {

    if (this.sockets.has(channel)) return;

    const url =
      `ws://localhost:8082/ws/notify?user=${this.username}&canal=${channel}`;

    const socket$ = webSocket<string>({
      url,
      deserializer: msg => msg.data,
      openObserver:{
        next: () => console.log(`WS conectado al canal ${channel}`)
      },
      closeObserver: {
        next: () => {
          console.log(`WS cerrado en canal ${channel}`);

          this.sockets.delete(channel);
          this.subscriptions.delete(channel);

          if (!this.manualClose.has(channel)) {
            this.connect(channel); // solo reconecta si NO fue manual
          } else {
            this.manualClose.delete(channel);
          }
        }
      }
    });

    const sub = socket$
      .pipe(
        retry({
          count: 5,
          delay: () => timer(500)
        })
      )
      .subscribe(message => {
        this.messageSubject.next(message);
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
      message : message,
    }

    return this.http.post(`${this.urlWs}`, request)
  }

  disconnect(channel: string) {
    this.manualClose.add(channel);

    this.subscriptions.get(channel)?.unsubscribe();
    this.sockets.get(channel)?.complete();
    this.sockets.delete(channel);
    this.subscriptions.delete(channel);

    console.log("Conexion ws finalizada");
  }

  ngOnDestroy() {
    this.sockets.forEach((_, channel) => this.disconnect(channel));
  }
}
