import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProcesoCotizacionService} from '@services/embarque/proceso-cotizacion.service';
import {ProcesoCotizacion} from '@models/embarque/proceso-cotizacion';
import {MessageService, PrimeTemplate} from 'primeng/api';
import { SalidaBuqueFormComponent } from '@features/embarques/cotizaciones/proceso-detalle/components/salida-buque-form/salida-buque-form.component';
import {PuertoEmbarque} from '@models/embarque/puerto-embarque';
import {Consignatario} from '@models/embarque/consignatario';
import {PuertoEmbarqueService} from '@services/embarque/puerto-embarque.service';
import {ConsignatarioService} from '@services/embarque/consignatario.service';
import {SalidaBuque} from '@models/embarque/salida-buque';
import {SalidaBuqueService} from '@services/embarque/salida-buque.service';
import {ButtonDirective} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';

@Component({
  selector: 'app-proceso-detalle',
  standalone: true,
  imports: [
    SalidaBuqueFormComponent,
    ButtonDirective,
    DatePipe,
    PrimeTemplate,
    Ripple,
    TableModule,
    TagModule,
    TooltipModule,
    CardModule,
    BadgeModule
  ],
  templateUrl: './proceso-detalle.component.html',
  styles: ``
})
export default class ProcesoDetalleComponent implements OnInit{

  private puertoService = inject(PuertoEmbarqueService);
  private consignatarioService = inject(ConsignatarioService)
  private procesoService = inject(ProcesoCotizacionService)
  private salidaBuque = inject(SalidaBuqueService)
  private messageService = inject(MessageService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  salidaBuques: SalidaBuque[] =[]
  puertos: PuertoEmbarque[] = [];
  consignatarios: Consignatario[] = [];

  cotizacion: ProcesoCotizacion | null = null

  idProcesoCotizacion : any

  ngOnInit(): void {
    this.idProcesoCotizacion = this.route.snapshot.paramMap.get('id') ?? null
    if (this.idProcesoCotizacion == null){
      this.return()
    }
    this.getCotizacion(this.idProcesoCotizacion);
    this.listarPuerto();
    this.listarConsignatarios();
  }

  getCotizacion(id:string){
    this.procesoService.getById(id).subscribe({
      next: value => {
        if (value){
          this.cotizacion= value
          this.getSalidas(id)
        }else {
          this.return()
        }
      }
    })
  }

  getSalidas(idCotizacion: string){
    this.salidaBuque.listByCotizacion(idCotizacion).subscribe({
      next: value => this.salidaBuques = value
    })
  }

  onBuqueGuardado(buque: SalidaBuque) {
    this.salidaBuques.push(buque); // o recarga la lista
  }

  listarPuerto() {
    this.puertoService.list().subscribe({
      next: value => this.puertos = value
    })
  }

  listarConsignatarios() {
    this.consignatarioService.list().subscribe({
      next: value => this.consignatarios = value
    })
  }

  viewBuque(id: string){

  }

  return(){
    this.router.navigate(['erp/embarques/cotizaciones']).then(r => {
      this.messageService.addAll([
        {severity: 'error', summary:'Error', detail:'Valor no identificado'},
        {severity: 'warn', summary:'Advertencia', detail:'El identificador no se encuentra disponible '}
      ])
    })
  }

  // salida-buque.component.ts
  get activosCount(): number {
    return this.salidaBuques.filter(b => b.activo).length;
  }

  get inactivosCount(): number {
    return this.salidaBuques.filter(b => !b.activo).length;
  }

}
