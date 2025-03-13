import {Component, inject} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {Revision} from '@models/revision';
import {RevisionService} from '@services/revision.service';
import {ErrorResponse} from '@dtos/error-response';
import {KeyValuePipe, NgStyle} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {CheckboxModule} from 'primeng/checkbox';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';

@Component({
  standalone: true,
  imports: [
    ButtonDirective,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    NgStyle,
    Ripple,
    EstadoColorPipe,
    KeyValuePipe,
    CheckboxModule,
    ToggleButtonModule,
    ProcesoTramitePipe
  ],
  templateUrl: './consultas-revision.component.html',
  styles: ``
})
export default class ConsultasRevisionComponent {

  revisionService = inject(RevisionService)
  messageService = inject(MessageService)
  tramite: string = ''
  loading: boolean = false;
  revisiones: Revision[] = []

  buscarRevisiones() {
    if (this.tramite) {
      this.loading = true;
      this.revisionService.findByTramite(this.tramite).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.messageService.add({
              severity: 'success',
              summary: 'Exito',
              detail: 'Se econtraron registros '
            })
            this.revisiones = data;
            this.loading = false;
            this.tramite = ''
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: `No existen datos en el tramite ${this.tramite}`,
            })
            this.tramite = ''
          }
        },
        error: (err: ErrorResponse) => {
          this.revisiones = [];
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrio un problema',
            detail: err.message,
          })
        }
      })
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos vacios',
        detail: 'Ingrese el tramite a buscar',
      })
    }
  }
}
