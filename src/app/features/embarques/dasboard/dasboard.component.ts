import {Component, inject, OnInit} from '@angular/core';
import {TagModule} from 'primeng/tag';
import {ChartModule} from 'primeng/chart';
import {KnobModule} from 'primeng/knob';
import {RatingModule} from 'primeng/rating';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {BadgeModule} from 'primeng/badge';
import {FleteValidado} from '@models/embarque/flete-validado';
import {TramiteEmbarque} from '@models/embarque/tramite-embarque';
import {TramiteEmbarqueService} from '@services/embarque/tramite-embarque.service';
import {FleteValidadoService} from '@services/embarque/flete-validado.service';
import {FormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SkeletonModule} from 'primeng/skeleton';

export interface TramiteConFlete {
  tramite: TramiteEmbarque;
  flete: FleteValidado;
}

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [
    TagModule,
    ChartModule,
    KnobModule,
    RatingModule,
    TableModule,
    CurrencyPipe,
    DatePipe,
    BadgeModule,
    FormsModule,
    ProgressSpinnerModule,
    SkeletonModule
  ],
  templateUrl: './dasboard.component.html',
  styles: ``
})
export default class DasboardComponent implements OnInit {

  private tramiteService = inject(TramiteEmbarqueService)
  private fleteService = inject(FleteValidadoService)

  private tramites: TramiteEmbarque[] = []
  private fletesValidados: FleteValidado[] = []
  loading = false

  kpis = [
    {label: 'Trámites totales', value: '0', sub: 'registrados'},
    {label: 'Fletes vigentes', value: '0', sub: 'activos'},
    {label: 'Total flete promedio', value: '$0', sub: 'USD por BL'},
    {label: 'Contenedores', value: '0', sub: 'embarcados'},
    {label: 'Días libres prom.', value: '0', sub: 'días en puerto'},
  ];
  rutas: any[] = []
  tramitesConFlete: TramiteConFlete[] = [];
  totalGeneral = 0;

  barData: any;
  barOptions: any;
  doughnutData: any;
  pieOptions: any;
  polarData: any;
  polarOptions: any;

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.loading = true;

