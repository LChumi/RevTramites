import {Component, inject} from '@angular/core';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TramiteService} from '@services/tramite.service';
import {Tramite} from '@models/tramite';
import {getCurrentDate, getCurrentTime, getTime} from '@utils/date-utils';
import {ErrorResponse} from '@dtos/error-response';
import {MessageService} from 'primeng/api';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {Table, TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {NgStyle} from '@angular/common';
import {Producto} from '@models/producto';
import {TabViewModule} from 'primeng/tabview';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';
import {DialogModule} from 'primeng/dialog';
import {RevisionService} from '@services/revision.service';
import {Contenedor} from '@models/contenedor';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {ToolbarModule} from 'primeng/toolbar';
import {converToExcel} from '@utils/excel-utils';

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
    ProcesoTramitePipe,
    DialogModule,
    EstadoColorPipe,
    ToolbarModule
  ],
  templateUrl: './consultas-tramite.component.html',
  styles: ``
})
export default class ConsultasTramiteComponent {

  private tramiteService = inject(TramiteService);
  private revisionService = inject(RevisionService);
  private messageService = inject(MessageService);

  modalVisibility: { [key: string]: boolean } = {};

  tramites: Tramite[] = [];
  productos: Producto[] = [];
  contenedores: Contenedor[] = [];

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
  fechaArribo: any;
  horaArribo: any;
  loading: boolean = false;
  sending: boolean = false;
  tramiteId: string = '';

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

  obtenerDatos(tramiteId: string) {
    this.listarProducto(tramiteId)
    this.getContenedores(tramiteId)
  }

  listarProducto(tramiteId: string) {
    this.tramiteService.productos(tramiteId).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.productos = data;
          this.tramiteId = tramiteId;
        } else {
          this.productos = []
        }
      }
    })
  }

  getContenedores(tramiteId: string) {
    this.revisionService.getContenedores(tramiteId).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.contenedores = data;
        } else {
          this.contenedores = []
        }
      }
    })
  }

  updateDate(id: string) {

    if (this.fechaArribo && this.horaArribo){
      this.sending = true
      this.fechaArribo = getCurrentDate(this.fechaArribo)
      this.horaArribo = getTime(this.horaArribo)
      this.tramiteService.updateDate(this.fechaArribo, this.horaArribo, id).subscribe({
        next: data => {
          if (data.status) {
            this.messageService.add({
              severity: 'info',
              summary: `${data.info}, Fecha de arribo agregada`,
              detail: 'Se actualizo la fecha de arribo, se envio notificacion a los usuarios'
            });
            this.cerrarModal(id)
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Observacion',
              detail: 'Se encontro un problema al actualizar la fecha de arribo'
            });
            this.cerrarModal(id)
          }
        },
        error: err => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ocurrio un problema en el servidor'});
          this.cerrarModal(id)
        }
      })
    }else {
      this.messageService.add({severity: 'warn', summary: 'Llene los campos por favor', detail: 'Ingrese los datos'});
    }
  }

  mostrarModal(tramiteId: string) {
    this.modalVisibility[tramiteId] = true;
  }

  cerrarModal(tramiteId: string) {
    this.modalVisibility[tramiteId] = false;
    this.sending = false
    this.fechaArribo = null
    this.horaArribo = null
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportToExcel() {
    converToExcel(this.productos, this.tramiteId)
  }
}
