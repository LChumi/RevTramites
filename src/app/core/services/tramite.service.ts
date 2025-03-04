import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tramite} from '@models/tramite';
import {Producto} from '@models/producto';
import {StatusResponse} from '@dtos/status-response';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {
  private baseUrl = environment.apiUrlBase + 'tramite';
  private http = inject(HttpClient)

  constructor() {
  }

  getAll(): Observable<Tramite[]> {
    return this.http.get<Tramite[]>(`${this.baseUrl}/All`);
  }

  findById(tramiteId: string): Observable<Tramite> {
    return this.http.get<Tramite>(`${this.baseUrl}/findId/${tramiteId}`);
  }

  update(tramiteId: string, tramite: Tramite): Observable<Tramite> {
    return this.http.put<Tramite>(`${this.baseUrl}/update/${tramiteId}`, JSON.stringify(tramite));
  }

  delete(tramiteId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${tramiteId}`);
  }

  productos(tramiteId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/${tramiteId}/products`);
  }

  pending(): Observable<Tramite[]> {
    return this.http.get<Tramite[]>(`${this.baseUrl}/pending`);
  }

  complete(): Observable<Tramite[]> {
    return this.http.get<Tramite[]>(`${this.baseUrl}/completed`);
  }

  lockUnlockContainer(tramite: string, contenedor: string, usr: string): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.baseUrl}/lock-unlock/container/${tramite}/${contenedor}/${usr}`)
  }
}
