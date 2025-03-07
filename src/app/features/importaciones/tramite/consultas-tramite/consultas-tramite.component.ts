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
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {NgStyle} from '@angular/common';

@Component({
  standalone: true,
  imports: [
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    TableModule,
    Ripple,
    ToggleButtonModule,
    NgStyle
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
  estados: any[] =[{name: 'Finalizado', status: true},{name: 'Pendiente', status: false}]
  fechaInicio: any;
  fechaFin: any;
  loading: boolean = false;

  find(){
    this.loading = true;
    const formatetedDateStart = getCurrentDate(this.fechaInicio)
    const formatetedDateEnd = getCurrentDate(this.fechaFin)

    const id = this.id ? this.id : null;
    const estado = this.estado ? this.estado.status : null;

    let count = 0;
    if (id) count++;
    if (estado) count++;
    if (formatetedDateEnd) count++;
    if (formatetedDateStart) count++;

    if (count < 1){
      this.loading = false;
      this.messageService.add({severity: 'warn', summary: 'Campos vacios', detail: 'Ingrese valor almenos en un campo '});
      return
    }

    this.tramiteService.buscar(
      id,
      estado,
      formatetedDateStart,
      formatetedDateEnd,
    ).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.tramites = data;
          this.loading = false;
          this.messageService.add({severity: 'info', summary: 'Ok', detail:''})
        } else {
          this.tramites = []
          this.messageService.add({severity: 'warn', summary: 'Sin datos', detail:'No se encontraron Tramites'})
        }
      }, error: (err : ErrorResponse) => {
        this.loading = false;
        this.tramites = []
        this.messageService.add({severity: 'error', summary: 'Error', detail:`Ocurrió un problema: ${err.message}`})
      }
    })

  }
}
