import {Component, inject, OnInit} from '@angular/core';
import {CreposicionService} from '@services/creposicion.service';
import {Creposicion} from '@dtos/creposicion';
import {SidebarService} from '@services/state/sidebar.service';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {DatePipe, NgStyle} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TagModule} from 'primeng/tag';
import {getEstado, getEstadoRecepcion, getSeverity, getSeverityRecepcion} from '@utils/recepcion-utils';
import {DreposicionService} from '@services/dreposicion.service';

@Component({
  selector: 'app-recepcion-finalizados',
  standalone: true,
  imports: [
    TableModule,
    Button,
    DatePipe,
    ProgressSpinnerModule,
    TagModule,
    NgStyle
  ],
  templateUrl: './recepcion-finalizados.component.html',
  styles: ``
})
export default class RecepcionFinalizadosComponent implements OnInit{

  private creposicionService = inject(CreposicionService);
  private dreposicionService = inject(DreposicionService);
  private usrId = sessionStorage.getItem('usrId') ?? '';
  private empresa = sessionStorage.getItem('idEmpresa') ?? '';
  private sidebarService = inject(SidebarService)

  registrados: Creposicion[] = [];
  expandedRows: { [key: string]: boolean } = {};
  productosMap: { [crepoId: number]: any[] } = {}; // cache por fila
  loadingMap: { [crepoId: number]: boolean } = {};

  loading = false

  ngOnInit(): void {
    if (this.empresa == '' || this.usrId == '') {
      alert("Vuelva a iniciar sesion")
    }
    this.listarFinalizados();
  }

  private listarFinalizados(){
      this.creposicionService.getCreposicionByUser(8, this.usrId, 1).subscribe({
        next: (result) => {
          this.registrados= result;
          this.sidebarService.update({finalizados: this.registrados.length})
        }
      })
  }

  onRowExpand(event: any) {
    const crepo = event.data;

    if (this.productosMap[crepo.id.codigo]) return;

    this.loadingMap[crepo.id.codigo] = true;

    this.dreposicionService.getListaDreposicion(crepo.id.codigo).subscribe({
      next: (value) => {
        this.productosMap[crepo.id.codigo] = value;
        this.loadingMap[crepo.id.codigo] = false;
      }
    });
  }

  onRowCollapse(event: any) {
    const crepo = event.data;
    delete this.expandedRows[crepo.id.codigo];
  }

  protected readonly getEstadoRecepcion = getEstadoRecepcion;
  protected readonly getSeverityRecepcion = getSeverityRecepcion;
}