    forkJoin({
      tramites: this.tramiteService.list(),
      fletes: this.fleteService.getAll()
    }).subscribe({
      next: ({tramites, fletes}) => {
        this.tramites = tramites;
        this.fletesValidados = fletes;

        this.buildDashboard();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  buildDashboard() {
    this.buildRutas()
    this.buildTramitesConFlete();
    this.buildKPIs();
    this.buildCharts();
  }

  private buildRutas(): void {

    const rutasMap = new Map<string, number[]>();

    this.tramites.forEach(t => {

      const ruta = `${t.puertoSalida}→${t.puertoLlegada}`;

      if (!rutasMap.has(ruta)) {
        rutasMap.set(ruta, []);
      }

      rutasMap.get(ruta)?.push(t.diasLibres);
    });

    const colores = [
      '#378ADD',
      '#1D9E75',
      '#D4537E',
      '#7F77DD',
      '#EF9F27'
    ];

    this.rutas = [...rutasMap.entries()].map(([ruta, dias], i) => ({
      ruta,
      valor: Math.round(
        dias.reduce((a, b) => a + b, 0) / dias.length
      ),
      color: colores[i % colores.length]
    }));
  }

  // ─── Helpers ─────────────────────────────────────────────────

  /** Combina trámites con su flete VIGENTE correspondiente */
  private buildTramitesConFlete(): void {
    const vigentesMap = new Map<string, FleteValidado>();
    this.fletesValidados
      .filter(f => f.estado === 'VIGENTE')
      .forEach(f => vigentesMap.set(f.id, f));

    this.tramitesConFlete = this.tramites
      .filter(t => vigentesMap.has(t.fleteValidadoId))
      .map(t => ({
        tramite: t,
        flete: vigentesMap.get(t.fleteValidadoId)!,
      }));

    this.totalGeneral = this.tramitesConFlete.reduce(
      (acc, r) => acc + r.flete.total, 0
    );
  }

  private buildKPIs(): void {
    const vigentes = this.fletesValidados.filter(f => f.estado === 'VIGENTE');
    const totales = vigentes.map(f => f.total);
    const promedio = totales.length
      ? totales.reduce((a, b) => a + b, 0) / totales.length
      : 0;

    const diasArr = this.tramites.map(t => t.diasLibres);
    const diasProm = diasArr.length
      ? Math.round(diasArr.reduce((a, b) => a + b, 0) / diasArr.length)
      : 0;

    const contenedores = this.tramitesConFlete.reduce(
      (acc, r) => acc + (r.tramite.cantidadContenedores
        ? +r.tramite.cantidadContenedores : 1), 0
    );

    this.kpis = [
      {label: 'Trámites totales', value: String(this.tramites.length), sub: 'registrados'},
      {label: 'Fletes vigentes', value: String(vigentes.length), sub: 'activos'},
      {
        label: 'Total flete promedio',
        value: '$' + promedio.toLocaleString('en', {maximumFractionDigits: 0}),
        sub: 'USD por BL'
      },
      {label: 'Contenedores', value: String(contenedores), sub: 'embarcados'},
      {label: 'Días libres prom.', value: String(diasProm), sub: 'días en puerto'},
    ];
  }

  private buildCharts(): void {
    // ── Bar: consignatarios ──────────────────────────────────
    const consMap = new Map<string, number>();
    this.fletesValidados
      .filter(f => f.estado === 'VIGENTE')
      .forEach(f => consMap.set(
        f.nombreConsignatario,
        (consMap.get(f.nombreConsignatario) ?? 0) + f.total
      ));

    this.barData = {
      labels: [...consMap.keys()],
      datasets: [{
        label: 'Total USD',
        data: [...consMap.values()],
        backgroundColor: ['#378ADD', '#1D9E75', '#D4537E', '#7F77DD', '#EF9F27'],
        borderRadius: 4,
        borderSkipped: false,
      }],
    };
    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {display: false}},
      scales: {
        x: {ticks: {font: {size: 10}}},
        y: {ticks: {callback: (v: number) => '$' + v.toLocaleString(), font: {size: 10}}},
      },
    };

    // ── Doughnut: estados ────────────────────────────────────
    const vigentes = this.fletesValidados.filter(f => f.estado === 'VIGENTE').length;
    const anulados = this.fletesValidados.filter(f => f.estado === 'ANULADO').length;
    const pendientes = this.fletesValidados.length - vigentes - anulados;

    this.doughnutData = {
      labels: ['Vigente', 'Anulado', 'Pendiente'],
      datasets: [{
        data: [vigentes, anulados, pendientes],
        backgroundColor: ['#639922', '#E24B4A', '#888780'],
        borderWidth: 0,
        hoverOffset: 8,
      }],
    };
    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {legend: {display: false}},
    };

    // ── Polar: componentes de costo ──────────────────────────
    const sumaFlete = this.fletesValidados.filter(f => f.estado === 'VIGENTE')
      .reduce((a, f) => a + f.flete, 0);
    const sumaThc = this.fletesValidados.filter(f => f.estado === 'VIGENTE')
      .reduce((a, f) => a + f.thc, 0);
    const sumaGastos = this.fletesValidados.filter(f => f.estado === 'VIGENTE')
      .reduce((a, f) => a + f.gastosBlTotal, 0);
    const sumaHandling = this.fletesValidados.filter(f => f.estado === 'VIGENTE')
      .reduce((a, f) => a + f.handlingContenedorTotal, 0);

    this.polarData = {
      labels: ['Flete', 'THC', 'Gastos BL', 'Handling'],
      datasets: [{
        data: [sumaFlete, sumaThc, sumaGastos, sumaHandling],
        backgroundColor: ['#7F77DD99', '#EF9F2799', '#1D9E7599', '#D4537E99'],
        borderColor: ['#7F77DD', '#EF9F27', '#1D9E75', '#D4537E'],
        borderWidth: 1,
      }],
    };
    this.polarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {display: false}},
      scales: {r: {ticks: {display: false}}},
    };
  }

  /** Devuelve la severidad de p-tag según estado del trámite */
  getEstadoSeverity(estado: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'secondary'> = {
      VIGENTE: 'success',
      EMBARCADO: 'info',
      PENDIENTE: 'warning',
      ANULADO: 'danger',
    };
    return map[estado] ?? 'secondary';
  }
}
