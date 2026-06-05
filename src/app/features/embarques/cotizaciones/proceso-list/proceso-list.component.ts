import {Component, inject, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {ProcesoCotizacion} from '@models/embarque/proceso-cotizacion';
import {ProcesoCotizacionService} from '@services/embarque/proceso-cotizacion.service';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {TagModule} from 'primeng/tag';
import {CardModule} from 'primeng/card';
import {EMPRESA_MOCK, REFERENCIAS_MOCK} from '@mocks/embarque';
import {ActivatedRoute, Router} from '@angular/router';
import {getEmpresaNombre} from '@utils/embarque-utils';

@Component({
  selector: 'app-proceso-list',
  standalone: true,
  imports: [
    ChartModule,
    MenuModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonDirective,
    Ripple,
    DatePipe,
    DialogModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    CardModule
  ],
  templateUrl: './proceso-list.component.html',
  styles: ``
})
export default class ProcesoListComponent implements OnInit {

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private procesoService = inject(ProcesoCotizacionService)
  private messageService = inject(MessageService)

  cotizacionDialog: boolean = false

  cotizaciones: ProcesoCotizacion[] = []
  cotizacion: ProcesoCotizacion = {} as ProcesoCotizacion

  tiposReferencia = REFERENCIAS_MOCK
  empresas = EMPRESA_MOCK

  ngOnInit() {
    this.listarCoptizaciones()
  }

  listarCoptizaciones() {
    this.procesoService.list().subscribe({
      next: value => {
        this.cotizaciones = value
        console.log(this.cotizaciones)
      }
    })
  }

  viewCotizacion(id: string) {
    this.router.navigate([id], {relativeTo: this.route}).then(r => {
    })
  }

  saveCotizacion() {
    if (!this.validar()) {
      return;
    }

    this.procesoService.crear(this.cotizacion).subscribe({
      next: value => {
        this.cotizacionDialog = false
        this.limpiarFormulario();
        this.cotizaciones.push(value)
      }
    })
  }

  getEstadoSeverity(estado: string) {
    switch (estado) {
      case 'BORRADOR':
        return 'secondary';

      case 'EN_VALIDACION':
        return 'warning';

      case 'FINALIZADO':
        return 'success';

      default:
        return 'contrast';
    }
  }

  nuevoProceso() {
    this.limpiarFormulario();
    this.cotizacionDialog = true;
  }

  private limpiarFormulario() {
    this.cotizacion = {
      numeroReferencia: null,
      tipoReferencia: null,
      empresaId: null,
      proveedorId: null
    } as ProcesoCotizacion;
  }

  private validar(): boolean {

    this.cotizacion.numeroReferencia =
      this.cotizacion.numeroReferencia?.trim().toUpperCase();

    const campos = [
      {
        valor: this.cotizacion.numeroReferencia,
        mensaje: 'Debe ingresar el número de referencia'
      },
      {
        valor: this.cotizacion.tipoReferencia,
        mensaje: 'Debe seleccionar el tipo de referencia'
      },
      {
        valor: this.cotizacion.empresaId,
        mensaje: 'Debe seleccionar una empresa'
      },
      {
        valor: this.cotizacion.proveedorId?.trim(),
        mensaje: 'Debe ingresar un proveedor'
      }
    ];

    const error = campos.find(c => !c.valor);

    if (error) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: error.mensaje
      });
      return false;
    }

    return true;
  }

  protected readonly getEmpresaNombre = getEmpresaNombre;
}
