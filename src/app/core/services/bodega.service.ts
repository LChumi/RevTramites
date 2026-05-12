import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bodega} from '@dtos/bodega';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {

  private baseUrl = environment.apiOracle + 'bodegas/'
  private http = inject(HttpClient);

  constructor() { }

  getBodegas(usuario: any, empresa: any): Observable<Bodega[]> {
    return this.http.get<Bodega[]>(`${this.baseUrl}listaBodegas/${usuario}/${empresa}`);
  }
}
