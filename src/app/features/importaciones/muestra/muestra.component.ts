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

@Component({
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    TableModule,
    NgStyle,
    ButtonDirective,
    Ripple
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
  barra: any;
  muestra: any;
  tramiteExist: boolean = false;
  private tramiteId: string = '';

  listarCmpletos() {
    this.tramiteService.complete().subscribe({
      next: (tramites) => {
        if (tramites.length > 0) {
          this.tramites = tramites
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No existen Tramites ',
          detail: 'No se encontraron Tramites Finalizados o Completos finalize la revision '
        });

      }
    })
  }

  ngOnInit(): void {
    this.listarCmpletos()
  }

  tramiteSelected(tramiteId: string){
    this.tramiteExist = true;
    this.tramiteId = tramiteId;
  }

  focusNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement) {
    if (nextInput) {
      nextInput.focus();
    }
  }

  addCompare(){
    if (this.barra && this.muestra && this.tramiteId){
      this.muestraService.addCompare(this.barra, this.muestra, this.tramiteId).subscribe({
        next: (result) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Muestra agregada',
            detail: `Se agrego la muestra ${result.id} del bulto barra ${result.barraMuestra}`,
          })
        },
        error: (err: ErrorResponse) => {
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
}
