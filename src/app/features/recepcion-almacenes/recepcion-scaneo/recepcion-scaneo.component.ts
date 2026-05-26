import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {DreposicionService} from '@services/dreposicion.service';
import {Creposicion, CreposicionID} from '@dtos/creposicion';
import {CreposicionService} from '@services/creposicion.service';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {ToolbarModule} from 'primeng/toolbar';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Dreposicion} from '@dtos/dreposicion';
import {TagModule} from 'primeng/tag';
import {RevisionProductoRequest} from '@dtos/revision-producto-request';
import {TableModule} from 'primeng/table';
import {NgStyle} from '@angular/common';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {playAlert} from '@utils/audio-utils';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {getEstado, getSeverity} from '@utils/recepcion-utils';

@Component({
  selector: 'app-recepcion-scaneo',
  standalone: true,
  imports: [
    ButtonDirective,
    PrimeTemplate,
    Ripple,
    ToolbarModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    TagModule,
    TableModule,
    NgStyle,
    ToggleButtonModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './recepcion-scaneo.component.html',
  styles: ``
})
export default class RecepcionScaneoComponent implements OnInit, AfterViewInit {

  @ViewChild('barraInput')
  barraInput!: ElementRef<HTMLInputElement>;

  private route = inject(ActivatedRoute)
  private messageService = inject(MessageService)
  private router = inject(Router)
  private dreposicionService = inject(DreposicionService)
  private creposicionService = inject(CreposicionService)
  private confirmationService = inject(ConfirmationService)

  private empresa = sessionStorage.getItem('idEmpresa') ?? '';
  private usuariosessionStorage = sessionStorage.getItem('username') ?? '';

  reposicion: Creposicion | null = null;
  dreposicion: Dreposicion | null = null;
  revisiones: Dreposicion[] = []
  barra!: string
  id!: string;
  cantidad: number | null = null
  shouldAdd = true
  loading = false

  ngOnInit(): void {
    this.reposicion = null
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.id === '' || this.empresa === '') {
      this.messageService.add({severity: 'warn', summary: 'Ruta sin valores'})
      this.router.navigate(['auth', 'login']).then(r => {
        return
      })
    }

    const emp = Number(this.empresa);
    const idC = Number(this.id);
    if (isNaN(emp) || isNaN(idC)) {
      console.error("El valor no es numérico");
    }

    const id: CreposicionID = {
      codigo: idC,
      empresa: emp
    }

    this.creposicionService.getById(id).subscribe({
      next: (result) => {
        if (result.finalizado === 1) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Revision ya finalizada',
            detail: 'Esta revision ya fue finalizada seleccione otra'
          })
          this.nuevoEscaneo()
        } else {
          this.reposicion = result
          this.messageService.add({severity: 'info', summary: result.observacion})
          this.getScaneados(idC);
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  nuevoEscaneo() {
    this.router.navigate(['erp', 'recepcion-almacenes', 'registrados']).then(r => {
    })
  }

  focusInput() {

    requestAnimationFrame(() => {
      this.barraInput?.nativeElement?.focus();
    });

  }

  escaneo() {

    let cantidadValida: number | null = null;

    if (this.cantidad != null) {
      if (this.cantidad > 0) {
        cantidadValida = this.cantidad;   // solo valores positivos
      } else if (this.cantidad === 0) {
        cantidadValida = null;            // si es 0, pasa como null
      } else {
        // valores negativos no permitidos
        this.messageService.add({
          severity: 'warn',
          summary: 'Cantidad inválida',
          detail: 'No se permiten valores negativos'
        });
        return; // salir sin enviar request
      }
    }

    const req: RevisionProductoRequest = {
      barra: this.barra,
      usuario: this.usuariosessionStorage,
      creposicion: Number(this.id),
      empresa: Number(this.empresa),
      cantidad: cantidadValida,
      shouldAdd: this.shouldAdd
    };

    this.dreposicionService.quantityAdded(req)
      .subscribe({

        next: value => {
          if (value) {
            // quitar si ya existe
            this.revisiones = this.revisiones.filter(
              r => r.productoId !== value.productoId
            );

            // si quedó en 0 no mostrar
            if (value.cantApr >= 0) {
              // agregar arriba
              this.revisiones.unshift(value);
            }

            this.dreposicion = value
            this.barra = ''
            this.cantidad = null
            this.focusInput();
          } else {
            playAlert()
            this.confirmationService.confirm({
              message: 'Producto no encontrado en el registro ¿Desea agregar?',
              header: 'Confirmación',
              icon: 'pi pi-spin pi-spinner-dotted',
              defaultFocus: `none`,
              accept: () => {
                this.addProduct(req);
                this.barra = '';
                this.cantidad = null
                this.focusInput();
              },
              reject: () => {
                this.barra = '';
                this.cantidad = null
                this.focusInput();
              },
              key: 'confirmProduct'
            })
          }
          this.focusInput();
        }
      });
  }

  finalizarVerificacion() {
    this.loading = true
    this.confirmationService.confirm({
      message: 'Al finalizar la revisión, los cambios se guardarán y esta acción no podrá ser revertida ni modificada.',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'none',
      accept: () => {
        this.finalizarCreposicon()
      },
      reject: () => {
        this.barra = '';
        this.cantidad = null
        this.focusInput();
        this.loading = false
      },
      key: 'confirmProduct'
    })
  }

  private getScaneados(crepo: number) {
    this.loading = true
    this.dreposicionService.getListaDreposicion(crepo).subscribe({
      next: value => {
        // Filtrar solo los que tengan cantApr > 0
        this.revisiones = value.filter(d => d.cantApr > 0);
        this.loading = false
      }
    });
  }

  private finalizarCreposicon() {
    const emp = Number(this.empresa);
    const idC = Number(this.id);
    if (isNaN(emp) || isNaN(idC)) {
      console.error("El valor no es numérico");
    }
    const id: CreposicionID = {
      codigo: idC,
      empresa: emp
    }

    this.creposicionService.updateRecepcionFinalizado(id).subscribe({
      next: value => {
        if (value.finalizado === 1) {
          this.messageService.add({
            severity: 'success', summary: 'Revision finalizado', detail: 'Revision guardada puede continuar'
          })
          this.router.navigate(['erp', 'recepcion-almacenes', 'finalizados']).then(r => {
          })
        }
        this.loading = false
      }, error: err => {
        this.loading = false
      }
    })
  }

  private addProduct(req: RevisionProductoRequest) {
    this.loading = true
    this.dreposicionService.saveNewProductRevision(req).subscribe({
      next: value => {
        if (value) {
          this.revisiones.unshift(value);
          this.dreposicion = value
          this.loading = false
        }
      },
      error: err => {
        this.messageService.add({severity: 'error', summary: 'Producto no existe', detail: `${err.message}`})
        this.loading = false
      }
    })
  }

  protected readonly getEstado = getEstado;
  protected readonly getSeverity = getSeverity;
}
