import {Component, inject} from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule} from '@angular/forms';
import {ReposicionConfiteria} from '@dtos/reposicion-confiteria';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {AvatarModule} from 'primeng/avatar';
import {TooltipModule} from 'primeng/tooltip';
import {ConfiteriaService} from '@services/confiteria.service';

@Component({
  selector: 'app-pedidos-generados',
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule,
    TableModule,
    DatePipe,
    AvatarModule,
    TooltipModule
  ],
  templateUrl: './pedidos-generados.component.html',
  styles: ``
})
export default class PedidosGeneradosComponent {

  private confiteriaService = inject(ConfiteriaService)

  reposiciones: ReposicionConfiteria[] = []

  fechaInicio: any;
  fechaFin: any;

  find(){
    if (this.fechaInicio && this.fechaFin){
      const fechaApiInicio = this.fechaInicio.toISOString().split('T')[0];
      const fechaApiFin = this.fechaFin.toISOString().split('T')[0];
      this.confiteriaService.listarReposiciones(fechaApiInicio, fechaApiFin).subscribe({
        next: value => {
          this.reposiciones = value;
        }
      })
    }


  }

  decargarPDF(r: ReposicionConfiteria){
    this.confiteriaService.descargarExcel(r.id, r.proveedor).subscribe({
      error: (err) => console.error('Error al descargar:', err)
    });
  }


}
