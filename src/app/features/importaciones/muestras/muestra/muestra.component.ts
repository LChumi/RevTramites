import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {TramiteService} from '@services/tramite.service';
import {Tramite} from '@models/tramite';
import {MessageService} from 'primeng/api';
import {MuestraService} from '@services/muestra.service';
import {TableModule} from 'primeng/table';
import {NgStyle} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {ErrorResponse} from '@dtos/error-response';
import {Muestra} from '@models/muestra';
import {TooltipModule} from 'primeng/tooltip';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {forkJoin} from 'rxjs';

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
  ],
  templateUrl: './muestra.component.html',
  styles: ``
})
export default class MuestraComponent implements OnInit {
  @ViewChild('cajaInput') cajaInput!: HTMLInputElement;
  @ViewChild('muestraInput') muestraInput!: HTMLInputElement;

  private tramiteService = inject(TramiteService);
  private messageService = inject(MessageService);
  private muestraService = inject(MuestraService)

  tramites: Tramite[] = [];
  muestras: Muestra[] = []
  muestraAdd: Muestra | null = null;
  barra: any;
  muestra: any;
  status: boolean = true;
  tramiteExist: boolean = false;
  private tramiteId: string = '';

  ngOnInit(): void {
    this.listarCompletos([3, 1]);
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

  tramiteSelected(tramiteId: string) {
    this.tramiteExist = true;
    this.tramiteId = tramiteId;
    this.listarMuestras(tramiteId);
  }

  regresar() {
    this.tramiteExist = false;
    this.muestras = [];
    this.tramiteId = '';
  }

  focusNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement) {
    if (nextInput) {
      nextInput.focus();
    }
  }

  addCompare() {
    if (this.barra && this.muestra && this.tramiteId) {
      this.muestraService.addCompare(this.barra, this.muestra, this.tramiteId, this.status).subscribe({
        next: (result) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Muestra agregada',
            detail: `Se agrego la muestra ${result.id} del bulto barra ${result.barraMuestra}`,
          })
          this.muestraAdd = result
          this.listarMuestras(this.tramiteId)
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

  listarMuestras(tramiteId: string) {
    this.muestraService.listarTramite(tramiteId).subscribe({
      next: (result) => {
        this.muestras = result;
      }
    })
  }

  validate() {
    this.muestraService.validate(this.tramiteId).subscribe({
      next: (result) => {
        this.muestras = result;
        const allComplete = this.muestras.every(muestra => muestra.proceso === 'COMPLETA');
        if (allComplete) {
          this.messageService.add({severity: 'info', summary: 'Muestra Validadas',})
        } else {
          this.messageService.add({severity: 'warn', summary: 'Muestra incompletas',})
        }
      }
    })
  }


  protected readonly scroll = scroll;
}
