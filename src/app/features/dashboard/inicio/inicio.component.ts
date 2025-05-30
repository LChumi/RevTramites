import {Component, inject, OnInit} from '@angular/core';
import {getCurrentDateNow, getCurrentTime} from '@utils/date-utils';
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
import {Button} from 'primeng/button';
import {ContenedorDuracion} from '@dtos/contenedor-duracion';
import {ChartModule} from 'primeng/chart';
import {ContenedoresService} from '@services/contenedores.service';
import {ProductoHistorialResumen} from '@dtos/producto-historial-resumen';

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
    ChartModule
  ],
  templateUrl: './inicio.component.html',
  styles: ``
})
export default class InicioComponent implements OnInit{

  private tramiteService = inject(TramiteService)
  private contenedorService = inject(ContenedoresService)

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

  getDuracionesContenedores(): ContenedorDuracion[] {
    return this.contenedores
      .filter(c => c.startDate && c.endHour) //Solo los que estan finalizados
      .map(c => {
        const inicio = new Date(c.startDate).getTime();
        const fin = new Date(c.endHour).getTime();
        const duracionHoras = (fin - inicio) / (1000 * 60 * 60); //Convertir de ms a horas
        return {
          contenedorId: c.contenedorId,
          duracionHoras: parseFloat(duracionHoras.toFixed(2))
        }
      })
  }

  chartData: any;
  chartOptions: any;

  generarGraficoDuracion() {
    const datos = this.getDuracionesContenedores();

    this.chartData = {
      labels: datos.map(d => d.contenedorId),
      datasets: [
        {
          label: 'Duración (horas)',
          data: datos.map(d => d.duracionHoras),
          backgroundColor: '#42A5F5'
        }
      ]
    };

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Duración de Contenedores Finalizados' }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Horas'
          }
        }
      }
    };
  }


  buscarContenedores(tramite: Tramite) {
    this.loading = true;
    this.display = true;
    this.contenedorService.buscarContenedores(tramite.id).subscribe({
      next: (data) => {
        this.contenedores = data;
        this.tramiteId = tramite.id;
        this.generarGraficoDuracion(); // Llama aquí
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


  chartProductosHistorialData: any;
  chartProductosHistorialOptions: any;

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


}
