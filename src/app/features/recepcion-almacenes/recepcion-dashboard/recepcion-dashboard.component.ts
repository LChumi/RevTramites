import {Component, inject, OnInit} from '@angular/core';
import {CreposicionService} from '@services/creposicion.service';
import {DreposicionService} from '@services/dreposicion.service';
import {Creposicion} from '@dtos/creposicion';
import {Dreposicion} from '@dtos/dreposicion';
import {forkJoin} from 'rxjs';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ChartModule} from 'primeng/chart';
import {TagModule} from 'primeng/tag';
import {DatePipe} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {DataViewModule} from 'primeng/dataview';

interface ResumenUsuario {
  usuario: string;
  finalizados: number;
  pendientes: number;
  tiempoPromedio: number; // minutos
}

@Component({
  selector: 'app-recepcepcion-dashboard',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    ChartModule,
    TagModule,
    DatePipe,
    ButtonDirective,
    DataViewModule
  ],
  templateUrl: './recepcion-dashboard.component.html',
  styles: ``
})
export default class RecepcionDashboardComponent implements OnInit {
  private creposicionService = inject(CreposicionService);
  private dreposicionService = inject(DreposicionService);

  private usrId = sessionStorage.getItem('usrId') ?? '';
  private empresa = sessionStorage.getItem('idEmpresa') ?? '';

  fecha: string = new Date().toLocaleDateString('es-EC', {dateStyle: 'long'});
  hora: string = new Date().toLocaleTimeString('es-EC', {timeStyle: 'short'});
  nombre: string = sessionStorage.getItem('nombre') ?? '';

  procesados: Creposicion[] = [];
  productosMap: { [crepoId: number]: Dreposicion[] } = {};

  loading = true;
  loadingDetalle: { [key: number]: boolean } = {};

  // KPIs
  totalFinalizados = 0;
  totalPendientes = 0;
  tiempoPromedioMin = 0;

  // Resumen por usuario
  resumenUsuarios: ResumenUsuario[] = [];

  // Chart
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    if (!this.empresa || !this.usrId) {
      alert('Vuelva a iniciar sesión');
      return;
    }
    this.listarProcesados();
  }

  listarProcesados() {
    this.loading = true;
    forkJoin([
      this.creposicionService.listFinalizados(8, 1),
      this.creposicionService.listFinalizados(8, 0),
    ]).subscribe({
      next: ([finalizados, noFinalizados]) => {

        console.log('Finalizados', finalizados.length);
        console.log('Pendientes', noFinalizados.length);

        const todos = [...finalizados, ...noFinalizados]
        this.procesados = todos;
        this.calcularKpis(finalizados.length, noFinalizados.length, todos);
        this.calcularResumenUsuarios(todos);
        this.buildChart();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  calcularKpis(fin: number, pend: number, todos: Creposicion[]) {
    this.totalFinalizados = fin;
    this.totalPendientes = pend;

    const tiempos = todos.map((c) => this.getDuracionMin(c));
    this.tiempoPromedioMin =
      tiempos.length > 0
        ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
        : 0;
  }

  calcularResumenUsuarios(todos: Creposicion[]) {
    const map: { [usr: string]: ResumenUsuario } = {};

    for (const c of todos) {
      const usr = c.usuario ?? 'DESCONOCIDO';
      if (!map[usr]) {
        map[usr] = {usuario: usr, finalizados: 0, pendientes: 0, tiempoPromedio: 0};
      }
      if (c.finalizado === 1) map[usr].finalizados++;
      else map[usr].pendientes++;
    }

    // Calcular tiempo promedio por usuario
    for (const usr of Object.keys(map)) {
      const registros = todos.filter((c) => c.usuario === usr);
      const tiempos = registros.map((c) => this.getDuracionMin(c));
      map[usr].tiempoPromedio =
        tiempos.length > 0
          ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
          : 0;
    }

    this.resumenUsuarios = Object.values(map).sort(
      (a, b) => b.finalizados - a.finalizados
    );
  }

  buildChart() {
    const labels = this.resumenUsuarios.map((u) => u.usuario);
    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Finalizados',
          data: this.resumenUsuarios.map((u) => u.finalizados),
          backgroundColor: '#22c55e',
          borderRadius: 6,
        },
        {
          label: 'Pendientes',
          data: this.resumenUsuarios.map((u) => u.pendientes),
          backgroundColor: '#f59e0b',
          borderRadius: 6,
        },
      ],
    };
    this.chartOptions = {
      responsive: true,
      plugins: {legend: {position: 'top'}},
      scales: {y: {beginAtZero: true, ticks: {stepSize: 1}}},
    };
  }

  /** Carga productos de un registro solo si no está en caché */
  cargarProductos(row: Creposicion) {
    const id = row.id.codigo;
    if (this.productosMap[id]) return; // ya en caché

    this.loadingDetalle[id] = true;
    this.dreposicionService.getListaDreposicion(id).subscribe({
      next: (value) => {
        this.productosMap[id] = value;
        this.loadingDetalle[id] = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingDetalle[id] = false;
      },
    });
  }

  getPorcentajeCompleto(productos: Dreposicion[]): number {
    if (!productos || productos.length === 0) return 0;
    const completos = productos.filter(p => p.observacion === 'COMPLETO').length;
    return Math.round((completos / productos.length) * 100);
  }

  getTotalCantApr(productos: Dreposicion[]): number {
    if (!productos || productos.length === 0) return 0;
    return productos.reduce((sum, p) => sum + (p.cantApr || 0), 0);
  }

  getDuracionMin(c: Creposicion): number {
    const inicio = new Date(c.creaFecha).getTime();
    const fin = new Date(c.modFecha).getTime();
    return Math.max(0, Math.round((fin - inicio) / 60000));
  }

  formatDuracion(min: number): string {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  getSeverity(finalizado: number): 'success' | 'warning' {
    return finalizado === 1 ? 'success' : 'warning';
  }
}
