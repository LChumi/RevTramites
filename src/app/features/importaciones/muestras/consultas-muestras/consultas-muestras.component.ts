import {Component, inject} from '@angular/core';
import {MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {ButtonDirective} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MuestraService} from '@services/muestra.service';
import {InputGroupModule} from 'primeng/inputgroup';
import {NgStyle} from '@angular/common';
import {ErrorResponse} from '@dtos/error-response';
import {Producto} from '@models/producto';

@Component({
  standalone: true,
  imports: [
    TableModule,
    TooltipModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    ButtonDirective,
    NgStyle
  ],
  templateUrl: './consultas-muestras.component.html',
  styles: ``
})
export default class ConsultasMuestrasComponent {

  private muestraService = inject(MuestraService)
  private messageService = inject(MessageService);
  tramite: string = '';
  productos: Producto[] = [];
  loading = false;

  buscarMuestras() {
    if (this.tramite) {
      this.loading = true;
      this.muestraService.listarTramite(this.tramite).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.messageService.add({
              severity: 'success',
              summary: 'Exito',
              detail: 'Se econtraron registros '
            })
            this.productos = data;
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
          this.productos = [];
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
