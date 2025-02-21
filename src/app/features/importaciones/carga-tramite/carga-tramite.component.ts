import {Component, inject} from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {FileService} from '../../../core/services/file.service';
import {Producto} from '@models/producto';
import {TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {TramiteService} from '../../../core/services/tramite.service';
import {ToolbarModule} from 'primeng/toolbar';

@Component({
  imports: [
    FileUploadModule,
    FormsModule,
    InputTextModule,
    TableModule,
    Ripple,
    ToolbarModule
  ],
  templateUrl: './carga-tramite.component.html',
  standalone: true,
  styles: ``
})
export default class CargaTramiteComponent {

  private messageService = inject(MessageService)
  private fileService = inject(FileService)
  private tramiteService = inject(TramiteService)

  protected uploadedFiles: any[] = [] ;
  protected tramiteId: any;
  protected observacion: any;
  protected productos: Producto[] = [];
  protected loading = false;

  onUpload(event: any) {
    this.loading = true;
    const files = event.files

    if (files && files.length === 0) {
      this.message('warn', 'Error', 'No hay archivos para enviar')
      return;
    }

    files.forEach((file: File) => {
      this.fileService.sendExcel(file, this.tramiteId, this.observacion).subscribe({
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
    this.messageService.add({ severity: 'info', summary: 'Exito', detail: 'Archivo registrado y guardado con exito' });
  }


  cargarNuevo(){
    this.tramiteId = null
    this.observacion = null
    this.productos = []
  }

  listProductos(tramiteId: any){
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
}
