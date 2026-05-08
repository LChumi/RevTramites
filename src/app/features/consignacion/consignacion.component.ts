import {Component, inject} from '@angular/core';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ConsignacionService} from '@services/consignacion.service';
import {BodegaConsignacion, RelacionConsignacion, RELACIONES_CONSIGNACION} from '../../core/mocks/bodega-consignacion';
import {ConsignacionRequest} from '@dtos/consignacion-request';

@Component({
  selector: 'app-consignacion',
  standalone: true,
  imports: [
    CardModule,
    DropdownModule,
    FormsModule,
    Button,
    InputTextModule,
    ProgressSpinnerModule
  ],
  templateUrl: './consignacion.component.html',
  styles: ``
})
export default class ConsignacionComponent {

  private consignacionService = inject(ConsignacionService);

  relaciones: RelacionConsignacion[] = RELACIONES_CONSIGNACION;

  consignacionSeleccionada?: RelacionConsignacion;
  bodegaDestino: BodegaConsignacion[] = [];
  cco!: string
  bodFin!: number
  codigoGenerado!: string
  generando: boolean = false;

  onChangeConsignacion() {
    if (!this.consignacionSeleccionada) {
      this.bodegaDestino = [];
      return;
    }

    this.bodegaDestino = this.consignacionSeleccionada.bodegasDestino;
  }
  generarConsignacion() {
    if (!this.consignacionSeleccionada || !this.bodFin || !this.cco) {
      alert("Escoga una bodega de consignacion");
      return;
    }

    this.generando = true;
    const request: ConsignacionRequest = {
      empresa: this.consignacionSeleccionada?.consignacion.empresa,
      bodIni: this.consignacionSeleccionada?.consignacion.codigo,
      bodFin: this.bodFin,
      comprobante: this.cco
    }

    this.consignacionService.generarConsignacion(request).subscribe({
      next: resp => {
        if (resp.status && this.isValidResponse(resp.mensaje)) {
          console.log("Éxito:", resp.mensaje);
          this.codigoGenerado = resp.mensaje;
        } else {
          console.error("Error:", resp.mensaje);
          alert("Respuesta vacía del servicio");
        }
        this.generando = false;
      },
      error: error => {
        alert(`Error al generar consignacion`);
        this.generando = false;
      }
    });
  }

  private isValidResponse(resp: string | null | undefined): boolean {
    return !!resp && resp.trim().length > 0;
  }

}
