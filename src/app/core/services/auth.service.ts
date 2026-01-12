import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from '@dtos/login-request';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiLogin + 'usuarios';
  private http = inject(HttpClient)

  constructor() {
  }

  login(user: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user)
  }
}
