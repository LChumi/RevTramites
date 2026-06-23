import {Component, inject, OnInit} from '@angular/core';
import {DreposicionService} from '@services/dreposicion.service';
import {CreposicionService} from '@services/creposicion.service';
import {Creposicion, CreposicionID} from '@dtos/creposicion';
import {Dreposicion} from '@dtos/dreposicion';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {getEstadoRecepcion, getSeverityRecepcion} from '@utils/recepcion-utils';
import {NgStyle} from '@angular/common';
import {Button, ButtonDirective} from 'primeng/button';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import {AvatarModule} from 'primeng/avatar';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {RevisionProductoRequest} from '@dtos/revision-producto-request';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-revision-edit',
  standalone: true,
  imports: [
    PrimeTemplate,
    TableModule,
    TagModule,
    Button,
    ProgressSpinnerModule,
    DialogModule,
    AvatarModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule
  ],
  templateUrl: './revision-edit.component.html',
  styles: ``
})
export default class RevisionEditComponent implements OnInit {

  private dreposicionService = inject(DreposicionService)
  private creposicionService = inject(CreposicionService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private usuariosessionStorage = sessionStorage.getItem('username') ?? '';

  cabecera: Creposicion | null = null;
  lista: Dreposicion[] = []
  producto: Dreposicion | null = null;
  crepo!: any
  empresa!: any
  loading = false
  viewEdit = false
  cantidad: number | null = null

  ngOnInit(): void {
    this.cabecera = null
    this.crepo = this.route.snapshot.paramMap.get('id') ?? '';
    this.empresa = this.route.snapshot.paramMap.get('empresa') ?? '';
    if (this.crepo === '' || this.empresa === '') {
      this.router.navigate(['auth', 'login']).then(r => {
        return
      })
    }
    this.getCabecera();
  }

  getCabecera() {
    this.loading = true
    const empresa = Number(this.empresa);
    const codigo = Number(this.crepo);
    if (isNaN(empresa) || isNaN(codigo)) {
      console.error("El valor no es numérico");
    }

    const id: CreposicionID = {
      codigo: codigo,
      empresa: empresa
    }
    this.creposicionService.getById(id).subscribe({
      next: value => {
        this.cabecera = value
        this.getDreposicion(codigo)
      }, error: err => {
        console.error(err)
        this.loading = false
      }
    })
  }

  getDreposicion(id: any) {
    this.dreposicionService.getListaDreposicion(id).subscribe({
      next: value => {
        this.lista = value
        this.loading = false
      }
    })
  }

  updateProduct() {
    if (this.producto) {
      const req: RevisionProductoRequest = {
        barra: this.producto.barra,
        usuario: this.usuariosessionStorage,
        creposicion: Number(this.crepo),
        empresa: Number(this.producto.empresa),
        cantidad: this.cantidad,
        shouldAdd: true
      };
      this.dreposicionService.quantityAdded(req).subscribe({
        next: value => {
          if (value) {
            this.lista = this.lista.filter(
              r => r.productoId !== value.productoId
            )
            this.lista.unshift(value);
            this.cerrarDialogo()
          }
        }
      })
    }
  }

  confirmarValidacion() {
    this.loading = true
    this.confirmationService.confirm({
      message: '¿Desea finalizar la validación?',
      header: 'Finalizar revision',
      icon: 'pi pi-check-circle',
      defaultFocus: 'none',
      accept: () => {
        this.finalizarCreposicon()
      },
      reject: () => {
        this.cantidad = null
        this.loading = false
      },
      key: 'validateRecepcion'
    })
  }

  private finalizarCreposicon() {
    const empresa = Number(this.empresa);
    const id: CreposicionID = {
      codigo: this.crepo,
      empresa: empresa
    }

    this.creposicionService.updateRecepcionFinalizado(id).subscribe({
      next: value => {
        if (value.finalizado === 1) {
          this.router.navigate(['erp', 'recepcion-almacenes', 'finalizados']).then(r => {
            this.creposicionService.validarRecepcion(value.id.empresa, value.id.codigo).subscribe({
              next: resp => {
                if (resp.error === 0){
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Validado',
                    detail: `Recepción validada correctamente ${resp.respuesta}`,
                    icon: 'pi pi-check'
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Código de error: ${resp.respuesta}`,
                    icon: 'pi pi-times'
                  });
                }
              }
            });

          })
        }
        this.loading = false
      }, error: err => {
        this.loading = false
      }
    })
  }

  editar(producto: Dreposicion) {
    this.producto = producto
    this.viewEdit = true
  }

  cerrarDialogo() {
    this.viewEdit = false
    this.producto = null
    this.cantidad = null
  }

  regresar() {
    this.router.navigate(['erp', 'recepcion-almacenes', 'finalizados']).then(r => {
    })
  }

  protected readonly getSeverityRecepcion = getSeverityRecepcion;
  protected readonly getEstadoRecepcion = getEstadoRecepcion;
}
