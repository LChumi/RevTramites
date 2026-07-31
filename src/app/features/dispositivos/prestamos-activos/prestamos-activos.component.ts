import {Component, inject, OnInit, signal} from '@angular/core';
import {MessageService} from 'primeng/api';
import {PrestamoService} from '@services/dispositivos/perstamo.service';
import {Prestamo} from '@models/dispositivos/prestamo';
import {ToolbarModule} from 'primeng/toolbar';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {TagModule} from 'primeng/tag';
import {DialogModule} from 'primeng/dialog';
import {EntregarPrestamoComponent} from '@features/dispositivos/form/entregar-prestamo/entregar-prestamo.component';
import {DevolverPrestamoComponent} from '@features/dispositivos/form/devolver-prestamo/devolver-prestamo.component';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-prestamos-activos',
  standalone: true,
  imports: [
    ToolbarModule,
    Button,
    TableModule,
    RouterLink,
    DatePipe,
    TagModule,
    DialogModule,
    EntregarPrestamoComponent,
    DevolverPrestamoComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  templateUrl: './prestamos-activos.component.html',
  styles: ``
})
export class PrestamosActivosComponent implements OnInit {

  private readonly prestamoService = inject(PrestamoService);
  private readonly messageService = inject(MessageService);

  prestamos = signal<Prestamo[]>([]);
  loading = signal(true);

  mostrarEntregar = signal(false);
  mostrarDevolver = signal(false);
  prestamoSeleccionado = signal<Prestamo | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.prestamoService.activos().subscribe({
      next: (data) => { this.prestamos.set(data); this.loading.set(false); },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los préstamos activos' });
      },
    });
  }

  abrirNuevoPrestamo(): void {
    this.prestamoSeleccionado.set(null);
    this.mostrarEntregar.set(true);
  }

  abrirDevolver(prestamo: Prestamo): void {
    this.prestamoSeleccionado.set(prestamo);
    this.mostrarDevolver.set(true);
  }

  onEntregado(): void {
    this.mostrarEntregar.set(false);
    this.cargar();
  }

  onDevuelto(): void {
    this.mostrarDevolver.set(false);
    this.cargar();
  }
}
