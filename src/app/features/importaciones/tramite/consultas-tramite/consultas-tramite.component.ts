import {Component, inject} from '@angular/core';
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
import {Producto} from '@models/producto';
import {TabViewModule} from 'primeng/tabview';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';

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
    NgStyle,
    TabViewModule,
    ProcesoTramitePipe
  ],
  templateUrl: './consultas-tramite.component.html',
  styles: ``
})
export default class ConsultasTramiteComponent {

  private tramiteService = inject(TramiteService);
  private messageService = inject(MessageService);

  tramites: Tramite[] = [];
  productos: Producto[] = []

  id: any;
  estado: any;
  estados: any[] = [
    {name: 'Registrado', status: 1},
    {name: 'Pendiente', status: 2},
    {name: 'Validado', status: 3},
    {name: 'Muestra', status: 4},
    {name: 'Finalizado', status: 5}]
  fechaInicio: any;
  fechaFin: any;
  loading: boolean = false;

  find() {
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

    if (count < 1) {
      this.loading = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos vacíos',
        detail: 'Por favor, ingrese un valor en al menos un campo.'
      });
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
          this.messageService.add({
            severity: 'info',
            summary: 'Datos encontrados',
            detail: 'Se encontraron trámites exitosamente.'
          });
        } else {
          this.tramites = []
          this.messageService.add({severity: 'warn', summary: 'Sin datos', detail: 'No se encontraron trámites.'});
        }
      }, error: (err: ErrorResponse) => {
        this.loading = false;
        this.tramites = []
        this.messageService.add({severity: 'error', summary: 'Error', detail: `Ocurrió un problema: ${err.message}`});
      }
    })
  }

  listarProducto(tramiteId: string) {
    this.tramiteService.productos(tramiteId).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.productos = data;
        } else {
          this.productos = []
        }
      }
    })
  }
}
