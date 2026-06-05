import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputNumberModule} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {CardModule} from 'primeng/card';
import {ReportService} from '@services/report.service';
import {FileHandlerService} from '@services/file-handler.service';
import {MessageService} from 'primeng/api';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-reportes-archivos',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    InputNumberModule,
    FormsModule,
    ToastModule,
    CardModule
  ],
  templateUrl: './reportes-archivos.component.html',
  styles: ``
})
export default class ReportesArchivosComponent {

  codigo: string = '';
  downloading = false;

  private readonly reportService = inject(ReportService);
  private readonly fileHandlerService = inject(FileHandlerService);
  private readonly messageService = inject(MessageService);

  descargarPdf(): void {
    this.descargar('pdf');
  }

  descargarExcel(): void {
    this.descargar('excel');
  }

  private descargar(tipo: 'pdf' | 'excel'): void {
    if (!this.codigo) return; // el botón ya está disabled, doble guard

    this.downloading = true;

    const reporte$ = tipo === 'pdf'
      ? this.reportService.getPdfReport(String(this.codigo))
      : this.reportService.getExcelReport(String(this.codigo));

    reporte$.pipe(
      finalize(() => this.downloading = false)
    ).subscribe({
      next: blob => {
        if (tipo === 'pdf') {
          this.fileHandlerService.openPdf(blob);
        } else {
          this.fileHandlerService.downloadFile(blob, `${this.codigo}.xlsx`);
        }
        // Toast de éxito en lugar de alert
        this.messageService.add({
          severity: 'success',
          summary: 'Listo',
          detail: `Archivo ${tipo.toUpperCase()} generado correctamente`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo generar el archivo ${tipo.toUpperCase()}`
        });
      }
    });
  }

}
