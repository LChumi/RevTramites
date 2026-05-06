import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {Ripple} from 'primeng/ripple';
import {Router} from '@angular/router';
import {LoginRequest} from '@dtos/login-request';
import {AuthService} from '@services/auth.service';
import {isPlatformBrowser} from '@angular/common';
import {WsService} from '@services/ws/ws.service';
import {UsersService} from '@services/users.service';
import {UsuarioBod} from '@dtos/usuario-bod';

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

  loginForm!: FormGroup

  private fb = inject(FormBuilder)
  private router = inject(Router)
  private autService = inject(AuthService)
  private userService = inject(UsersService)
  private platformId = inject(PLATFORM_ID);
  private notificacionService = inject(WsService);

  submitted = false;
  isBrowser = false;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.getSession()
    }

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
        if (this.isBrowser) {
          const nombres = usuario.usr_nombre.split(' ');
          const nombre = nombres[0]; // Primer nombre
          const segundoNombre = nombres.length > 2 ? nombres[2] : nombres.length > 1 ? nombres[1] : ''; // Segundo nombre, si existe
          sessionStorage.setItem("username", nombre + (segundoNombre ? ' ' + segundoNombre : ''));
          sessionStorage.setItem("usercode", usuario.usr_codigo)
          sessionStorage.setItem("usrId", usuario.usr_id);
          sessionStorage.setItem("idEmpresa",String(usuario.usr_empresa_def))
          const user: UsuarioBod = {
            id: null,
            nombre: usuario.usr_nombre,
            idUsuario: usuario.usr_id,
            roles: ['public']
          }
          this.userService.upsert(user).subscribe({
            next: usr => {
              this.notificacionService.init(usr.idUsuario, usr.roles);
            }
          })
        }

        this.loginForm.reset();
        this.submitted = true;
        this.goToDashboard()
      }, error: err => {
        console.error('Error en login', err);
      }
    })
  }

  private getSession() {
    setTimeout(() => {
      const username = sessionStorage.getItem("username");
      if (username) {
        this.goToDashboard()
      }
    }, 500);
  }

  goToDashboard() {
    this.router.navigate(['tramites', 'dashboard']).then(r => {
    });
  }

}
