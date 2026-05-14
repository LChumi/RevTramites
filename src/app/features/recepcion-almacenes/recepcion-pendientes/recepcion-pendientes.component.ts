import {Component, inject, OnInit} from '@angular/core';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {RecepcionAlmacenesService} from '@services/recepcion-almacenes.service';
import {BodegaService} from '@services/bodega.service';
import {DatePipe} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ComprobantesCcoRequest} from '@dtos/recepcion-almacenes/comprobantes-cco-request';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-recepcion-pendientes',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    TableModule,
    Button,
    DatePipe,
    ProgressSpinnerModule
  ],
  templateUrl: './recepcion-pendientes.component.html',
  styles: ``
})
export default class RecepcionPendientesComponent implements OnInit {
  recepcionService = inject(RecepcionAlmacenesService);
  bodegaService = inject(BodegaService);
  messageService = inject(MessageService);

  bodegas: any[] = [];

  comprobantes: any[] = [];

  selectedComprobantes: any[] = [];

  productos: any[] = [];

  selectedBodega: any;

  loading = false;
  productView = false

  usuario = sessionStorage.getItem('usercode') ?? '';
  usrId = sessionStorage.getItem('usrId') ?? '';
  empresa = sessionStorage.getItem('idEmpresa') ?? '';

  ngOnInit(): void {
    if (this.usuario == '' || this.empresa == '' || this.usrId == ''){
      alert("Vuelva a iniciar sesion")
    }
    this.listarBodegas();
  }

  listarBodegas() {

    this.bodegaService.getBodegas(this.usuario, this.empresa)
      .subscribe({
        next: (result) => {
          this.bodegas = result;
        }
      });
  }

  listarComprobantes() {

    this.loading = true;

    if (!this.selectedBodega) return;

    this.recepcionService
      .getComprobantesByBodega(this.selectedBodega.bod_codigo)
      .subscribe({
        next: (result) => {
          this.comprobantes = result;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false
        }
      });
  }

  procesarSeleccionados() {

    console.log(this.selectedComprobantes);

    if (this.selectedComprobantes.length === 0) {
      alert("Lista vacia")
      return;
    }
    const ccoCodigos: number[] = this.selectedComprobantes.map(c => c.ccoComproba);

    const emp = Number(this.empresa);
    if (isNaN(emp)) {
      console.error("El valor no es numérico");
    }


    const request : ComprobantesCcoRequest = {
      bodega: this.selectedBodega.bod_codigo,
      usuario: this.usrId,
      empresa: emp,
      ccoCodigos
    }

    this.productView = true;

    /*this.recepcionService
      .getListProductos(request)
      .subscribe({
        next: (result) => {
          this.productos = result;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error en el servicio ',
            detail: error.message,
          })
        }
      })*/


  }

}
