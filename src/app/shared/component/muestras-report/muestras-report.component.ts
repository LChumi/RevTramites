import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MuestraService} from '@services/muestra.service';
import {Producto} from '@models/producto';
import {getCurrentDateNow, getCurrentTime} from '@utils/date-utils';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FormsModule} from '@angular/forms';
import {isPlatformBrowser} from '@angular/common';
import {screenshotPdfUtil} from '@utils/screenshot-pdf-util';

@Component({
  selector: 'app-muestras-report',
  standalone: true,
  imports: [
    TableModule,
    CheckboxModule,
    ToggleButtonModule,
    FormsModule
  ],
  templateUrl: './muestras-report.component.html',
  styles: ``
})
export class MuestrasReportComponent implements OnInit, OnChanges {

  @ViewChild('report', { static: false }) report!: ElementRef;

  @Input() tramite!: string;
  @Input() contenedor!: string;

  private muestraService = inject(MuestraService)
  private platformId = inject(PLATFORM_ID)

  muestras: Producto[] = []
  nombre: any
  fecha: any
  hora: any

  valCheck: string[] = []

  ngOnInit(): void {
    this.getInfo()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tramite && this.contenedor){
      this.listarMuestras(this.tramite, this.contenedor)
    }
  }

  listarMuestras(tramiteId: string, contenedor: string) {
    this.muestraService.getMuestras(tramiteId, contenedor).subscribe({
      next: (result) => {
        this.muestras = result.sort((a, b) => a.id1.localeCompare(b.id1, undefined, {numeric: true}));
        setTimeout(() => {
          this.generarPdf()
        }, 2000)
      }
    })
  }

  getInfo() {
    if (isPlatformBrowser(this.platformId)) {
      this.nombre = sessionStorage.getItem('username');
    }

    this.fecha = getCurrentDateNow();
    this.hora = getCurrentTime();
  }

  generarPdf(): void {
    const detalle = `Tramite_${this.tramite}_Contenedor_${this.contenedor}`
    screenshotPdfUtil(this.report, detalle);
  }


}
