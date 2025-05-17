import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '@models/producto';

@Injectable({
  providedIn: 'root'
})
export class MuestraService {

  private baseUrl = environment.apiUrlBase + 'muestra';
  private http = inject(HttpClient)

  constructor() {
  }

  listarTramite(tramiteId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/list/${tramiteId}`);
  }

  addCompare(barra: string, muestra: string, tramite: string, status: boolean): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/add/compare/${barra}/${muestra}/${tramite}/${status}`, {})
  }

  validate(tramite: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/validate/${tramite}`);
  }
}
