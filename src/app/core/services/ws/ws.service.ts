import {inject, Injectable, OnDestroy} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WsMessage} from '@models/ws-message';
import {filter} from 'rxjs/operators';
import {BroadcastRequest} from '@models/broadcast-request';

@Injectable({
  providedIn: 'root'
})
export class WsService implements OnDestroy {

  private socket$?: WebSocketSubject<WsMessage>;

  private reconnectAttempts = 0;
  private manualClose = false;

  private messageSubject = new Subject<WsMessage>();
  messages$ = this.messageSubject.asObservable();

  private username!: string;

  private wsBase = `ws://192.168.112.245:8082/ws/chat`
  private httpBase = `http://192.168.112.245:8082/ws/broadcast`;

  private http = inject(HttpClient)

  init(username: string){
    this.username = username;
    this.manualClose = false;
    this.connect();
  }

  private connect() {

    const url = `${this.wsBase}?user=${this.username}`;

    this.socket$ = webSocket<WsMessage>({
      url,

      deserializer: msg => JSON.parse(msg.data),

      openObserver: {
        next: () => {
          console.log('WS conectado');
          this.reconnectAttempts =0
        }
      },

      closeObserver:{
        next: () => {
          console.log('WS cerrado');

          if (this.manualClose) return;

          const delay = Math.min(2000 * Math.pow(2, this.reconnectAttempts++), 30000);

          console.log(`Reintentando en ${delay} ms`);

          setTimeout(() => this.connect(), delay);
        }
      }
    });

    this.socket$.subscribe({
      next: msg => this.messageSubject.next(msg),
      error: err => console.error('WS error', err)
    });
  }

  sendWs(message: WsMessage) {
    this.socket$?.next(message);
  }

  sendApi(channel: string, message: string){
    const request: BroadcastRequest = {
      channel,
      message,
    }

    return this.http.post(`${this.httpBase}`, request)
  }

  channel$(channel: string){
    return this.messages$
      .pipe(filter(msg => msg.channel === channel))
  }

  private$(user: string){
    return this.messages$
      .pipe(filter(msg => msg.target === user))
  }

  disconnect() {

    this.manualClose = true;

    this.socket$?.complete();
    this.socket$ = undefined;

    console.log('WS cerrado manualmente');

  }

  ngOnDestroy() {
    this.socket$?.complete();
  }

}
