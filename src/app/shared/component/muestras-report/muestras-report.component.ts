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

  generarPdf(): void {
    const element = this.report.nativeElement;

    // Clonamos el nodo del DOM
    const cloned = element.cloneNode(true) as HTMLElement;
    cloned.style.width = '1024px';
    cloned.style.maxWidth = '1024px';
    cloned.style.fontSize = '12px';
    cloned.classList.add('pdf-print-style');

    // Función para reemplazar clases md:* en todo el clon
    const activateMdClasses = (root: HTMLElement) => {
      // Recorrer todos los elementos dentro del clon + el clon mismo
      const elems = root.querySelectorAll('*');
      // Añadimos el clon también para procesarlo
      const allElems = [root, ...Array.from(elems)];

      allElems.forEach(el => {
        const classes = Array.from(el.classList);
        classes.forEach(cls => {
          if (cls.startsWith('md:')) {
            // Quitar la clase con md:
            el.classList.remove(cls);

            // Quitar clase móvil equivalente (solo las comunes)
            // Ejemplos básicos, amplía si tienes más casos
            if (cls === 'md:flex-row') {
              el.classList.remove('flex-column');
              el.classList.add('flex-row');
            } else if (cls === 'md:align-items-center') {
              el.classList.remove('align-items-start');
              el.classList.add('align-items-center');
            } else if (cls === 'md:justify-content-between') {
              // no se suele tener versión móvil que quitar
              el.classList.add('justify-content-between');
            } else if (cls === 'md:mt-0') {
              el.classList.remove('mt-5');
              el.classList.add('mt-0');
            } else if (cls === 'md:text-right') {
              el.classList.remove('text-left');
              el.classList.add('text-right');
            } else {
              // Si quieres, puedes agregar más reglas aquí para más clases
              // Por defecto solo quitar md: y agregar la clase sin md:
              const newClass = cls.replace('md:', '');
              el.classList.add(newClass);
            }
          }
        });
      });
    };

    activateMdClasses(cloned);

    // Agregamos al body oculto para renderizar
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.appendChild(cloned);
    document.body.appendChild(container);

    setTimeout(() => {
      html2canvas(cloned, {
        scale: 3,
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Muestras Tramite ${this.tramite}`);

        document.body.removeChild(container);
      });
    }, 100);
  }


}
