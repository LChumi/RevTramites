import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from '../dto/login-request';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://192.168.112.36:7569/usuarios'
  private http = inject(HttpClient)

  constructor() { }

  login(user: LoginRequest):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`, user)
  }
}
