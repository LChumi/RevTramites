import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {TramiteService} from '@services/tramite.service';
import {Tramite} from '@models/tramite';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MuestraService} from '@services/muestra.service';
import {TableModule} from 'primeng/table';
import {NgStyle} from '@angular/common';
import {Button, ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {ErrorResponse} from '@dtos/error-response';
import {TooltipModule} from 'primeng/tooltip';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {forkJoin} from 'rxjs';
import {Producto} from '@models/producto';
import {InputGroupModule} from 'primeng/inputgroup';
import {DataView, DataViewModule} from 'primeng/dataview';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';
import {Contenedor} from '@models/contenedor';
import {ContenedoresService} from '@services/contenedores.service';
import {DialogModule} from 'primeng/dialog';
import {MuestraRequest} from '@models/muestra-request';
import {ScrollTopModule} from 'primeng/scrolltop';
import {ToolbarModule} from 'primeng/toolbar';
import {MuestrasReportComponent} from '@shared/component/muestras-report/muestras-report.component';
import {AvatarModule} from 'primeng/avatar';
import {ProductValidateRequest} from '@dtos/product-validate-request';
import {ToastModule} from 'primeng/toast';
import {ProgressBarModule} from 'primeng/progressbar';

@Component({
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    TableModule,
    NgStyle,
    ButtonDirective,
    Ripple,
    TooltipModule,
    ToggleButtonModule,
    InputGroupModule,
    Button,
    DataViewModule,
    EstadoColorPipe,
    ProcesoTramitePipe,
    DialogModule,
    ScrollTopModule,
    ToolbarModule,
    MuestrasReportComponent,
    AvatarModule,
    ToastModule,
    ProgressBarModule,
  ],
  templateUrl: './muestra.component.html',
  styles: ``
})
export default class MuestraComponent implements OnInit {
  @ViewChild('cajaInput') cajaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('muestraInput') muestraInput!: ElementRef<HTMLInputElement>;

  private tramiteService = inject(TramiteService);
  private contenedorService = inject(ContenedoresService)
  private messageService = inject(MessageService);
  private muestraService = inject(MuestraService);
  private confirmationService = inject(ConfirmationService)

  tramites: Tramite[] = [];
  muestras: Producto[] = []
  contenedores: Contenedor[] = []
  muestraAdd: Producto | null = null;
  barra: any;
  muestra: any;
  user: any;
  status = true;
  display = false;
  tramiteExist = false;
  muestraReport = false
  loading = false;
  productsValidate = false;
  pdfLoading = false;
  protected tramiteId: string = '';
  protected contenedorId: string = '';

  ngOnInit(): void {
    this.listarCompletos([2, 3, 4]);
    this.user = sessionStorage.getItem("username")
  }

  listarCompletos(processes: number[]): void {
    // Crear un array de observables con las solicitudes para cada proceso
    const observables = processes.map(process =>
      this.tramiteService.listByStatus(process)
    );

    // Combinar los resultados con forkJoin
    forkJoin(observables).subscribe({
      next: (results) => {
        // Combinar los resultados en una sola lista
        this.tramites = results.flat(); // Usamos flat() para aplanar los arrays
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No existen Tramites',
          detail: 'No se encontraron Tramites Finalizados o Completos, finalize la revisión'
        });
      }
    });
  }

  regresar() {
    this.tramiteExist = false;
    this.muestras = [];
    this.tramiteId = '';
    this.productsValidate = false;
    this.muestraReport = false;
    this.listarCompletos([2, 3, 4]);
  }

  focusNext(_currentInput: HTMLInputElement, nextInput: HTMLInputElement) {
    if (nextInput) {
      nextInput.focus();
    }
  }

  addCompare() {
    if (this.barra && this.muestra && this.tramiteId && this.contenedorId) {
      const request: MuestraRequest = {
        barra: this.barra,
        muestra: this.muestra,
        tramiteId: this.tramiteId,
        contenedor: this.contenedorId,
        usuario: this.user,
        status: this.status
      }
      this.muestraService.addCompare(request).subscribe({
        next: (result) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Muestra agregada',
            detail: `Se agrego la muestra ${result.barraMuestra} del producto ${result.nombre}`,
          })
          this.muestraAdd = result
          this.listarMuestras(this.tramiteId, this.contenedorId)
          this.status = true
          this.muestra = ''
        },
        error: (err: ErrorResponse) => {
          this.status = true
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrio un problema ',
            detail: `Error:  ${err.message}`,
          })
        }
      })
    } else {
      this.messageService.add({
        severity: 'warning',
        summary: 'Barra no agregada',
        detail: `llene los campos por favor`,
      })
    }
  }

  listarMuestras(tramiteId: string, contenedor: string) {
    this.muestraService.getMuestras(tramiteId, contenedor).subscribe({
      next: (result) => {
        if (this.muestraAdd) {
          const restantes = result.filter(p => p.id !== this.muestraAdd?.id)
          this.muestras = [this.muestraAdd, ...restantes]
        } else {
          this.muestras = result;
        }

      }
    })
  }

  validate() {
    this.muestraService.validate(this.tramiteId, this.contenedorId).subscribe({
      next: (result) => {
        // Filtrar muestras incompletas y completas
        const incompletas = result.filter(p => p.procesoMuestra !== 'COMPLETO');
        const completas = result.filter(p => p.procesoMuestra === 'COMPLETO');

        // Validar si todas están completas
        const allComplete = completas.length === result.length;

        if (allComplete) {
          this.muestras = result;
          this.productsValidate = true;
          this.messageService.add({severity: 'info', summary: 'Muestras Validadas'});
        } else {
          // Si hay incompletas, actualizar la lista para mostrarlas primero
          this.muestras = [...incompletas, ...completas];
          this.messageService.add({severity: 'warn', summary: 'Muestras incompletas'});
        }
      }
    });
  }

  buscarContenedores(tramite: Tramite) {
    this.loading = true;
    this.display = true;
    this.contenedorService.buscarContenedores(tramite.id).subscribe({
      next: (data) => {
        this.contenedores = data.filter(c => !c.muestras);
        this.tramiteId = tramite.id;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.display = false;
      }
    })
  }

  limpiarInputs() {
    this.barra = ''
    this.muestra = ''
    this.status = true
    this.muestraAdd = null
    setTimeout(() => {
      this.cajaInput?.nativeElement.focus();
    }, 0);
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  getStarted(contenedor: Contenedor) {
    this.display = false
    this.tramiteExist = true;
    this.contenedorId = contenedor.contenedorId
    this.listarMuestras(this.tramiteId, this.contenedorId)
  }

  verReporte() {
    this.pdfLoading = true;
    this.muestraReport = true

    setTimeout(() => {
      this.pdfLoading = false;
    }, 8000);
  }

  validateProduc(p: Producto) {
    this.confirmationService.confirm({
      message: '¿Producto sin Registro validar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-circle',
      accept: () => {
        this.updateProduct(p)
      }
    })
  }

  updateProduct(p: Producto) {
    const request: ProductValidateRequest = {
      productId: p.id,
      cantidad: 0,
      usuario: this.user,
      novedad: ''
    }

    this.muestraService.updateProductWithValidation(request).subscribe({
      next: value => {
        this.muestras = [...this.muestras.filter(p => p.id !== value.id), value]
        this.messageService.add({
          severity: 'info',
          summary: 'Producto Validado',
          detail: 'Se agrego la validacion producto sin muestra'
        })
      }, error: err => {
        this.messageService.add({severity: 'error', summary: 'Ocurrio un problema ', detail: err})
      }
    })
  }


  protected readonly scroll = scroll;
}
