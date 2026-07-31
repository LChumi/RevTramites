import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DispositivoService } from "@services/dispositivos/dispositivo.service";
import { PrestamoService } from "@services/dispositivos/perstamo.service";
import {Dispositivo} from '@models/dispositivos/dispositivo';
import { Prestamo } from "@models/dispositivos/prestamo";
import { EstadoDispositivo, estadoLabel } from "@models/dispositivos/estado-dispositivo";
import {CardModule} from 'primeng/card';
import {RouterLink} from '@angular/router';
import {TagModule} from 'primeng/tag';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ChartModule} from 'primeng/chart';
import {SkeletonModule} from 'primeng/skeleton';
import {Button} from 'primeng/button';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    RouterLink,
    TagModule,
    DatePipe,
    TableModule,
    ChartModule,
    SkeletonModule,
    Button
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {

  private readonly dispositivoService = inject(DispositivoService);
  private readonly prestamoService = inject(PrestamoService);

  loading = signal(true);
  dispositivos = signal<Dispositivo[]>([]);
  prestamosActivos = signal<Prestamo[]>([]);

  // --- KPIs ---
  totalEquipos = computed(() => this.dispositivos().length);

  totalPorEstado = computed(() => {
    const counts: Record<string, number> = {};
    for (const d of this.dispositivos()) {
      counts[d.estadoActual] = (counts[d.estadoActual] ?? 0) + 1;
    }
    return counts;
  });

  disponibles = computed(() => this.totalPorEstado()[EstadoDispositivo.DISPONIBLE] ?? 0);
  enUso = computed(() => this.totalPorEstado()[EstadoDispositivo.EN_USO] ?? 0);
  mantenimiento = computed(() => this.totalPorEstado()[EstadoDispositivo.MANTENIMIENTO] ?? 0);
  danados = computed(() => this.totalPorEstado()[EstadoDispositivo.DANADO] ?? 0);

  ultimosPrestamos = computed(() =>
    [...this.prestamosActivos()]
      .sort((a, b) => new Date(b.fechaEntrega).getTime() - new Date(a.fechaEntrega).getTime())
      .slice(0, 5)
  );

  // --- Chart ---
  chartData = computed(() => {
    const counts = this.totalPorEstado();
    const labels = Object.keys(counts).map(e => estadoLabel(e));
    const data = Object.values(counts);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'],
      }],
    };
  });

  chartOptions = {
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    forkJoin({
      dispositivos: this.dispositivoService.findAll(),
      activos: this.prestamoService.activos(),
    }).subscribe({
      next: ({ dispositivos, activos }) => {
        this.dispositivos.set(dispositivos);
        this.prestamosActivos.set(activos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  totalPrestamosActivos = computed(() => this.prestamosActivos().length);

}
