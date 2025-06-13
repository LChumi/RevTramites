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
import {MessageService} from 'primeng/api';

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
        }, 2000)
      }
    })
  }

  getInfo() {
    this.nombre = sessionStorage.getItem('username');
    this.fecha = getCurrentDateNow();
    this.hora = getCurrentTime();
  }

  generarPdf(): void {
    const element = this.report.nativeElement;

    // Clonamos como ya lo haces
    const cloned = element.cloneNode(true) as HTMLElement;
    cloned.style.width = '1024px';
    cloned.classList.add('pdf-print-style');

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.appendChild(cloned);
    document.body.appendChild(container);

    // 1) Esperar render
    setTimeout(() => {
      html2canvas(cloned, {
        scale: 3, // Alta calidad
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // 2) Agregar primera página
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // 3) Agregar páginas extras
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`Tramite_${this.tramite}_Contenedor_${this.contenedor}.pdf`);

        document.body.removeChild(container);
      });
    }, 500);
  }


}
