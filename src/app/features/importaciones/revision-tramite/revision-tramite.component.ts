import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputGroupModule} from 'primeng/inputgroup';
import {ButtonDirective} from 'primeng/button';
import {TramiteService} from '../../../core/services/tramite.service';
import {RevisionService} from '../../../core/services/revision.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Revision} from '@models/revision';
import {TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {NgStyle} from '@angular/common';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {Observable, switchMap} from 'rxjs';
import {Tramite} from '@models/tramite';

@Component({
  imports: [
    FormsModule,
    InputTextModule,
    InputGroupModule,
    ButtonDirective,
    TableModule,
    Ripple,
    NgStyle,
    EstadoColorPipe
  ],
  templateUrl: './revision-tramite.component.html',
  standalone: true,
  styles: ``
})
export default class RevisionTramiteComponent implements OnInit {

  private tramiteService = inject(TramiteService)
  private revisionService = inject(RevisionService)
  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)

  tramiteId: string = '';
  barra: string = '';
  tramiteExist: boolean = false;
  revisiones: Revision[] = [];
  tramites: Tramite[] = [];
  revision: Revision | null = null;
  tramite: Tramite | null = null;

  buscarTramite(tramiteId: string) {
    console.log(tramiteId);
    if (!tramiteId) return;
    this.tramiteId = tramiteId;

    this.tramiteService.findById(this.tramiteId).pipe(
      switchMap(tramite => {
        if (tramite) {
          this.tramiteExist = true;
          this.messageService.add({ severity: 'info', summary: 'Trámite existe', detail: 'Se encontró el registro de trámite' });
          return this.revisionService.findByTramite(this.tramiteId);
        } else {
          this.tramiteExist = false;
          this.messageService.add({ severity: 'warn', summary: 'Trámite no existe', detail: 'No se encontró registro de trámite' });
          return new Observable<Revision[]>(observer => observer.next([]));
        }
      })
    ).subscribe(revisiones => {
      this.revisiones = revisiones;
    });
  }

  listarPendientes() {
    this.tramiteService.pending().subscribe({
      next: (tramites) => {
        if (tramites.length > 0) {
          this.tramites = tramites
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'warn', summary: 'No existen Tramites ', detail: 'No se encontraron Tramites Pendientes de verificar ' });

      }
    })
  }

  escaneo() {
    if (!this.tramiteId || !this.barra) return;

    this.revisionService.updateQuantity(this.tramiteId, this.barra, 'Prueba').pipe(
      switchMap(revision => {
        this.revision = revision;
        this.barra = '';
        return this.revisionService.findByTramite(this.tramiteId);
      })
    ).subscribe(revisiones => {
      this.revisiones = revisiones;
    });
  }

  validarTramite() {
    this.confirmationService.confirm({
      message: 'Productos escaneados ¿Validar Trámite?',
      header: 'Confirmación',
      icon: 'pi pi-check',
      accept: () => {
        this.revisionService.updateQuantities(this.tramiteId!).subscribe(revisiones => {
          this.revisiones = revisiones;
        });
      }
    });
  }

  nuevoEscaneo() {
    this.tramiteExist = false;
  }

  ngOnInit(): void {
    this.listarPendientes()
  }
}
