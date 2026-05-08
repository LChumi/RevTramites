import {Component, inject, PLATFORM_ID} from '@angular/core';
import {getCurrentDateNow, getCurrentTime, getDateFormattedNow} from '@utils/date-utils';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  private platformId = inject(PLATFORM_ID)
  nombre: any
  fecha: any;
  hora: any;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.nombre = sessionStorage.getItem('username');
    }

    this.fecha = getCurrentDateNow();
    this.hora = getCurrentTime();
  }

}
