import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService, PrimeTemplate} from 'primeng/api';
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
    ToggleButtonModule
  ],
  templateUrl: './recepcion-scaneo.component.html',
  styles: ``
})
export default class RecepcionScaneoComponent implements OnInit{

  private route = inject(ActivatedRoute)
  private messageService = inject(MessageService)
  private router = inject(Router)
  private dreposicionService = inject(DreposicionService)
  private creposicionService = inject(CreposicionService)

  private empresa = sessionStorage.getItem('idEmpresa') ?? '';
  private usuariosessionStorage = sessionStorage.getItem('username') ?? '';

  reposicion: Creposicion | null = null;
  dreposicion: Dreposicion | null = null;
  revisiones: Dreposicion[] = []
  barra!: string
  id!: string;
  cantidad!: number
  shouldAdd = true

  ngOnInit(): void {
    this.reposicion= null
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.id === '' || this.empresa === ''){
      this.messageService.add({severity: 'warn', summary:'Ruta sin valores'})
      this.router.navigate(['auth', 'login']).then(r => {return})
    }

    const emp = Number(this.empresa);
    const idC = Number(this.id);
    if (isNaN(emp) || isNaN(idC)) {
      console.error("El valor no es numérico");
    }

    const id: CreposicionID ={
      codigo: idC,
      empresa: emp
    }

    this.creposicionService.getById(id).subscribe({
      next: (result) => {
        this.reposicion = result
        this.messageService.add({severity: 'info', summary: result.observacion})
        this.getScaneados(idC);
      }
    })
  }

  nuevoEscaneo(){
    this.router.navigate(['erp', 'recepcion-almacenes', 'registrados']).then(r =>{})
  }

  escaneo() {

    const req: RevisionProductoRequest = {
      barra: this.barra,
      usuario: this.usuariosessionStorage,
      creposicion: Number(this.id),
      empresa: Number(this.empresa),
      cantidad: this.cantidad,
      shouldAdd: this.shouldAdd
    };

    this.dreposicionService.quantityAdded(req)
      .subscribe({

        next: value => {

          // quitar si ya existe
          this.revisiones = this.revisiones.filter(
            r => r.productoId !== value.productoId
          );

          // si quedó en 0 no mostrar
          if (value.cantApr > 0) {
            // agregar arriba
            this.revisiones.unshift(value);
          }

          this.barra= ''
        }
      });
  }

  getEstado(d: Dreposicion | null): string {
    if (!d) return '';
    if (d.cantSol === d.cantApr) return 'Completo';
    if (d.cantSol > d.cantApr) return 'Faltante';
    if (d.cantSol < d.cantApr) return 'Sobrante';
    return '';
  }

  getSeverity(d: Dreposicion | null): "info" | "success" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    if (!d) return "info";
    if (d.cantSol === d.cantApr) return "success";   // verde
    if (d.cantSol > d.cantApr) return "warning";     // amarillo
    if (d.cantSol < d.cantApr) return "danger";      // rojo
    return "info";
  }

  finalizarVerificacion(){

  }

  private getScaneados(crepo: number) {
    this.dreposicionService.getListaDreposicion(crepo).subscribe({
      next: value => {
        console.log(value)
        // Filtrar solo los que tengan cantApr > 0
        this.revisiones = value.filter(d => d.cantApr > 0);
      }
    });
  }

}
