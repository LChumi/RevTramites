import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Consignatario} from '@models/embarque/consignatario';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsignatarioService {

  private baseUrl = environment.apiMongo + 'consignatario';
  private http = inject(HttpClient)

  constructor() { }

  save(c : Consignatario): Observable<Consignatario>{
    return this.http.post<Consignatario>(`${this.baseUrl}/save`, c);
  }

  list(): Observable<Consignatario[]>{
    return this.http.get<Consignatario[]>(`${this.baseUrl}/list`);
  }
}
