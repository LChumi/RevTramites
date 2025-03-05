import {Component, inject, OnInit} from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {FileService} from '@services/file.service';
import {Producto} from '@models/producto';
import {TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {TramiteService} from '@services/tramite.service';
import {ToolbarModule} from 'primeng/toolbar';
import {converToExcel} from '@utils/excel-utils';
import {CalendarModule} from 'primeng/calendar';
import {getCurrentDate} from '@utils/date-utils';

@Component({
  imports: [
    FileUploadModule,
    FormsModule,
    InputTextModule,
    TableModule,
    Ripple,
    ToolbarModule,
    CalendarModule,
  ],
  templateUrl: './carga-tramite.component.html',
  standalone: true,
  styles: ``
})
export default class CargaTramiteComponent implements OnInit {

  private messageService = inject(MessageService)
  private fileService = inject(FileService)
  private tramiteService = inject(TramiteService)

  protected uploadedFiles: any[] = [];
  protected tramiteId: any;
  protected contenedor: any;
  protected productos: Producto[] = [];
  protected loading = false;
  fecha: any
  minDate: Date | undefined

  onUpload(event: any) {
    this.loading = true;
    const files = event.files

    if (files && files.length === 0) {
      this.message('warn', 'Error', 'No hay archivos para enviar')
      return;
    }

    if (!this.fecha) {
      this.message('warn', 'Datos vacios', 'Ingrese la fecha')
      return;
    }
    const fecha = getCurrentDate(this.fecha);

    files.forEach((file: File) => {
      this.fileService.sendExcel(file, fecha, this.tramiteId, this.contenedor).subscribe({
        next: response => {
          if (response == null) {
            this.message('warn', 'Advertencia', 'El archivo esta vacio')
            this.loading = false
          }
          this.message('success', 'Envio completo', 'archivo enviado exitosamente')
          this.listProductos(response.id);
          this.loading = false
        }
      })
    })
    this.message('info', 'Exito', 'Archivo registrado y guardado con exito');
  }


  cargarNuevo() {
    this.tramiteId = null
    this.contenedor = null
    this.productos = []
    this.fecha = null
  }

  agregarContenedor() {
    this.contenedor = null
    this.productos = []
  }

  listProductos(tramiteId: any) {
    this.tramiteService.productos(tramiteId).subscribe({
      next: response => {
        if (response == null) {
          this.message('warn', 'Sin productos', 'El tramite no tiene productos registrados')
        }
        this.productos = response
      }
    })
  }

  message(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail
    });
  }

  exportToExcel() {
    converToExcel(this.productos, this.tramiteId)
  }

  ngOnInit(): void {
    this.minDate = new Date();
  }
}
