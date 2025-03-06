import {Component, inject} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TramiteService} from '@services/tramite.service';
import {Tramite} from '@models/tramite';
import {getCurrentDate} from '@utils/date-utils';
import {ErrorResponse} from '@dtos/error-response';
import {MessageService} from 'primeng/api';
import {CalendarModule} from 'primeng/calendar';

@Component({
  standalone: true,
  imports: [
    ButtonDirective,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule
  ],
  templateUrl: './consultas-tramite.component.html',
  styles: ``
})
export default class ConsultasTramiteComponent {

  private tramiteService = inject(TramiteService);
  private messageService = inject(MessageService);

  tramites: Tramite[] = [];

  id: any;
  estado: any;
  fechaInicio: any;
  fechaFin: any;
  loading: boolean = false;

  find(){
    this.loading = true;
    const formatetedDateStart = getCurrentDate(this.fechaInicio)
    const formatetedDateEnd = getCurrentDate(this.fechaFin)

    const id = this.id ? this.id : null;
    const estado = this.estado ? this.estado : null;

    let count = 0;
    if (id) count++;
    if (estado) count++;
    if (formatetedDateEnd) count++;
    if (formatetedDateStart) count++;

    if (count < 1){
      this.loading = false;
      return
    }

    this.tramiteService.buscar(
      id,
      estado,
      formatetedDateStart,
      formatetedDateEnd,
    ).subscribe({
      next: data => {
        this.tramites = data;
        this.loading = false;
      }, error: (err : ErrorResponse) => {
        this.loading = false;
        this.tramites = []
      }
    })

  }
}
