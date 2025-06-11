import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {TramiteService} from '@services/tramite.service';
import {RevisionService} from '@services/revision.service';
import {Tramite} from '@models/tramite';
import {Producto} from '@models/producto';
import {forkJoin} from 'rxjs';
import {DataView, DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {MessageService} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';
import {NgStyle} from '@angular/common';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {Button, ButtonDirective} from 'primeng/button';
import {Contenedor} from '@models/contenedor';
import {DialogModule} from 'primeng/dialog';
import {Ripple} from 'primeng/ripple';
import {Table, TableModule} from 'primeng/table';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FormsModule} from '@angular/forms';
import {ContenedoresService} from '@services/contenedores.service';
import {ToolbarModule} from 'primeng/toolbar';
import {converToExcel} from '@utils/excel-utils';
import {AvatarModule} from 'primeng/avatar';
import {ProductValidateRequest} from '@dtos/product-validate-request';

@Component({
  standalone: true,
  templateUrl: './validacion-tramite.component.html',
  imports: [
    DataViewModule,
    DropdownModule,
    InputTextModule,
    ProcesoTramitePipe,
    NgStyle,
    EstadoColorPipe,
    Button,
    DialogModule,
    ButtonDirective,
    Ripple,
    TableModule,
    ToggleButtonModule,
    FormsModule,
    ToolbarModule,
    AvatarModule
  ],
  styles: ``
})
export default class ValidacionTramiteComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined; // Asegúrate de tener la referencia a la tabla

  private tramiteService = inject(TramiteService)
  private revisionService = inject(RevisionService)
  private messageService = inject(MessageService)
  private contenedoresService = inject(ContenedoresService)

  user: any;
  tramiteId: string = '';
  contenedorId: string = '';
  revisiones: Producto[] = [];
  tramites: Tramite[] = [];
  contenedores: Contenedor[] = [];
  loading: boolean = false;
  vistaTramites = true
  display = false;
  editProductView = false;
  cantidad!: number
  novedad!: string
  private prodId: string = ''
  protected bultos: number = 0

  estadoOptions = [
    { label: 'Estados', value: null},
    { label: 'SOBRANTE', value: 'SOBRANTE' },
    { label: 'FALTANTE', value: 'FALTANTE' },
    { label: 'NO_LLEGO', value: 'NO_LLEGO' },
    { label: 'SIN_REGISTRO', value: 'SIN_REGISTRO' }
  ];

  ngOnInit(): void {
    this.listarCompletos([3, 2]);
    this.user = sessionStorage.getItem("username")
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

  buscarContenedores(tramite: Tramite) {
    this.display = true;
    this.loading = true;
    this.tramiteId = tramite.id;
    this.contenedoresService.buscarContenedores(tramite.id).subscribe({
      next: (data) => {
        this.contenedores = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.display = false;
      }
    })
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  validate(contenedor: Contenedor) {
    this.revisionService.processProductRevision(this.tramiteId, contenedor.contenedorId).subscribe({
      next: (result) => {
        this.revisiones = result;
        this.messageService.add({severity: 'info', summary: 'Muestra Validadas',})
        this.vistaTramites = false
        this.display = false;
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Ocurrio un problema ',})
      }
    })
  }

  exportToExcel() {
    converToExcel(this.revisiones, this.tramiteId)
  }

  regresar() {
    this.vistaTramites = true
    this.display = false;
  }

  selectProduct(producto:Producto){
    this.editProductView=true
    this.prodId=producto.id
    this.bultos=producto.bultos
  }

  updateProduct(){

    if (!this.cantidad || this.cantidad == 0 || !this.prodId){
      this.messageService.add({severity: 'warn', summary: 'La cantidad no puede ser 0 o nula',})
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
        this.cantidad = 0;
        this.novedad = '';
      }, error : err => {
        this.messageService.add({severity: 'error', summary: 'Ocurrio un problema ', detail: err})
      }
    })
  }

  closeUpdate(){
    this.cantidad = 0;
    this.novedad = '';
    this.prodId = '';
    this.editProductView = false;
  }

}
