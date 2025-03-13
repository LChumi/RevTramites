import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {InputTextModule} from 'primeng/inputtext';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ripple} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {NgStyle} from '@angular/common';
import {TramiteService} from '@services/tramite.service';
import {RevisionService} from '@services/revision.service';
import {Revision} from '@models/revision';
import {Tramite} from '@models/tramite';
import {converToExcel} from '@utils/excel-utils';
import {Contenedor} from '@models/contenedor';

@Component({
  standalone: true,
  imports: [
    ButtonDirective,
    EstadoColorPipe,
    InputTextModule,
    PrimeTemplate,
    ReactiveFormsModule,
    Ripple,
    TableModule,
    ToggleButtonModule,
    ToolbarModule,
    NgStyle,
    FormsModule
  ],
  templateUrl: './validacion-tramite.component.html',
  styles: ``
})
export default class ValidacionTramiteComponent implements OnInit {

  private tramiteService = inject(TramiteService)
  private revisionService = inject(RevisionService)
  private messageService = inject(MessageService)

  user: any;
  tramiteId: string = '';
  barra: string = '';
  tramiteExist: boolean = false;
  revisiones: Revision[] = [];
  tramites: Tramite[] = [];
  tramite: Tramite | null = null;
  loading: boolean = false;


  listarPendientes() {
    this.tramiteService.listByStatus(2).subscribe({
      next: (tramites) => {
        if (tramites.length > 0) {
          this.tramites = tramites
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No existen Tramites ',
          detail: 'No se encontraron Tramites Pendientes de verificar '
        });

      }
    })
  }

  exportToExcel() {
    converToExcel(this.revisiones, this.tramiteId)
  }

  nuevoEscaneo() {
    this.listarPendientes();
    this.tramiteExist = false;
    this.tramiteId = ''
  }

  public getIcon(contenedor: Contenedor): string {
    if (contenedor.finalizado) {
      return 'pi pi-check';
    } else {
      return contenedor.bloqueado ? 'pi pi-lock' : 'pi pi-lock-open';
    }
  }

  validar(tramiteId: string) {
    this.revisionService.validate(tramiteId).subscribe({
      next: (revisiones) => {
        if (revisiones.length > 0) {
          this.revisiones = revisiones;
          this.tramiteExist = true;
        }
      }
    })
  }

  ngOnInit(): void {
    this.listarPendientes()
    this.user = sessionStorage.getItem("username")
  }
}
