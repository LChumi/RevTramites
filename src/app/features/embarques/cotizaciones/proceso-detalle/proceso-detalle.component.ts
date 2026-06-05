import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProcesoCotizacionService} from '@services/embarque/proceso-cotizacion.service';
import {ProcesoCotizacion} from '@models/embarque/proceso-cotizacion';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {
  SalidaBuqueFormComponent
} from '@features/embarques/cotizaciones/proceso-detalle/components/salida-buque-form/salida-buque-form.component';
import {PuertoEmbarque} from '@models/embarque/puerto-embarque';
import {Consignatario} from '@models/embarque/consignatario';
import {PuertoEmbarqueService} from '@services/embarque/puerto-embarque.service';
import {ConsignatarioService} from '@services/embarque/consignatario.service';
import {SalidaBuque} from '@models/embarque/salida-buque';
import {SalidaBuqueService} from '@services/embarque/salida-buque.service';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {OpcionBarataResponse} from '@models/embarque/opcion-barata-response';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {FleteValidacionRequest} from '@models/embarque/flete-validacion-request';
import {FleteValidadoService} from '@services/embarque/flete-validado.service';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-proceso-detalle',
  standalone: true,
  imports: [
    SalidaBuqueFormComponent,
    DatePipe,
    PrimeTemplate,
    TableModule,
    TagModule,
    TooltipModule,
    CardModule,
    BadgeModule,
    ProgressSpinnerModule,
    Button,
    ConfirmDialogModule
  ],
  templateUrl: './proceso-detalle.component.html',
  styles: ``
})
export default class ProcesoDetalleComponent implements OnInit {

  @ViewChild('formEditar') formEditar!: SalidaBuqueFormComponent;

  private puertoService = inject(PuertoEmbarqueService);
  private consignatarioService = inject(ConsignatarioService)
  private procesoService = inject(ProcesoCotizacionService)
  private salidaBuque = inject(SalidaBuqueService)
  private messageService = inject(MessageService)
  private route = inject(ActivatedRoute)
  private fleteService = inject(FleteValidadoService)
  private router = inject(Router)
  private confirmationService = inject(ConfirmationService)

  private usrId = sessionStorage.getItem('username') ?? '';
  salidaBuques: SalidaBuque[] = []
  puertos: PuertoEmbarque[] = [];
  consignatarios: Consignatario[] = [];
  mejorOpcion: OpcionBarataResponse | null = null
  cotizacion: ProcesoCotizacion | null = null
  buqueSeleccionado: SalidaBuque | null = null;


  idProcesoCotizacion: any
  cargandoMejor = false
  validando = false

  ngOnInit(): void {
    this.idProcesoCotizacion = this.route.snapshot.paramMap.get('id') ?? null
    if (this.idProcesoCotizacion == null) {
      this.return()
    }
    this.getCotizacion(this.idProcesoCotizacion);
    this.listarPuerto();
    this.listarConsignatarios();
  }

  getCotizacion(id: string) {
    this.procesoService.getById(id).subscribe({
      next: value => {
        if (value) {
          this.cotizacion = value
          this.getSalidas(id)
          this.cargarMejorOpcion(id)
        } else {
          this.return()
        }
      }
    })
  }

  getSalidas(idCotizacion: string) {
    this.salidaBuque.listByProcesoCotizacion(idCotizacion).subscribe({
      next: value => this.salidaBuques = value
    })
  }

  cargarMejorOpcion(idProceso: string) {
    this.cargandoMejor = true
    this.salidaBuque.bestOption(idProceso).subscribe({
      next: value => {
        if (value) {
          this.mejorOpcion = value
          this.cargandoMejor = false
        } else {
          this.cargandoMejor = false
        }
      },
      error: error => {
        this.cargandoMejor = false
      }
    })
  }

  onBuqueGuardado(buque: SalidaBuque) {
    this.salidaBuques.push(buque); // o recarga la lista
  }

  onBuqueActualizado(buque: SalidaBuque): void {
    const index = this.salidaBuques.findIndex(b => b.id === buque.id);
    if (index !== -1) {
      this.salidaBuques[index] = buque;
    }
  }

  listarPuerto() {
    this.puertoService.list().subscribe({
      next: value => this.puertos = value
    })
  }

  listarConsignatarios() {
    this.consignatarioService.list().subscribe({
      next: value => this.consignatarios = value
    })
  }

  viewBuque(id: string) {
    this.router.navigate(['buque', id], {relativeTo: this.route}).then(r => {
    })
  }

  editarBuque(sal: SalidaBuque): void {
    this.buqueSeleccionado = sal;
    // necesitas un tick para que el input se actualice antes de abrir
    setTimeout(() => this.formEditar.abrir(), 0);
  }

  return() {
    this.router.navigate(['erp/embarques/cotizaciones']).then(r => {
      this.messageService.addAll([
        {severity: 'error', summary: 'Error', detail: 'Valor no identificado'},
        {severity: 'warn', summary: 'Advertencia', detail: 'El identificador no se encuentra disponible '}
      ])
    })
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-EC', {style: 'currency', currency: 'USD'}).format(value);
  }

  confirmarValidacion() {
    if (!this.mejorOpcion) return;
    if (this.mejorOpcion.opcion.numeroBl == '') {
      this.messageService.add({severity: 'warn', summary: 'Flete sin Numero de Bl'})
      this.confirmacionBl(this.mejorOpcion.idBuque)
    } else {
      this.confirmationService.confirm({
        key: 'validarFlete',
        header: 'Confirmar Flete',
        message: '¡Desea validar la mejor opción de Flete!',
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Validar',
        rejectLabel: 'Cancelar',
        accept: () => this.validarMejorOpcion()
      })
    }
  }

  confirmacionBl(idBuque: string) {
    this.confirmationService.confirm({
      key: 'agregarBl',
      message: '¿Desea agregar el Bl ahora al flete o le puede agregar después en embarques?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Agregar',
      rejectLabel: 'Guardar sin BL',
      accept: () => this.viewBuque(idBuque),
      reject: () => this.validarMejorOpcion()
    })
  }

  validarMejorOpcion(): void {
    if (!this.cotizacion) return;

    const salida = this.salidaBuques.find(s => s.id === this.mejorOpcion!.idBuque);
    if (!salida) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia datos sin valores'})
      return;
    }

    const request: FleteValidacionRequest = {
      proceso: this.cotizacion,
      salida: salida,
      consignatario: this.mejorOpcion!.consignatario,
      opcion: this.mejorOpcion!.opcion,
      usuario: this.usrId
    };

    this.validando = true;
    this.fleteService.validarFlete(request).subscribe({
      next: (resultado) => {
        this.validando = false;
        this.messageService.add({
          severity: 'info',
          summary: 'FleteValidado',
          detail: `${resultado.nombreConsignatario}`
        })
        this.goToTramites();
      },
      error: () => {
        this.validando = false;
      }
    });
  }

  goToTramites() {
    this.router.navigate(['erp', 'embarques', 'tramites']).then(r => {
    });
  }

}
