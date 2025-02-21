import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';

@Component({
  imports: [
    FormsModule,
    Button,
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styles: ``
})
export default class LoginComponent {
}
