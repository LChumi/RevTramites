import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RevisionRequest} from '@models/revision-request';
import {Producto} from '@models/producto';
import {Contenedor} from '@models/contenedor';

@Injectable({
  providedIn: 'root'
})
export class RevisionService {

  private baseUrl = environment.apiUrlBase + 'revision';
  private http = inject(HttpClient)

  constructor() {
  }

  findByTramite(tramiteId: string, contenedorId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/${tramiteId}/${contenedorId}`);
  }

  updateQuantities(tramiteId: string, containerId: string): Observable<Producto[]> {
    return this.http.put<Producto[]>(`${this.baseUrl}/updateQuantities/${tramiteId}/${containerId}`, {});
  }

  updateQuantity(request: RevisionRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/updateQuantity`, request);
  }

  validate(tramiteId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/validate/${tramiteId}`);
  }

  getContenedores(tramiteId: string): Observable<Contenedor[]> {
    return this.http.get<Contenedor[]>(`${this.baseUrl}/contenedores/${tramiteId}`);
  }
}
