import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PrestamoService} from '@services/dispositivos/perstamo.service';
import {Prestamo} from '@models/dispositivos/prestamo';
import {Button} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {TagModule} from 'primeng/tag';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    Button,
    RouterLink,
    CardModule,
    TableModule,
    DatePipe,
    TagModule
  ],
  templateUrl: './historial.component.html',
  styles: ``
})
export class HistorialComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly prestamoService = inject(PrestamoService);

  serial = signal<string>('');
  historial = signal<Prestamo[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const serial = this.route.snapshot.paramMap.get('serial')!;
    this.serial.set(serial);
    this.cargar(serial);
  }

  cargar(serial: string): void {
    this.loading.set(true);
    this.prestamoService.historial(serial).subscribe({
      next: (data) => { this.historial.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  diasPrestado(p: Prestamo): number | null {
    if (!p.fechaEntrega) return null;
    const fin = p.fechaDevolucion ? new Date(p.fechaDevolucion) : new Date();
    const inicio = new Date(p.fechaEntrega);
    return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  }
}
