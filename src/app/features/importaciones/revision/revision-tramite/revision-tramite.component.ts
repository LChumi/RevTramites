import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputGroupModule} from 'primeng/inputgroup';
import {ButtonDirective} from 'primeng/button';
import {TramiteService} from '@services/tramite.service';
import {RevisionService} from '@services/revision.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {NgStyle} from '@angular/common';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {forkJoin, of, switchMap} from 'rxjs';
import {Tramite} from '@models/tramite';
import {ToolbarModule} from 'primeng/toolbar';
import {converToExcel} from '@utils/excel-utils';
import {Contenedor} from '@models/contenedor';
import {ToggleButtonModule} from "primeng/togglebutton";
import {playAlert} from '@utils/audio-utils';
import {RevisionRequest} from '@models/revision-request';
import {Producto} from '@models/producto';

@Component({
  imports: [
    FormsModule,
    InputTextModule,
    InputGroupModule,
    ButtonDirective,
    TableModule,
    Ripple,
    NgStyle,
    EstadoColorPipe,
    ToolbarModule,
    ToggleButtonModule
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

  user: any;
  tramiteId: string = '';
  containerId: string = '';
  barra: string = '';
  tramiteExist: boolean = false;
  revisiones: Producto[] = [];
  tramites: Tramite[] = [];
  contenedor: Contenedor | null = null;
  revision: Producto | null = null;
  tramite: Tramite | null = null;
  loading: boolean = false;
  status: boolean = true;

  blockUnlockContainer(tramiteId: string, conatainerId: string) {
    if (!tramiteId) return;
    this.tramiteId = tramiteId;

    this.tramiteService.lockUnlockContainer(tramiteId, conatainerId, this.user).subscribe({
      next: response => {
        if (!response.status && response.info === 'error') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Contenedor Bloqueado por otro usuario'
          });
        } else if (response.status && response.info === 'bloqueado') {
          this.messageService.add({severity: 'info', summary: 'Éxito', detail: 'Contenedor Bloqueado'});
        } else if (response.status && response.info === 'desbloqueado') {
          this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Contenedor Desbloqueado'});
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Respuesta inesperada del servidor'
          });
        }
        this.listarPendientes();
      }
    })
  }

  buscarTramite(tramiteId: string, containerId: string) {
    if (!tramiteId || !containerId) return;
    this.tramiteId = tramiteId;
    this.containerId = containerId;

    this.tramiteService.findById(this.tramiteId).pipe(
      switchMap(tramite => {
        if (!tramite) {
          this.tramiteExist = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Trámite no existe',
            detail: 'No se encontró registro de trámite'
          });
          return of([]); // retornar Observable vacío
        }

        this.tramiteExist = true;

        const containerTramite = tramite.contenedoresIds.find(c => c === containerId);
        if (!containerTramite) {
          return of([]); //también retornar Observable
        }

        return this.tramiteService.getContenedor(tramiteId, containerId).pipe(
          switchMap(container => {
            if (!container) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Contenedor no encontrado',
                detail: 'No se encontró el contenedor especificado'
              });
              return of([]);
            }

            if (container.bloqueado) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Contenedor Bloqueado',
                detail: 'El contenedor está bloqueado'
              });
              return of([]);
            }

            this.blockUnlockContainer(tramiteId, containerId);
            return this.revisionService.findByTramite(this.tramiteId);
          })
        );
      })
    ).subscribe(revisiones => {
      this.revisiones = revisiones;
    });

  }

  listarPendientes() {
    this.tramiteService.listByStatus(1).subscribe({
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

  escaneo() {
    if (!this.tramiteId || !this.barra || !this.user || !this.containerId) return;

    const request: RevisionRequest = {
      tramiteId: this.tramiteId,
      contenedor: this.containerId,
      barra: this.barra,
      usuario: this.user,
      status: this.status
    };

    console.log(request)
    this.revisionService.updateQuantity(request).pipe(
      switchMap(revision => {
        this.revision = revision;
        if (revision.estadoRevision === 'SIN REGISTRO' && revision.cantidadRevision === 1) {
          playAlert()
          this.messageService.add({
            severity: 'warn',
            summary: 'Barra no registrada',
            detail: `La barra ${this.barra} no se encuentra registrada en el tramite`
          })
        }
        this.barra = '';
        return this.revisionService.findByTramite(this.tramiteId);
      })
    ).subscribe(revisiones => {
      this.revisiones = revisiones;
      this.status = true
    });
  }

  validarTramite() {
    if (!this.containerId) return
    this.confirmationService.confirm({
      message: 'Productos escaneados ¿Validar Trámite?',
      header: 'Confirmación',
      icon: 'pi pi-check',
      accept: () => {
        this.revisionService.updateQuantities(this.tramiteId, this.containerId).subscribe(revisiones => {
          this.revisiones = revisiones;
          if (this.revisiones.every(revision => revision.estadoRevision === 'SN')) {
            this.nuevoEscaneo();
          }
        });
      }
    });
  }

  nuevoEscaneo() {
    this.blockUnlockContainer(this.tramiteId, this.containerId)
    this.tramiteExist = false;
    this.tramiteId = ''

  }

  ngOnInit(): void {
    this.listarPendientes()
    this.user = sessionStorage.getItem("username")

  }

  exportToExcel() {
    converToExcel(this.revisiones, this.tramiteId)
  }

  getIcon(contenedor: Contenedor): string {
    if (contenedor.finalizado) {
      return 'pi pi-check';
    } else {
      return contenedor.bloqueado ? 'pi pi-lock' : 'pi pi-lock-open';
    }
  }

  contenedoresPorTramite: {[key:string]: Contenedor[] } = {}

  buscarContenedores(tramite: Tramite){
    if (!this.contenedoresPorTramite[tramite.id]){
      this.contenedoresPorTramite[tramite.id] = [];//Evitar multiples llamadas innecesarias

      const request = tramite.contenedoresIds.map(id => {
        return this.tramiteService.getContenedor(tramite.id,id)
      });

      console.log("Solicitudes generadas:", request);

      forkJoin(request).subscribe({
        next: (containers) => {
          this.contenedoresPorTramite[tramite.id] = containers.flat();
        }
      });
    }
  }

}
