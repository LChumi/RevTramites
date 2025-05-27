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

    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos vacios',
        detail: 'Ingrese el tramite a buscar',
      })
    }
  }
}
