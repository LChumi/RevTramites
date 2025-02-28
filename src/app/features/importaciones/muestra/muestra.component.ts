import {Component, inject} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {TramiteService} from '../../../core/services/tramite.service';
import {Tramite} from '@models/tramite';
import {MessageService} from 'primeng/api';

@Component({
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule
  ],
  templateUrl: './muestra.component.html',
  styles: ``
})
export default class MuestraComponent {

  private tramiteService = inject(TramiteService);
  private messageService = inject(MessageService);

  tramites: Tramite[] = [];
  barra: any;
  muestra: any;

  listarCmpletos() {
    this.tramiteService.pending().subscribe({
      next: (tramites) => {
        if (tramites.length > 0) {
          this.tramites = tramites
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No existen Tramites ',
          detail: 'No se encontraron Tramites Pendientes de verificar '
        });

      }
    })
  }
}
