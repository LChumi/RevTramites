import {Component, inject, OnInit} from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import {ConfirmationService, MessageService} from 'primeng/api';
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
import {SidebarModule} from 'primeng/sidebar';
import {EmailsService} from '@services/emails.service';
import {Emails} from '@models/emails';
import {Destinatario} from '@models/destinatario';

@Component({
  imports: [
    FileUploadModule,
    FormsModule,
    InputTextModule,
    TableModule,
    Ripple,
    ToolbarModule,
    CalendarModule,
    SidebarModule,
  ],
  templateUrl: './carga-tramite.component.html',
  standalone: true,
  styles: ``
})
export default class CargaTramiteComponent implements OnInit {

  private messageService = inject(MessageService)
  private fileService = inject(FileService)
  private tramiteService = inject(TramiteService)
  private emailService = inject(EmailsService)
  private confirmationService = inject(ConfirmationService)

  protected uploadedFiles: any[] = [];
  protected tramiteId: any;
  protected emailText: any;
  protected contenedor: any;
  protected productos: Producto[] = [];
  protected loading = false;
  protected email: Emails = {} as Emails;
  private tipo = 1
  fecha: any
  minDate: Date | undefined
  visibleSidebarEmails: boolean = false;

  onUpload(event: any) {
    this.loading = true;
    const files = event.files

    if (files && files.length === 0) {
      this.message('warn', 'Error', 'No hay archivos para enviar')
      return;
    }

    if (!this.contenedor){
      this.message('warn', 'Contenedor vacio', 'Ingrese el nombre del contenedor o numero de contenedor ')
      return;
    }

    if (!this.fecha) {
      this.message('warn', 'Datos vacios', 'Ingrese la fecha')
      return;
    }
    const fecha = getCurrentDate(this.fecha);

    files.forEach((file: File) => {
      this.fileService.sendExcel(file, fecha, this.tramiteId.toUpperCase(), this.contenedor.toUpperCase()).subscribe({
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
    this.uploadEmails()
  }

  uploadEmails(){
    this.emailService.getByTipo(this.tipo).subscribe({
      next: response => {
        this.email = response;
      }
    })
  }

  addAddressee(emailRef: any){
    if (emailRef.invalid) {
      this.message('error', 'Error', 'Ingrese un correo valido');
      this.emailText = ''
      return;
    }
    const addressee : Destinatario= {
      direccion: this.emailText,
    }
    this.emailService.addAddressee(this.tipo,addressee ).subscribe({
      next: response => {
        this.email = response;
        this.emailText = ''
        this.message('info', 'Agregado', 'Se registro el correo con éxito');
      },
      error: error => {
        this.message('error', 'Error', `${error.message}`);
        this.emailText = ''
      }
    })
  }

  removeAddressee(email:string) {
    this.confirmationService.confirm({
      message: '¿Esta seguro de quitar este correo?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-circle',
      accept: () => {
        this.emailService.removeAddressee(this.tipo, email).subscribe({
          next: response => {
            this.email = response;
            this.message('warn', 'Eliminado', 'Correo eliminado')
          },
          error: err => {
            this.message('error', 'Error', `Ocurrió un problema: ${err.message}`);
          }
        })
      }
    })
  }

  checkTramite(){
    this.loading = true
    this.confirmationService.confirm({
      message: 'Desea Finalizar la carga de Tramites y enviar a los subscritores el email',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-circle',
      accept: () => {
        this.fileService.sendTramite(this.tramiteId.toUpperCase()).subscribe({
          next: response => {
            this.message('info', 'Tramite finalizado', 'Se registro el tramite y se envio a los subscritores el email' );
            this.loading = false
            this.cargarNuevo();
          }, error: error => {
            this.message('error', 'Error', `${error.message}`);
          }
        })
      }
    })
  }
}
