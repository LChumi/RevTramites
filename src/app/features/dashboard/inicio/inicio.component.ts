import { Component } from '@angular/core';
import {getCurrentDateNow, getCurrentTime} from '@utils/date-utils';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styles: ``
})
export default class InicioComponent {

  nombre:any
  fecha: any;
  hora: any;

  constructor() {
    this.getInfo()
  }

  getInfo() {
    this.nombre = sessionStorage.getItem('username');
    this.fecha = getCurrentDateNow();
    this.hora = getCurrentTime();
  }

}
