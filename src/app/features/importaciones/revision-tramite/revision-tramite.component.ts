import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputGroupModule} from 'primeng/inputgroup';
import {ButtonDirective} from 'primeng/button';
import {TramiteService} from '../../../core/services/tramite.service';
import {RevisionService} from '../../../core/services/revision.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Revision} from '@models/revision';
import {TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';

@Component({
  imports: [
    FormsModule,
    InputTextModule,
    InputGroupModule,
    ButtonDirective,
    TableModule,
    Ripple
  ],
  templateUrl: './revision-tramite.component.html',
  standalone: true,
  styles: ``
})
export default class RevisionTramiteComponent {

  private tramiteService = inject(TramiteService)
  private revisionService = inject(RevisionService)
  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)

  protected tramiteId: any
  protected barra: any
  protected tramiteExist = false;
  protected revisiones: Revision[] = [];
  protected revision: Revision | null = null;

  buscarTramite(){
    if (this.tramiteId){
      this.tramiteService.findById(this.tramiteId).subscribe({
        next: response=> {
          if (response){
            this.tramiteExist = true;
            this.revisionService.findByTramite(this.tramiteId).subscribe({
              next: response=> {
                if (response){
                  this.revisiones = response;
                }
              }
            })
            this.message('info','Tramite existe', 'Se encontro el registro de tramite');
          }else {
            this.tramiteExist = false;
            this.message('warn','Tramite no existe', 'No se encontro registro de tramite');
          }
        }
      })
    }
  }

  escaneo(){
    if (this.tramiteId && this.barra){
      this.revisionService.updateQuantity(this.tramiteId, this.barra, 'Prueba').subscribe({
        next: response=> {
          if (response){
            this.revision = response;
            this.revisionService.findByTramite(this.tramiteId).subscribe({
              next: response=> {
                this.revisiones = response;
              }
            })
          }
        }
      })
    }
  }

  validarTramite(){
    this.confirmationService.confirm({
      message: 'Productos escaneados ¿Validar Tramite?',
      header: 'Confirmacion',
      icon: 'pi pi-check',
      accept: () => {
        this.revisionService.updateQuantities(this.tramiteId).subscribe({
          next: response=> {
            if (response){
              this.revisiones = response;
            }
          }
        })
      },
      reject: () => {
        return
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
