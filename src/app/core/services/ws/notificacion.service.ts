import {Injectable, OnDestroy} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject, retry, retryWhen, Subscription, tap, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService implements OnDestroy {

  private socket$?: WebSocketSubject<string>;
  private subscription?: Subscription;

  private messageSubject = new BehaviorSubject<string[]>([]);
  message$ = this.messageSubject.asObservable();

  private readonly MAX_MESSAGES = 100;
  private username?: string;
  private reconnectAttempts = 0;
  private readonly MAX_RETRIES = 5;

  connect(username: string) {
    this.username = username;
    this.disconnet(); //limpiar conexion previa

    const url =`ws://192.168.112.245:8082/ws/notify?user=${this.username}&canal=public`;

    this.socket$ = webSocket<string>({
      url,
      deserializer: msg => msg.data
    });

    this.subscription = this.socket$
      .pipe(
        retry({
          count: this.MAX_RETRIES,
          delay: (error, retryCount) => {
            console.warn(`Intentando reconectar (${retryCount})`);
            return timer(200); // 200ms entre intentos
          }
        })
      )
      .subscribe({
        next: message => {
          const current = this.messageSubject.value;
          this.messageSubject.next([
            ...current.slice(-this.MAX_MESSAGES),
            message
          ]);
        },
        error: err => {
          console.error('WebSocket error definitivo:', err);
        },
        complete: () => {
          console.log('WebSocket cerrado');
        }
      });

  }

  disconnet() {
    this.subscription?.unsubscribe();
    this.socket$?.complete();
    this.socket$ = undefined;
    this.reconnectAttempts = 0;
  }

  ngOnDestroy() {
    this.disconnet();
  }
}
