import {inject, Injectable} from '@angular/core';
import {ProcesoCotizacion} from '@models/embarque/proceso-cotizacion';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcesoCotizacionService {

  private baseUrl = environment.apiMongo + 'proceso-contizacion';
  private http = inject(HttpClient)

  crear(cotizacion:ProcesoCotizacion):Observable<ProcesoCotizacion>{
    return this.http.post<ProcesoCotizacion>(`${this.baseUrl}/crear`, cotizacion);
  }

  list(): Observable<ProcesoCotizacion[]>{
    return this.http.get<ProcesoCotizacion[]>(`${this.baseUrl}/list`);
  }

  getById(id: string):Observable<ProcesoCotizacion>{
    return this.http.get<ProcesoCotizacion>(`${this.baseUrl}/${id}`)
  }

}
