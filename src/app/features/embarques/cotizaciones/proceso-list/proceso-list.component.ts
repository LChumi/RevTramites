import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {MenuModule} from 'primeng/menu';
import {Table, TableModule} from 'primeng/table';
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
  @ViewChild('filter') filter!: ElementRef;

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private procesoService = inject(ProcesoCotizacionService)
  private messageService = inject(MessageService)

  cotizacionDialog: boolean = false
  loading: boolean = false
  modoEdicion: boolean = false;
  cotizacionIdEditar: string | null = null;
  cotizaciones: ProcesoCotizacion[] = []
  cotizacion: ProcesoCotizacion = {} as ProcesoCotizacion

  tiposReferencia = REFERENCIAS_MOCK
  empresas = EMPRESA_MOCK

  ngOnInit() {
    this.listarCoptizaciones()
  }

  listarCoptizaciones() {
    this.loading= true
    this.procesoService.list().subscribe({
      next: value => {
        this.cotizaciones = value
        this.loading= false
      }
    })
  }

  editarCotizacion(cot: ProcesoCotizacion) {
    this.cotizacion = { ...cot };
    this.cotizacionIdEditar = cot.id;
    this.modoEdicion = true;
    this.cotizacionDialog = true;
  }

  viewCotizacion(id: string) {
    this.router.navigate([id], {relativeTo: this.route}).then(r => {
    })
  }

  saveCotizacion() {
    if (!this.validar()) return;

    if (this.modoEdicion && this.cotizacionIdEditar) {
      this.procesoService.update(this.cotizacionIdEditar, this.cotizacion).subscribe({
        next: value => {
          const idx = this.cotizaciones.findIndex(c => c.id === this.cotizacionIdEditar);
          if (idx !== -1) this.cotizaciones[idx] = value;
          this.cotizacionDialog = false;
          this.limpiarFormulario();
        }
      });
    } else {
      this.procesoService.crear(this.cotizacion).subscribe({
        next: value => {
          this.cotizaciones.push(value);
          this.cotizacionDialog = false;
          this.limpiarFormulario();
        }
      });
    }
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
    this.modoEdicion = false;
    this.cotizacionIdEditar = null;
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
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
