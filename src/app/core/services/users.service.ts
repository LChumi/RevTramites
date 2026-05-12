import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {UsuarioBod} from '@dtos/usuario-bod';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = environment.apiMongo + 'usuario_bod';
  private http = inject(HttpClient)

  constructor() { }

  upsert(user: UsuarioBod): Observable<UsuarioBod>{
    return this.http.post<UsuarioBod>(`${this.url}/upsert`, user);
  }

  getUser(idUsuario:string): Observable<UsuarioBod>{
    return this.http.get<UsuarioBod>(`${this.url}/${idUsuario}`);
  }
}
