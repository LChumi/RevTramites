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
    NgClass
  ],
  templateUrl: './inicio.component.html',
  styles: ``
})
export default class InicioComponent implements OnInit{

  private tramiteService = inject(TramiteService)

  tramites: Tramite[] = []
  contenedores: Contenedor[] = []
  productos: Producto[] = []

  nombre: any
  fecha: any;
  hora: any;

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

}
