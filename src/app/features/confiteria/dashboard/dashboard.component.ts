import {Component, inject, OnInit} from '@angular/core';
import {DashboardConfiteriaDTO} from '@dtos/confiteria/dashboard-confiteria-dto';
import {ConfiteriaService} from '@services/confiteria.service';
import {ProveedorDTO} from '@dtos/confiteria/proveedor-dto';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {SkeletonModule} from 'primeng/skeleton';
import {TagModule} from 'primeng/tag';
import {ChartModule} from 'primeng/chart';
import {BadgeModule} from 'primeng/badge';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule} from '@angular/forms';
import {RefreshIcon} from 'primeng/icons/refresh';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TableModule,
    CurrencyPipe,
    SkeletonModule,
    TagModule,
    DecimalPipe,
    ChartModule,
    BadgeModule,
    CalendarModule,
    FormsModule,
    RefreshIcon,
    TooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent implements OnInit{

  private confiteriaService = inject(ConfiteriaService)

  loading = true;
  data!: DashboardConfiteriaDTO;

  rangoFechas: Date[] | null = null;
  filtroActivo = false;

  // Chart data
  barProveedoresData: any;
  barProveedoresOptions: any;

  lineHistorialData: any;
  lineHistorialOptions: any;

  doughnutTop5Data: any;
  doughnutTop5Options: any;

  polarProveedoresData: any;
  polarProveedoresOptions: any;

  // Paleta de colores consistente
  private paleta = [
    '#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4',
    '#8B5CF6', '#EC4899', '#84CC16', '#F97316', '#14B8A6',
    '#3B82F6', '#A855F7', '#EAB308', '#10B981', '#F43F5E'
  ];

  ngOnInit(): void {
    this.cargarMesActual();
  }

  cargarMesActual(): void {
    const hoy = new Date();
    const fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    this.rangoFechas = [fechaInicio, fechaFin];
    this.filtroActivo = false;
    this.buscar(fechaInicio, fechaFin);
  }

  aplicarFiltro(): void {
    if (!this.rangoFechas?.[0] || !this.rangoFechas?.[1]) return;
    this.filtroActivo = true;
    this.buscar(this.rangoFechas[0], this.rangoFechas[1]);
  }

  private buscar(inicio: Date, fin: Date): void {
    this.loading = true;
    const inicioStr = this.toIsoDate(inicio);
    const finStr = this.toIsoDate(fin);

    this.confiteriaService.dashboard(inicioStr, finStr).subscribe({
      next: (data) => {
        this.data = data;
        this.buildCharts();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private toIsoDate(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private buildCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

    // --- BAR: Proveedores por valor total ---
    const provOrdenados = [...this.data.proveedores].sort((a, b) => b.valorTotal - a.valorTotal);

    this.barProveedoresData = {
      labels: provOrdenados.map(p => this.acortar(p.proveedor, 22)),
      datasets: [
        {
          label: 'Valor total ($)',
          backgroundColor: this.paleta[0],
          borderRadius: 6,
          data: provOrdenados.map(p => p.valorTotal)
        }
      ]
    };

    this.barProveedoresOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        },
        y: {
          ticks: { color: textColor },
          grid: { display: false }
        }
      }
    };

    // --- LINE: Historial ---
    this.lineHistorialData = {
      labels: this.data.historial.map(h => h.fecha),
      datasets: [
        {
          label: 'Valor total ($)',
          data: this.data.historial.map(h => h.valorTotal),
          fill: true,
          borderColor: this.paleta[0],
          backgroundColor: 'rgba(99,102,241,0.15)',
          tension: 0.4
        },
        {
          label: 'Reposiciones',
          data: this.data.historial.map(h => h.reposiciones),
          fill: false,
          borderColor: this.paleta[1],
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    this.lineHistorialOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        },
        y1: {
          position: 'right',
          ticks: { color: textColorSecondary },
          grid: { drawOnChartArea: false }
        }
      }
    };

    // --- DOUGHNUT: Top 5 productos ---
    const top5 = [...this.data.topProductos]
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 5);

    this.doughnutTop5Data = {
      labels: top5.map(p => this.acortar(p.producto, 28)),
      datasets: [
        {
          data: top5.map(p => p.valorTotal),
          backgroundColor: this.paleta.slice(0, 5),
          hoverBackgroundColor: this.paleta.slice(0, 5)
        }
      ]
    };

    this.doughnutTop5Options = {
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, boxWidth: 12, padding: 12 }
        }
      }
    };

    // --- POLAR AREA: distribución productos por proveedor ---
    this.polarProveedoresData = {
      labels: provOrdenados.map(p => this.acortar(p.proveedor, 20)),
      datasets: [
        {
          data: provOrdenados.map(p => p.totalProductos),
          backgroundColor: this.paleta.map(c => c + 'CC')
        }
      ]
    };

    this.polarProveedoresOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: textColor, boxWidth: 10, font: { size: 10 } }
        }
      },
      scales: {
        r: {
          grid: { color: surfaceBorder },
          ticks: { display: false }
        }
      }
    };
  }

  protected acortar(texto: string, max: number): string {
    return texto.length > max ? texto.substring(0, max - 1) + '…' : texto;
  }

  get promedioValorReposicion(): number {
    if (!this.data?.totalReposiciones) return 0;
    return this.data.valorTotal / this.data.totalReposiciones;
  }

  get promedioProductosReposicion(): number {
    if (!this.data?.totalReposiciones) return 0;
    return this.data.totalProductos / this.data.totalReposiciones;
  }

  get topProveedor(): ProveedorDTO | null {
    if (!this.data?.proveedores?.length) return null;
    return [...this.data.proveedores].sort((a, b) => b.valorTotal - a.valorTotal)[0];
  }
}
