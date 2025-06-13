import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tramite} from '@models/tramite';
import {Producto} from '@models/producto';
import {StatusResponse} from '@dtos/status-response';
import {Contenedor} from '@models/contenedor';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {
  private baseUrl = environment.apiUrlBase + 'tramite';
  private http = inject(HttpClient)

  constructor() {
  }

  findById(tramiteId: string): Observable<Tramite> {
    return this.http.get<Tramite>(`${this.baseUrl}/findId/${tramiteId}`);
  }

  productos(tramiteId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/${tramiteId}/products`);
  }

  lockUnlockContainer(tramite: string, contenedor: string, usr: string): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.baseUrl}/lock-unlock/container/${tramite}/${contenedor}/${usr}`)
  }

  listByStatus(status: number): Observable<Tramite[]> {
    return this.http.get<Tramite[]>(`${this.baseUrl}/status/${status}`);
  }

  buscar(
    id?: string,
    estado?: number,
    fechaInicio?: string,
    fechaFin?: string
  ): Observable<Tramite[]> {
    let params = new HttpParams();
    if (id) params = params.set('id', id);
    if (estado) params = params.set('estado', estado);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    return this.http.get<Tramite[]>(`${this.baseUrl}/filtros`, {params});
  }

  updateDate(fechaArribo: any, horaArribo: any, tramiteId: string){
    let params = new HttpParams();
    params = params.set('fechaArribo', fechaArribo);
    params = params.set('horaArribo', horaArribo);
    params = params.set('id', tramiteId);
    return this.http.get<StatusResponse>(`${this.baseUrl}/update/date`, {params})
  }

  getContenedor(tramiteId: string, contenedorId: string): Observable<Contenedor> {
    return this.http.get<Contenedor>(`${this.baseUrl}/contenedor/${tramiteId}/${contenedorId}`);
  }

  getTramiestWeek(): Observable<Tramite[]>{
    return this.http.get<Tramite[]>(`${this.baseUrl}/week`);
  }

  getTotal(tramite: string, contenedor: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total/package/${tramite}/${contenedor}`)
  }

  getPercentage(tramite: string, contenedor: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/percentage/package/${tramite}/${contenedor}`)
  }

  getTramiestMonth(): Observable<Tramite[]>{
    return this.http.get<Tramite[]>(`${this.baseUrl}/month`);
  }
}
