import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Muestra} from '@models/muestra';

@Injectable({
  providedIn: 'root'
})
export class MuestraService {

  private baseUrl = environment.apiUrlBase + 'muestra';
  private http = inject(HttpClient)

  constructor() { }

  listarTramite(tramiteId:string): Observable<Muestra[]> {
    return this.http.get<Muestra[]>(`${this.baseUrl}/list/${tramiteId}`);
  }

  addCompare(barra: string, muestra: string, tramite: string, status: boolean): Observable<Muestra> {
    return this.http.get<Muestra>(`${this.baseUrl}/add/compare/${barra}/${muestra}/${tramite}/${status}`, {})
  }

  validate(tramite: string): Observable<Muestra[]> {
    return this.http.get<Muestra[]>(`${this.baseUrl}/validate/${tramite}`);
  }
}
