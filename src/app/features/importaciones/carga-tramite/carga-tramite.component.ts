import {Component, inject} from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  imports: [
    FileUploadModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './carga-tramite.component.html',
  standalone: true,
  styles: ``
})
export default class CargaTramiteComponent {

  private messageService = inject(MessageService)
  protected uploadedFiles: any[] = [] ;
  protected observacion: any;

  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'Exito', detail: 'Archivo registrado y guardado con exito' });
  }
}
