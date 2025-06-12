import {Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MuestraService} from '@services/muestra.service';
import {Producto} from '@models/producto';
import {getCurrentDateNow, getCurrentTime} from '@utils/date-utils';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FormsModule} from '@angular/forms';

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

  @ViewChild('report') report!: ElementRef;

  @Input() tramite!: string;
  @Input() contenedor!: string;

  private muestraService = inject(MuestraService)

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
        this.muestras = result
        setTimeout(() => {
          this.generarPdf()
        }, 3000)
      }
    })
  }

  getInfo() {
    this.nombre = sessionStorage.getItem('username');
    this.fecha = getCurrentDateNow();
    this.hora = getCurrentTime();
  }

  generarPdf(){
    const element = this.report.nativeElement;

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Muestras Tramite ${this.tramite}`);
    });
  }

}
