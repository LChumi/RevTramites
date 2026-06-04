import {Component, inject, OnInit} from '@angular/core';
import {MessageModule} from 'primeng/message';
import {CurrencyPipe} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DividerModule} from 'primeng/divider';
import {BadgeModule} from 'primeng/badge';
import {TagModule} from 'primeng/tag';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import {ActivatedRoute, Router} from '@angular/router';
import {ProcesoCotizacionService} from '@services/embarque/proceso-cotizacion.service';
import {SalidaBuqueService} from '@services/embarque/salida-buque.service';
import {SalidaBuque} from '@models/embarque/salida-buque';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {OpcionFlete} from '@models/embarque/opcion-flete';
import {DropdownModule} from 'primeng/dropdown';
import {PUERTOS_DESTINO_MOCK, TIPOS_CONTENEDOR_MOCK} from '@mocks/embarque';

@Component({
  selector: 'app-opcion-flete',
  standalone: true,
  imports: [
    MessageModule,
    ProgressSpinnerModule,
    DividerModule,
    BadgeModule,
    TagModule,
    DialogModule,
    SidebarModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    CurrencyPipe,
    TooltipModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule
  ],
  templateUrl: './opcion-flete.component.html',
  styles: ``
})
export default class OpcionFleteComponent implements OnInit{

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)
  private procesoService = inject(ProcesoCotizacionService)
  private salidaBuque = inject(SalidaBuqueService)
  private fb = inject(FormBuilder)

  idProcesoCotizacion: string | null = null
  idBuque: string | null = null
  idCotizacionConsignatario: string = ''
  opciones: OpcionFlete[] = []
  loading = false
  dialogVisible = false
  guardando = false
  opcionEditando: OpcionFlete | null = null
  tiposContenedor = TIPOS_CONTENEDOR_MOCK
  puertosDestinos = PUERTOS_DESTINO_MOCK

  form!: FormGroup;

  totales = { subtotalFlete: 0, subtotalGastos: 0, ivaBl: 0, ivaHandling: 0, total: 0 }

  ngOnInit() {
    this.idProcesoCotizacion = this.route.snapshot.paramMap.get('id')
    this.idBuque = this.route.snapshot.paramMap.get('idBuque')
    if (this.idProcesoCotizacion && this.idBuque) {
      this.getData(this.idProcesoCotizacion)
      this.buildForm()
    }
  }

  buildForm() {
    this.form = this.fb.group({
      tipoContenedor: ['', Validators.required],
      espacioM3: [0, Validators.required],
      puertoDestino: ['', Validators.required],
      flete: [null],
      thc: [null],
      imo: [0],
      gastosBl: [null],
      handlingContenedor: [null],
      porcentajeIva: [0.15],
    })
  }

  getData(id: string) {
    this.procesoService.getById(id).subscribe({
      next: value => value ? this.getSalidas(id) : this.return()
    })
  }

  getSalidas(idProceso: string) {
    this.loading = true
    this.salidaBuque.listByProcesoCotizacion(idProceso).subscribe({
      next: (value: SalidaBuque[]) => {
        const salida = value.find(s => s.id === this.idBuque)
        if (!salida) { this.return(); return }
        this.opciones = salida.cotizacion?.opciones ?? []
        this.idCotizacionConsignatario = salida.cotizacion.id;
        this.loading = false
      },
      error: () => { this.loading = false; this.return() }
    })
  }

  abrirDialog(opcion?: OpcionFlete) {
    this.opcionEditando = opcion ?? null
    if (opcion) {
      this.form.patchValue(opcion)
      this.calcular()
    } else {
      this.buildForm()
      this.totales = { subtotalFlete: 0, subtotalGastos: 0, ivaBl: 0, ivaHandling: 0, total: 0 }
    }
    this.dialogVisible = true
  }

  cerrarDialog() {
    this.dialogVisible = false
    this.opcionEditando = null
  }

  onTipoContenedorChange(event: any): void {
    const contenedor = this.tiposContenedor.find(
      t => t.value === event.value
    );

    if (contenedor) {
      this.form.patchValue({
        espacioM3: contenedor.med
      });
    }
  }

  calcular() {
    const v = this.form.getRawValue()
    const flete = v.flete ?? 0
    const thc = v.thc ?? 0
    const imo = v.imo ?? 0
    const gastosBl = v.gastosBl ?? 0
    const handling = v.handlingContenedor ?? 0
    const pct = v.porcentajeIva ?? 0  // ya viene como 0.15, no dividir

    const subtotalFlete = flete + thc + imo
    const ivaBl = gastosBl * pct
    const ivaHandling = handling * pct
    const subtotalGastos = gastosBl + ivaBl + handling + ivaHandling
    const total = subtotalFlete + subtotalGastos

    this.totales = { subtotalFlete, subtotalGastos, ivaBl, ivaHandling, total }
  }

  guardar() {
    if (this.form.invalid || !this.idBuque || !this.idProcesoCotizacion) return

    const payload: OpcionFlete = {
      ...this.form.getRawValue() as OpcionFlete,
      ...this.totales
    }

    this.guardando = true
    const request$ = this.opcionEditando?.id
      ? this.salidaBuque.actualizarOpcion(this.idBuque, this.idCotizacionConsignatario, this.opcionEditando.id, payload)
      : this.salidaBuque.addOpcion(this.idBuque, this.idCotizacionConsignatario, payload)

    request$.subscribe({
      next: (salidaActualizada: SalidaBuque) => {
        this.opciones = salidaActualizada?.cotizacion.opciones ?? []
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Opción guardada correctamente' })
        this.cerrarDialog()
        this.guardando = false
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la opción' })
        this.guardando = false
      }
    })
  }

  confirmarEliminar(opcion: OpcionFlete) {
    this.confirmationService.confirm({
      message: `¿Eliminar la opción "${opcion.tipoContenedor} - ${opcion.puertoDestino}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminar(opcion)
    })
  }

  eliminar(opcion: OpcionFlete) {
    if (!this.idBuque || !this.idCotizacionConsignatario || !opcion.id) return
    this.salidaBuque.eliminarOpcion(this.idBuque, this.idCotizacionConsignatario, opcion.id).subscribe({
      next: (salidaActualizada: SalidaBuque) => {
        this.opciones = salidaActualizada?.cotizacion.opciones ?? []
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Opción eliminada' })
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la opción' })
      }
    })
  }

  return() {
    this.router.navigate(['erp/embarques/cotizaciones']).then(() => {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El identificador no se encuentra disponible' })
    })
  }
}
