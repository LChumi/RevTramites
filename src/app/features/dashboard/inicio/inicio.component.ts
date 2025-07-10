import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {getCurrentDateNow, getCurrentTime, horaFormateada} from '@utils/date-utils';
import {TramiteService} from '@services/tramite.service';
import {Tramite} from '@models/tramite';
import {Contenedor} from '@models/contenedor';
import {Producto} from '@models/producto';
import {DataViewModule} from 'primeng/dataview';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';
import {isPlatformBrowser, NgClass, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RatingModule} from 'primeng/rating';
import {TagModule} from 'primeng/tag';
import {Button, ButtonDirective} from 'primeng/button';
import {ChartModule} from 'primeng/chart';
import {ContenedoresService} from '@services/contenedores.service';
import {DialogModule} from 'primeng/dialog';
import {ScrollTopModule} from 'primeng/scrolltop';
import {TableModule} from 'primeng/table';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ChartDataset, ChartOptions} from 'chart.js';
import {Ripple} from 'primeng/ripple';
import {ToolbarModule} from 'primeng/toolbar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

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
    ToolbarModule,
    ProgressSpinnerModule
  ],
  templateUrl: './inicio.component.html',
  styles: ``
})
export default class InicioComponent implements OnInit {

  private tramiteService = inject(TramiteService)
  private contenedorService = inject(ContenedoresService)
  private platformId = inject(PLATFORM_ID)

  chartProductoHistorialData: any;
  chartProductoHistorialOptions: any;

  chartLineContenedoresRevisionData: any;
  chartLineContenedoresRevisionOptions: any;

  chartLineContenedoresMuestraData: any;
  chartLineContenedoresMuestraOptions: any;

  contenedorGraficos: any[] = [];

  tramites: Tramite[] = []
  contenedores: Contenedor[] = []
  productos: Producto[] = []

  nombre: any
  fecha: any;
  hora: any;

  loading = false;
  isLoadingGraficos = true;
  display = false;
  tramiteId: string = '';

  constructor() {
    this.getInfo()
  }

  ngOnInit(): void {
    this.getTramites()
  }

  getInfo() {
    if (isPlatformBrowser(this.platformId)) {
      this.nombre = sessionStorage.getItem('username');
    }

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

  getTramitesMonth() {
    this.tramiteService.getTramiestMonth().subscribe({
      next: data => {
        this.tramites = data;
      }
    })
  }

  obtenerDatosGraficos(tramite: Tramite) {
    this.loading = true;
    this.display = true;
    this.getContenedores(tramite)
    this.listarProducto(tramite.id)
  }

  getContenedores(tramite: Tramite) {
    this.contenedorService.buscarContenedores(tramite.id).subscribe({
      next: (data) => {
        this.contenedores = data;
        this.tramiteId = tramite.id;
        this.getValues()

        // Solo generar gráfico si hay al menos un contenedor con hora de inicio de revisión válida
        const tieneDatosRevision = this.contenedores.some(c => !!c.startHour);
        if (tieneDatosRevision) {
          this.generarGraficoLineasContenedoresRevision();
        }

        // Solo generar gráfico si hay al menos un contenedor con hora de inicio de muestra válida
        const tieneDatosMuestra = this.contenedores.some(c => !!c.startMuestra);
        if (tieneDatosMuestra) {
          this.generarGraficoLineasContenedoresMuestra();
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.display = false;
      }
    });
  }

  listarProducto(tramiteId: string) {
    this.tramiteService.productos(tramiteId).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.productos = data;
          this.tramiteId = tramiteId;
          this.generarGraficoProductosPorHistorial(); // Aquí
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

  generarGraficoLineasContenedoresRevision() {
    this.chartLineContenedoresRevisionData = {
      datasets: this.generarDatasetContenedores(
        'descarga',
        c => c.startHour,
        c => c.endHour,
        c => [c.startHour, c.endHour],
        'Duración Descarga por Contenedor'
      )
    };

    this.chartLineContenedoresRevisionOptions = this.getOpcionesLinea('Duración Descarga por Contenedor');
  }

  generarGraficoLineasContenedoresMuestra() {
    this.chartLineContenedoresMuestraData = {
      datasets: this.generarDatasetContenedores(
        'muestra',
        c => c.startMuestra,
        c => c.endMuestra,
        c => [c.startMuestra, c.endMuestra],
        'Duración de Muestras por Contenedor'
      )
    };

    this.chartLineContenedoresMuestraOptions = this.getOpcionesLinea('Duración de Muestras por Contenedor');
  }

  generarGraficoProductosPorHistorial() {
    const labels = this.productos.map(p => p.nombre ?? p.id);

    const revisionData = this.productos.map(p => p.historialRevision?.length ?? 0);
    const muestraData = this.productos.map(p => p.historialBarrasMuestra?.length ?? 0);

    this.chartProductoHistorialData = {
      labels,
      datasets: [
        {
          label: 'Historial de Revisión',
          backgroundColor: 'rgb(0,190,231)',
          data: revisionData
        },
        {
          label: 'Historial de Muestra',
          backgroundColor: '#e37e3f',
          data: muestraData
        }
      ]
    };

    this.chartProductoHistorialOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Cantidad de Items escaneados en Revisión y Muestra'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Productos'
          },
          ticks: {
            autoSkip: true,
            padding: 15,
            font: {
              size: 8
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de bultos escaneados'
          },
          ticks: {
            stepSize: 2
          }
        }
      }
    };
  }

