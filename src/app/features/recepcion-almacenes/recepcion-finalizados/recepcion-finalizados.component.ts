import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {CreposicionService} from '@services/creposicion.service';
import {Creposicion} from '@dtos/creposicion';
import {SidebarService} from '@services/state/sidebar.service';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TagModule} from 'primeng/tag';
import {DreposicionService} from '@services/dreposicion.service';
import {DialogModule} from 'primeng/dialog';
import {ProgressBarModule} from 'primeng/progressbar';
import {
  RevisionReportComponent
} from '@features/recepcion-almacenes/recepcion-finalizados/components/revision-report/revision-report.component';
import {Dreposicion} from '@dtos/dreposicion';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-recepcion-finalizados',
  standalone: true,
  imports: [
    TableModule,
    Button,
    DatePipe,
    ProgressSpinnerModule,
    TagModule,
    DialogModule,
    ProgressBarModule,
    RevisionReportComponent
  ],
  templateUrl: './recepcion-finalizados.component.html',
  styles: ``
})
export default class RecepcionFinalizadosComponent implements OnInit {

  private creposicionService = inject(CreposicionService);
  private dreposicionService = inject(DreposicionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private usrId = sessionStorage.getItem('usrId') ?? '';
  private empresa = sessionStorage.getItem('idEmpresa') ?? '';

  @ViewChild('reporteRef') reporteRef!: RevisionReportComponent;

  registrados: Creposicion[] = [];
  productosMap: { [crepoId: number]: Dreposicion[] } = {};

  creposicionSeleccionada!: Creposicion;
  productosSeleccionados: Dreposicion[] = [];
  revReport = false;
  pdfLoading = false;
  loading = false;

  usuariosPermitidos = ['NCERON', 'CMERCHAN', 'LCHUMI', 'DHEREDIA'];


  ngOnInit(): void {
    if (this.empresa == '' || this.usrId == '') {
      alert('Vuelva a iniciar sesion');
    }
    this.listarFinalizados();
  }

  private listarFinalizados() {
    if (this.usuariosPermitidos.includes(this.usrId)) {
      this.creposicionService.listFinalizados(8, 1).subscribe({
        next: (result) => {
          this.registrados = result;
        },
        error: (error) => console.log(error)
      });
    } else {
      this.creposicionService.getCreposicionByUser(8, this.usrId, 1).subscribe({
        next: (result) => {
          this.registrados = result;
        },
        error: (error) => console.log(error)
      });
    }
  }

  abrirReporte(row: Creposicion): void {
    this.creposicionSeleccionada = row;
    this.revReport = true;

    // Si ya está en caché no vuelve a llamar al servicio
    if (this.productosMap[row.id.codigo]) {
      this.productosSeleccionados = this.productosMap[row.id.codigo];
      return;
    }

    this.pdfLoading = true;

    this.dreposicionService.getListaDreposicion(row.id.codigo).subscribe({
      next: (value) => {
        this.productosMap[row.id.codigo] = value;
        this.productosSeleccionados = value;
        this.pdfLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.pdfLoading = false;
      }
    });
  }

  cerrarReporte(): void {
    this.revReport = false;
    this.productosSeleccionados = [];
    this.pdfLoading = false;
  }

  generarPdf() {
    this.pdfLoading = true; // activa el loading

    // llamas al metodo del hijo
    this.reporteRef.generarPdf();

    setTimeout(() => {
      this.pdfLoading = false; // desactiva el loading
    }, 5000);
  }

  puedeModificar(): boolean {
    return this.usuariosPermitidos.includes(this.usrId);
  }

  editarReposicion(row: Creposicion): void {
    this.router.navigate(['editar', row.id.codigo], {relativeTo: this.route}).then(r => {
    })
  }
}
