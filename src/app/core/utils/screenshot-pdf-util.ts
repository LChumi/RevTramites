import {ElementRef} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function screenshotPdfUtil(elementRef: ElementRef, descripcion: string) {
  const element = elementRef.nativeElement;

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
      scale: 2, // Alta calidad
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

      pdf.save(`${descripcion}.pdf`);

      document.body.removeChild(container);
    });
  }, 500);
}
