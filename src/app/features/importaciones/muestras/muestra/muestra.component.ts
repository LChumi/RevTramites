import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {TramiteService} from '@services/tramite.service';
import {Tramite} from '@models/tramite';
import {MessageService} from 'primeng/api';
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
  private muestraService = inject(MuestraService)

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
  loading = false;
  private tramiteId: string = '';
  private contenedorId: string = '';

  ngOnInit(): void {
    this.listarCompletos([3, 2]);
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
  }

  focusNext(_currentInput: HTMLInputElement, nextInput: HTMLInputElement) {
    if (nextInput) {
      nextInput.focus();
    }
  }

  addCompare() {
    if (this.barra && this.muestra && this.tramiteId && this.contenedorId) {
      const request : MuestraRequest = {
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
        this.muestras = result;
      }
    })
  }

  validate() {
    this.muestraService.validate(this.tramiteId, this.contenedorId).subscribe({
      next: (result) => {
        this.muestras = result;
        const allComplete = this.muestras.every(muestra => muestra.procesoMuestra === 'COMPLETO');
        if (allComplete) {
          this.completed()
          this.messageService.add({severity: 'info', summary: 'Muestra Validadas',})
        } else {
          this.messageService.add({severity: 'warn', summary: 'Muestra incompletas',})
        }
      }
    })
  }

  buscarContenedores(tramite: Tramite) {
    this.loading = true;
    this.display = true;
    this.contenedorService.buscarContenedores(tramite.id).subscribe({
      next: (data) => {
        this.contenedores = data;
        this.tramiteId = tramite.id;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.display = false;
      }
    })
  }

  limpiarInputs(){
    this.barra=''
    this.muestra=''
    this.status=true
    this.muestraAdd=null
    setTimeout(() => {
      this.cajaInput?.nativeElement.focus();
    }, 0);
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  getStarted(contenedor: Contenedor){
    this.display = false
    this.tramiteExist = true;
    this.contenedorId=contenedor.contenedorId
    this.listarMuestras(this.tramiteId, this.contenedorId)
  }

  completed(){
    setTimeout(() => {
      this.regresar()
      this.listarCompletos([3, 2]);
    }, 3000)
  }

  protected readonly scroll = scroll;
}
