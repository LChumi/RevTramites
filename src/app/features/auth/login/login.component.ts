import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button, ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {Ripple} from 'primeng/ripple';
import {Router} from '@angular/router';

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

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {}

}
