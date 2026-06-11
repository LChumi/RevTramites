import {Component, inject, OnInit} from '@angular/core';
import {ProductoObservacionService} from '@services/producto-observacion.service';
import {
  DashboardResumen,
  ObservacionPorBodega,
  ObservacionPorMes, TopProducto
} from '@features/observacion-producto/dto/dashboard.dto';
import {finalize, forkJoin} from 'rxjs';
import {ProgressBarModule} from 'primeng/progressbar';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {BadgeModule} from 'primeng/badge';
import {Button} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {BodegaService} from '@services/bodega.service';
import {Bodega} from '@dtos/bodega';
import {ChartModule} from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProgressBarModule,
    CardModule,
    TableModule,
    BadgeModule,
    Button,
    InputNumberModule,
    FormsModule,
    DropdownModule,
    ChartModule
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent implements OnInit {

  private dashboardService = inject(ProductoObservacionService);
  private bodegaService = inject(BodegaService);

  bodegaSeleccionada: number | null = null;
  anio = 2026;

  bodegasMap = new Map<number, string>();
  resumen: DashboardResumen | null = null;
  porBodega: ObservacionPorBodega[] = [];
  porMes: ObservacionPorMes[] = [];
  topProductos: TopProducto[] = [];

  loading = false;
  bodegas!: Bodega[];
  id_usuario: string = '';
  id_empresa: any;

  // Chart data
  chartMesData: any = {};
  chartMesOptions: any = {};
  chartProductosData: any = {};
  chartProductosOptions: any = {};

  constructor() {
    this.id_usuario = sessionStorage.getItem('usercode') ?? '';
    this.id_empresa = sessionStorage.getItem('idEmpresa') ?? '';
  }

  ngOnInit(): void {
    this.listarBodegas();
  }

  listarBodegas() {
    this.bodegaService.getBodegas(this.id_usuario, this.id_empresa).subscribe({
      next: (result) => {
        this.bodegas = result;
        this.bodegasMap.clear();
        result.forEach(b =>
          this.bodegasMap.set(b.bod_codigo, b.bod_nombre)
        );
        this.cargarPorBodega();
      }
    });
  }

  cargarDashboard(): void {
    if (!this.bodegaSeleccionada) return;
    this.loading = true;

    forkJoin({
      resumen: this.dashboardService.getResumen(this.bodegaSeleccionada),
      porMes: this.dashboardService.getPorMes(this.bodegaSeleccionada, this.anio),
      topProductos: this.dashboardService.getTopProductos(this.bodegaSeleccionada)
    }).pipe(finalize(() => this.loading = false))
      .subscribe(({ resumen, porMes, topProductos }) => {
        this.resumen = resumen;
        this.porMes = porMes;
        this.topProductos = topProductos;
        this.buildChartMes();
        this.buildChartProductos();
      });
  }

  cargarPorBodega(): void {
    this.dashboardService.getPorBodega().subscribe(data => {
      this.porBodega = data.map(item => ({
        ...item,
        nombreBodega: this.bodegasMap.get(item.idBodega)
      }));
    });
  }

  calcularPorcentaje(b: ObservacionPorBodega): number {
    return b.total > 0 ? Math.round((b.corregidos / b.total) * 100) : 0;
  }

  get porcentajeCorreccion(): number {
    if (!this.resumen || this.resumen.totalObservaciones === 0) return 0;
    return Math.round((this.resumen.conCorreccion / this.resumen.totalObservaciones) * 100);
  }

  nombreMes(num: number): string {
    const meses = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return meses[num] ?? '';
  }

  private buildChartMes(): void {
    const labels = this.porMes.map(m => this.nombreMes(m.mes));
    this.chartMesData = {
      labels,
      datasets: [
        {
          label: 'Corregidos',
          data: this.porMes.map(m => m.corregidos),
          backgroundColor: '#22c55e',
          borderRadius: 4
        },
        {
          label: 'Pendientes',
          data: this.porMes.map(m => m.total - m.corregidos),
          backgroundColor: '#ef4444',
          borderRadius: 4
        }
      ]
    };
    this.chartMesOptions = {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
      }
    };
  }

  private buildChartProductos(): void {
    const top5 = this.topProductos.slice(0, 5);
    const palette = ['#6366f1','#f59e0b','#ef4444','#22c55e','#3b82f6'];
    this.chartProductosData = {
      labels: top5.map(p => p.descripcion?.substring(0, 20) ?? p.id),
      datasets: [{
        data: top5.map(p => p.total),
        backgroundColor: palette,
        hoverOffset: 6
      }]
    };
    this.chartProductosOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    };
  }
}
