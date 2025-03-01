import {Component, inject, OnInit} from '@angular/core';
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

  private tramiteService = inject(TramiteService);
  private messageService = inject(MessageService);
  private muestraService = inject(MuestraService)

  tramites: Tramite[] = [];
  barra: any;
  muestra: any;
  tramiteExist: boolean = false;

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
  }
}
