import { Component } from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule
  ],
  templateUrl: './muestra.component.html',
  styles: ``
})
export default class MuestraComponent {

  barra: any;
  muestra: any;
}
