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
import {Router} from '@angular/router';
import {SidebarService} from '@services/state/sidebar.service';

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
export default class RecepcionPendientesComponent implements OnInit{

  private recepcionService = inject(RecepcionAlmacenesService);
  private bodegaService = inject(BodegaService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private sidebarService = inject(SidebarService)

  bodegas: any[] = [];
  comprobantes: any[] = [];
  selectedComprobantes: any[] = [];
  productos: any[] = [];
  selectedBodega: any;

  loading = false;

  private usuario = sessionStorage.getItem('usercode') ?? '';
  private usrId = sessionStorage.getItem('usrId') ?? '';
  private empresa = sessionStorage.getItem('idEmpresa') ?? '';

  ngOnInit(): void {
    if (this.usuario == '' || this.empresa == '' || this.usrId == '') {
      alert("Vuelva a iniciar sesion")
    }
    this.listarBodegas();
  }

  listarBodegas() {

    this.bodegaService.getBodegas(this.usuario, this.empresa)
      .subscribe({
        next: (result) => {
          this.bodegas = result;
          this.sidebarService.update({pendientes: this.comprobantes.length})
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
          this.sidebarService.update({pendientes: this.comprobantes.length})
        },
        error: (error) => {
          this.loading = false
        }
      });
  }

  listarFacturas(){
    this.loading = true;

    const emp = Number(this.empresa);
    if (isNaN(emp)) {
      console.error("El valor no es numérico");
    }

    this.recepcionService
      .getComprobantesByEmpresaAndTipo(emp, 1).subscribe({
      next: (result) => {
        if (!this.comprobantes || this.comprobantes.length === 0) {
          // Si está vacío, asigna directamente
          this.comprobantes = result;
        } else {
          // Si ya tiene datos, fusiona
          this.comprobantes = [...this.comprobantes, ...result];
        }
        this.loading = false;
        this.sidebarService.update({pendientes: this.comprobantes.length})
      }, error: (error) => {
        console.log(error);
        this.loading = false;
      }
    })
  }

  procesarSeleccionados() {

    this.loading = true;


    if (this.selectedComprobantes.length === 0) {
      alert("Lista vacia")
      return;
    }
    const ccoCodigos: number[] = this.selectedComprobantes.map(c => c.ccoComproba);

    const emp = Number(this.empresa);
    if (isNaN(emp)) {
      console.error("El valor no es numérico");
    }

    const obs = this.selectedComprobantes.map(c => c.comprobante).join(', ');

    const request: ComprobantesCcoRequest = {
      bodega: this.selectedBodega.bod_codigo,
      usuario: this.usrId,
      empresa: emp,
      observacion: obs,
      ccoCodigos
    }

    this.recepcionService
      .initRevision(request)
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.messageService.add({
              severity: 'success',
              summary: result.message,
            })
            this.router.navigate(['erp','recepcion-almacenes','registrados']).then(r => {this.loading = false;});
          }
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error en el servicio ',
            detail: error.message,
          })
        }
      })
  }

}
