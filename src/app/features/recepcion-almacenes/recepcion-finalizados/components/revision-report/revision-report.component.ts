import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CheckboxModule} from 'primeng/checkbox';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {TagModule} from 'primeng/tag';
import {getEstadoRecepcion, getSeverityRecepcion} from '@utils/recepcion-utils';
import {DatePipe, NgStyle} from '@angular/common';
import {Creposicion} from '@dtos/creposicion';
import {Dreposicion} from '@dtos/dreposicion';
import {screenshotPdfUtil} from '@utils/screenshot-pdf-util';

@Component({
  selector: 'app-revision-report',
  standalone: true,
  imports: [
    CheckboxModule,
    PrimeTemplate,
    TableModule,
    ToggleButtonModule,
    TagModule,
    NgStyle,
    DatePipe,
  ],
  templateUrl: './revision-report.component.html',
  styles: ``
})
export class RevisionReportComponent implements OnInit{

  @ViewChild('report', { static: false }) report!: ElementRef;
  @Input() creposicion!: Creposicion;
  @Input() productos!: Dreposicion[];

  ngOnInit(): void {}

  getPorcentajeCompleto(): number {
    if (!this.productos || this.productos.length === 0) {
      return 0;
    }
    const completos = this.productos.filter(p => p.observacion === 'COMPLETO').length;
    return Math.round((completos / this.productos.length) * 100);
  }


  generarPdf(): void {
    screenshotPdfUtil(this.report, `Revision_${this.creposicion.id.codigo}`);
  }

  getTotalCantApr(): number {
    if (!this.productos || this.productos.length === 0) {
      return 0;
    }
    return this.productos.reduce((sum, p) => sum + (p.cantApr || 0), 0);
  }


  protected readonly getEstadoRecepcion = getEstadoRecepcion;
  protected readonly getSeverityRecepcion = getSeverityRecepcion;
}
