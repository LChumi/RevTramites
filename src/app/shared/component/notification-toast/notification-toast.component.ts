import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastModule} from 'primeng/toast';
import {NotificacionService} from '@services/ws/notificacion.service';
import {MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';

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

  private notificacionSevrice = inject(NotificacionService)
  private service = inject(MessageService)

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.notificacionSevrice.message$
      .subscribe(message => {
        this.service.add({
          key: 'ntf',
          severity: 'info',
          summary: 'Notificación',
          detail: message,
          life: 3000
        });
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
