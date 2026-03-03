import {Injectable, OnDestroy} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject, retry, Subscription, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService implements OnDestroy {

  private sockets = new Map<string, WebSocketSubject<string>>();
  private subscriptions = new Map<string, Subscription>();

  private messageSubject = new BehaviorSubject<string[]>([]);
  message$ = this.messageSubject.asObservable();

  private readonly MAX_MESSAGES = 100;
  private username!: string;

  init(username: string) {
    this.username = username;
  }

  connect(channel: string) {

    if (this.sockets.has(channel)) return;

    const url =
      `ws://192.168.112.245:8082/ws/notify?user=${this.username}&canal=${channel}`;

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
          this.connect(channel);
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
        const current = this.messageSubject.value;
        this.messageSubject.next([
          ...current.slice(-this.MAX_MESSAGES),
          message
        ]);
      });

    this.sockets.set(channel, socket$);
    this.subscriptions.set(channel, sub);
  }

  send(channel: string, message: string) {
    this.sockets.get(channel)?.next(message);
  }

  disconnect(channel: string) {
    this.subscriptions.get(channel)?.unsubscribe();
    this.sockets.get(channel)?.complete();
    this.sockets.delete(channel);
    this.subscriptions.delete(channel);
    console.log("Conexion ws finalizada")
  }

  ngOnDestroy() {
    this.sockets.forEach((_, channel) => this.disconnect(channel));
  }
}