  private generarDatasetContenedores(
    tipo: 'descarga' | 'muestra',
    getStart: (c: any) => string,
    getEnd: (c: any) => string,
    getHoraLabel: (c: any) => string[],
    titulo: string
  ): ChartDataset<'line', XYPoint[]>[] {
    const colores = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043'];

    return this.contenedores
      .map((c, index) => {
        const start = horaFormateada(getStart(c));
        const end = horaFormateada(getEnd(c));
        if (isNaN(start) || isNaN(end)) return undefined; // usar undefined, no null

        const duracion = end - start;
        const minutos = Math.round(duracion * 60);
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        const tiempoFormateado = horas > 0 ? `${horas}h ${mins} min` : `${mins} min`;
        const [horaIni, horaFin] = getHoraLabel(c);

        const label = `TIEMPO DE ${tipo.toUpperCase()} (${tiempoFormateado}) ENCARGADO: ${c.usrBloquea}`;

        return {
          label,
          borderColor: colores[index % colores.length],
          backgroundColor: colores[index % colores.length],
          data: [
            {x: horaFormateada(horaIni), y: c.contenedorId},
            {x: horaFormateada(horaFin), y: c.contenedorId}
          ],
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: true,
          fill: false
        } as ChartDataset<'line', XYPoint[]>;
      })
      .filter((d): d is ChartDataset<'line', XYPoint[]> => !!d); // <-- Narrow type
  }

  private getOpcionesLinea(titulo: string): ChartOptions<'line'> {
    return {
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
          text: titulo
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
            callback: (tickValue: string | number) => {
              const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
              const h = Math.floor(value);
              const m = Math.round((value - h) * 60);
              return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            },
            stepSize: 0.5,
          }
        },
        y: {
          type: 'category',
          title: {
            display: true,
            text: 'Contenedores'
          },
          ticks: {
            autoSkip: true,
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    };
  }

  getValues() {
    this.isLoadingGraficos = true;
    this.contenedorGraficos = [];

    const total = this.contenedores.length;
    let loaded = 0;

    for (const contenedor of this.contenedores) {
      this.tramiteService.getPercentage(this.tramiteId, contenedor.contenedorId).subscribe({
        next: data => {
          const porcentaje = Math.round(data);

          let color = '#4CAF50'; // verde por defecto
          if (porcentaje < 50) {
            color = '#FF5252'; // rojo
          } else if (porcentaje < 80) {
            color = '#FFC107'; // amarillo
          } else if (porcentaje > 101) {
            color = '#e37e3f'
          }

          this.contenedorGraficos.push({
            label: `Contenedor ${contenedor.contenedorId}`,
            porcentaje: porcentaje,
            chartData: {
              labels: ['Procesado', 'Restante'],
              datasets: [{
                data: [porcentaje, 100 - porcentaje],
                backgroundColor: [color, '#E0E0E0']
              }]
            },
            chartOptions: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            },
            iconColor: color
          });

          loaded++;
          if (loaded === total) {
            this.isLoadingGraficos = false;
          }
        },
        error: () => {
          loaded++;
          if (loaded === total) {
            this.isLoadingGraficos = false;
          }
        }
      });
    }
  }

}
