import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputGroupModule} from 'primeng/inputgroup';
import {ButtonDirective} from 'primeng/button';
import {TramiteService} from '@services/tramite.service';
import {RevisionService} from '@services/revision.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Table, TableModule} from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {isPlatformBrowser, NgStyle} from '@angular/common';
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
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AvatarModule} from 'primeng/avatar';
import {DialogModule} from 'primeng/dialog';
import {ProductValidateRequest} from '@dtos/product-validate-request';

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
    ToggleButtonModule,
    ConfirmDialogModule,
    AvatarModule,
    DialogModule
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
  private platformId = inject(PLATFORM_ID)

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
  editProductView = false;
  cantidad!: number
  novedad!: string
  protected bultos: number = 0
  private prodId: string = ''

  ngOnInit(): void {
    this.listarPendientes([1, 2]);
    if (isPlatformBrowser(this.platformId)){
      this.user = sessionStorage.getItem("username")
    }
  }

  blockUnlockContainer(tramiteId: string, containerId: string) {
    if (!tramiteId) return;

    this.tramiteService.lockUnlockContainer(tramiteId, containerId, this.user).subscribe({
      next: response => {

        if (response.status) {
          switch (response.info) {
            case 'bloqueado':
              this.messageService.add({
                severity: 'warn',
                summary: 'Éxito',
                detail: 'El contenedor se bloqueó correctamente'
              });
              this.updateContenedores(tramiteId, containerId);
              break;
            case 'desbloqueado':
              this.messageService.add({
                severity: 'success',
                summary: 'Info',
                detail: 'El contenedor se desbloqueó correctamente'
              });
              this.updateContenedores(tramiteId, containerId);
              break;
            case 'finalizado':
              this.messageService.add({severity: 'info', summary: 'Info', detail: 'El contenedor ya está finalizado'});
              this.updateContenedores(tramiteId, containerId);
              break;
          }
        } else {
          this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: response.info});
        }
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al comunicarse con el servidor'});
      }
    });
  }

  buscarTramite(tramiteId: string, containerId: string) {
    if (!tramiteId || !containerId) return;

    this.tramiteId = tramiteId;
    this.containerId = containerId;

    this.tramiteService.findById(tramiteId).pipe(
      switchMap(tramite => {
        if (!tramite || !tramite.contenedoresIds) {
          this.tramiteExist = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Trámite no existe',
            detail: 'No se encontró registro de trámite o no tiene contenedores'
          });
          return of([]);
        }

        this.tramiteExist = true;

        const containerTramite = tramite.contenedoresIds.find(c => c === containerId);
        if (!containerTramite) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Contenedor no pertenece al trámite',
            detail: 'El contenedor no está listado en el trámite'
          });
          return of([]);
        }

        return this.tramiteService.getContenedor(tramiteId, containerId).pipe(
          switchMap(container => {
            if (!container || Object.keys(container).length === 0) {
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

            // Solo si pasa todo, se intenta bloquear
            this.blockUnlockContainer(tramiteId, containerId);

            // Buscar revisiones si todo está OK
            return this.revisionService.findByTramite(tramiteId, containerId);
          })
        );
      })
    ).subscribe({
      next: revisiones => {
        this.revisiones = revisiones;
      },
      error: err => {
        console.error('Error en buscarTramite:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al procesar el trámite'
        });
      }
    });
  }

  listarPendientes(processes: number[]) {
    //Array de observables con las solicitudes para cada proceso
    const observables = processes.map(process =>
      this.tramiteService.listByStatus(process));

    forkJoin(observables).subscribe({
      next: (results) => {
        //Combinar los resultados en una sola lista
        this.tramites = results.flat(); //Usamos flat() para aplanar los arrays
      }, error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No existen Tramites',
          detail: 'No se encontraron Tramites Finalizados o Completos, finalize la revisión'
        });
      }
    })
  }

  escaneo() {
    if (!this.tramiteId || !this.barra || !this.user || !this.containerId) return;

    this.revisionService.productExist(this.tramiteId, this.containerId, this.barra).subscribe({
      next: (exist) => {
        if (exist.status) {
          this.addProduct()
        } else {
          playAlert()
          this.confirmationService.confirm({
            message: 'Producto no encontrado en el resgistro ¿Desea agregar?',
            header: 'Confirmación',
            icon: 'pi pi-spin pi-spinner-dotted',
            defaultFocus: `none`,
            accept: () => {
              this.addProduct();
            },
            reject: () => {
              this.barra = '';
            },
            key: 'confirmDialog'
          })
        }
      }
    })
  }

  addProduct() {
    const request: RevisionRequest = {
      tramiteId: this.tramiteId,
      contenedor: this.containerId,
      barra: this.barra,
      usuario: this.user,
      status: this.status
    };

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
        return this.revisionService.findByTramite(this.tramiteId, this.containerId);
      })
    ).subscribe({
      next: revisiones => {
        if (this.revision) {
          //Reordenar para mostrar el ultimo producto escaneado en la lista
          const restantes = revisiones.filter(p => p.id !== this.revision?.id);
          this.revisiones = [this.revision, ...restantes];
          this.status = true
        }

      },
      error: err => {
        console.error('Error en escaneo:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message
        })
        this.barra = '';
        this.status = true;
      }
    });
  }

  validarTramite() {
    if (!this.containerId) return
    this.confirmationService.confirm({
      message: 'Productos escaneados ¿Validar Trámite?',
      header: 'Confirmación',
      icon: 'pi pi-check',
      accept: () => {
        this.revisionService.processTramiteCompletion(this.tramiteId, this.containerId).subscribe({
          next: (status) => {
            if (status.status) {
              this.messageService.add({severity: 'success', summary: 'Éxito', detail: status.info});
            } else {
              this.messageService.add({severity: 'info', summary: 'Info', detail: status.info});
            }
            this.nuevoEscaneo()
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: err.message});
          }
        })
      }
    });
  }

  nuevoEscaneo() {
    this.blockUnlockContainer(this.tramiteId, this.containerId)
    this.tramiteExist = false;
    this.tramiteId = ''

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

  contenedoresPorTramite: { [key: string]: Contenedor[] } = {}

  buscarContenedores(tramite: Tramite) {
    if (!this.contenedoresPorTramite[tramite.id]) {
      this.contenedoresPorTramite[tramite.id] = [];//Evitar multiples llamadas innecesarias

      const request = tramite.contenedoresIds.map(id => {
        return this.tramiteService.getContenedor(tramite.id, id)
      });

      forkJoin(request).subscribe({
        next: (containers) => {
          this.contenedoresPorTramite[tramite.id] = containers.flat();
        }
      });
    }
  }

  private updateContenedores(tramiteId: string, containerId: string) {
    // Solicitar el contenedor actualizado
    this.tramiteService.getContenedor(tramiteId, containerId).subscribe({
      next: (contenedorActualizado) => {
        const lista = this.contenedoresPorTramite[tramiteId];
        const index = lista.findIndex(c => c.contenedorId === containerId);
        if (index !== -1) {
          lista[index] = contenedorActualizado;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se pudo actualizar el contenedor visualmente'
        });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  copyToClipboard(barcode: string) {
    this.barra = barcode
    navigator.clipboard.writeText(barcode).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Copiado',
        detail: 'El código de barras se copió al portapapeles'
      });
    }).catch(err => {
      console.error("Error al copiar: ", err);
    });
  }

  completar() {
    this.cantidad = this.bultos
  }

  closeUpdate() {
    this.cantidad = 0;
    this.novedad = '';
    this.prodId = '';
    this.editProductView = false;
  }

  updateProduct() {

    if (!this.prodId) {
      this.messageService.add({severity: 'warn', summary: 'El producto no fue bien seleccionado vuelva a seleccionarlo ',})
      return
    }

    const request: ProductValidateRequest = {
      productId: this.prodId,
      cantidad: this.cantidad,
      usuario: this.user,
      novedad: this.novedad
    }

    this.revisionService.updateProductWithValidation(request).subscribe({
      next: value => {
        this.revisiones = [...this.revisiones.filter(p => p.id !== value.id), value]
        this.closeUpdate()
        this.messageService.add({severity: 'info', summary: 'Producto corregido', detail: 'Se registro la novedad del producto '})
      }, error: err => {
        this.messageService.add({severity: 'error', summary: 'Ocurrio un problema ', detail: err})
      }
    })
  }

  selectProduct(producto: Producto) {
    this.editProductView = true
    this.prodId = producto.id
    this.bultos = producto.bultos
  }

}
