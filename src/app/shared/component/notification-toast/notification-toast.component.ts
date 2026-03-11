import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastModule} from 'primeng/toast';
import {WsService} from '@services/ws/ws.service';
import {MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [
    ToastModule
  ],
  templateUrl: './notification-toast.component.html',
  styles: ``
})
export class NotificationToastComponent implements OnInit , OnDestroy{

  private ws = inject(WsService)
  private messageService = inject(MessageService)

  private sub?: Subscription;

  ngOnInit() {

    this.sub = this.ws.channel$('tramites')
      .pipe(filter(m => !!m?.message))
      .subscribe(msg => {

        this.messageService.add({
          key: 'ntf',
          severity: 'info',
          summary: `Canal: ${msg.channel}`,
          detail: msg.message,
          life: 3000
        })
      })

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
