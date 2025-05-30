import {Component, inject, OnInit} from '@angular/core';
import {getCurrentDateNow, getCurrentTime, horaEnDecimal, horaEnMinutos, horaFormateada} from '@utils/date-utils';
import {TramiteService} from '@services/tramite.service';
import {Tramite} from '@models/tramite';
import {Contenedor} from '@models/contenedor';
import {Producto} from '@models/producto';
import {DataViewModule} from 'primeng/dataview';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {NgClass, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RatingModule} from 'primeng/rating';
import {TagModule} from 'primeng/tag';
import {Button, ButtonDirective} from 'primeng/button';
import {ChartModule} from 'primeng/chart';
import {ContenedoresService} from '@services/contenedores.service';
import {ProductoHistorialResumen} from '@dtos/producto-historial-resumen';
import {DialogModule} from 'primeng/dialog';
import {ScrollTopModule} from 'primeng/scrolltop';
import {TableModule} from 'primeng/table';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ChartDataset, ChartOptions} from 'chart.js';
import {Ripple} from 'primeng/ripple';
import {ToolbarModule} from 'primeng/toolbar';

interface XYPoint {
  x: number;
  y: string; // IMPORTANTE: Y es string porque usamos 'category'
}

@Component({
  standalone: true,
  imports: [
    DataViewModule,
    ProcesoTramitePipe,
    EstadoColorPipe,
    NgStyle,
    FormsModule,
    RatingModule,
    TagModule,
    Button,
    NgClass,
    ChartModule,
    DialogModule,
    ScrollTopModule,
    TableModule,
    ToggleButtonModule,
    ButtonDirective,
    Ripple,
    ToolbarModule
  ],
  templateUrl: './inicio.component.html',
  styles: ``
})
export default class InicioComponent implements OnInit{

  private tramiteService = inject(TramiteService)
  private contenedorService = inject(ContenedoresService)

  chartProductosHistorialData: any;
  chartProductosHistorialOptions: any;

  chartLineContenedoresData: any;
  chartLineContenedoresOptions: any;

  tramites: Tramite[] = []
  contenedores: Contenedor[] = []
  productos: Producto[] = []

  nombre: any
  fecha: any;
  hora: any;

  loading = false;
  display = false;
  tramiteId: string = '';

  constructor() {
    this.getInfo()
  }

  ngOnInit(): void {
    this.getTramites()
    }

  getInfo() {
    this.nombre = sessionStorage.getItem('username');
    this.fecha = getCurrentDateNow();
    this.hora = getCurrentTime();
  }

  getTramites() {
    this.tramiteService.getTramiestWeek().subscribe({
      next: data => {
        this.tramites = data;
      }
    })
  }

  buscarContenedores(tramite: Tramite) {
    this.loading = true;
    this.display = true;
    this.contenedorService.buscarContenedores(tramite.id).subscribe({
      next: (data) => {
        this.contenedores = data;
        console.log(data)
        this.tramiteId = tramite.id;
        this.generarGraficoLineasContenedores(); // Llama aquí
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.display = false;
      }
    });
  }

  getResumenHistorialProductos(): ProductoHistorialResumen {
    let conRevision = 0;
    let conMuestra = 0;
    let sinHistorial = 0;

    for (const p of this.productos) {
      const tieneRevision = p.historialRevision && p.historialRevision.length > 0;
      const tieneMuestra = p.historialBarrasMuestra && p.historialBarrasMuestra.length > 0;

      if (tieneRevision) conRevision++;
      if (tieneMuestra) conMuestra++;
      if (!tieneRevision && !tieneMuestra) sinHistorial++;
    }

    return { conRevision, conMuestra, sinHistorial };
  }

  generarGraficoLineasContenedores() {
    const datasets: ChartDataset<'line', XYPoint[]>[] = [];

    const colores = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043'];

    this.contenedores.forEach((c, index) => {
      if (!c.endHour) return;

      const start = horaEnDecimal(c.startHour);
      const end = horaEnDecimal(c.endHour);
      const duracion = end - start;
      const minutos = Math.round(duracion * 60);

      // Convertir minutos a formato "h min"
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      const tiempoFormateado = horas > 0 ? `${horas}h ${mins} min` : `${mins} min`;

      const label = `TIEMPO DE DESCARGA (${tiempoFormateado}) ENCARGADO: ${c.usrBloquea} `;

      const  horaIni= horaFormateada(c.startHour)
      const horaFin= horaFormateada(c.endHour)

      datasets.push({
        label,
        borderColor: colores[index % colores.length],
        backgroundColor: colores[index % colores.length],
        data: [
          { x: horaIni, y: c.contenedorId },
          { x: horaFin, y: c.contenedorId }
        ],
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: true,
        fill: false
      });
    });

    this.chartLineContenedoresData = { datasets };

    this.chartLineContenedoresOptions = <ChartOptions<'line'>>{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx: any) => ctx.dataset.label
          }
        },
        title: {
          display: true,
          text: 'Duración de Procesamiento por Contenedor'
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Hora del día'
          },
          ticks: {
            callback: (value: number) => {
              const h = Math.floor(value);
              const m = Math.round((value - h) * 60);
              return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            },
            stepSize: 0.5,
            min: 6,
            max: 20
          }
        },
        y: {
          type: 'category',
          title: {
            display: true,
            text: 'Contenedores'
          }
        }
      }
    };
  }

  generarGraficoHistorialProductos() {
    const resumen = this.getResumenHistorialProductos();

    this.chartProductosHistorialData = {
      labels: ['Revisión', 'Muestra', 'Sin historial'],
      datasets: [
        {
          label: 'Productos',
          data: [resumen.conRevision, resumen.conMuestra, resumen.sinHistorial],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
        }
      ]
    };

    this.chartProductosHistorialOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Historial de Productos'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    };
  }

  listarProducto(tramiteId: string) {
    this.tramiteService.productos(tramiteId).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.productos = data;
          this.tramiteId = tramiteId;
          this.generarGraficoHistorialProductos(); // Aquí
        } else {
          this.productos = [];
        }
      }
    });
  }

  regresar() {
    this.display = false;
    this.tramiteId = '';
    this.productos = [];
    this.contenedores = [];
  }
}
