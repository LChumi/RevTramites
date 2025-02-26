import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {Ripple} from 'primeng/ripple';
import {Router} from '@angular/router';
import {LoginRequest} from '../../../core/dto/login-request';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    ButtonDirective,
    Ripple,
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styles: ``
})
export default class LoginComponent implements OnInit {
  password!: string;

  loginForm!: FormGroup
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private autService = inject(AuthService)
  submitted = false;

  ngOnInit(): void {
    this.getSession()
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) return

    const usuario = this.loginForm.get('usuario')?.value;
    const password = this.loginForm.get('password')?.value;

    const user: LoginRequest = {
      username: usuario,
      password: password,
    }

    this.autService.login(user).subscribe({
      next: usuario => {
        console.log(usuario);
        const nombres = usuario.usr_nombre.split(' ');
        const nombre = nombres[0]; // Primer nombre
        const segundoNombre = nombres.length > 2 ? nombres[2] : nombres.length > 1 ? nombres[1] : ''; // Segundo nombre, si existe
        sessionStorage.setItem("username", nombre + (segundoNombre ? ' ' + segundoNombre : ''));
        this.loginForm.reset();
        this.submitted = true;
      }
    })
  }

  private getSession(){
    setTimeout(() => {
      const username = sessionStorage.getItem("username");
      if (username) {
        this.submitted = true;
      }
    }, 500);
  }

  goToCarga(){
    this.router.navigate(['icep', 'bodega-recepcion', 'carga-bultos']).then(r => {});
  }

  goToRevision(){
    this.router.navigate(['icep', 'bodega-recepcion', 'revision-bultos']).then(r => {});
  }

}
