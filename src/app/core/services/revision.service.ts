import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RevisionRequest} from '@models/revision-request';
import {Producto} from '@models/producto';
import {Contenedor} from '@models/contenedor';
import {StatusResponse} from '@dtos/status-response';
import {ProductValidateRequest} from '@dtos/product-validate-request';
import {ProductoCantidad} from '@models/producto-cantidad';

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

  updateQuantity(request: RevisionRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/updateQuantity`, request);
  }

  processProductRevision(tramiteId: string, containerId : string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/tramite/${tramiteId}/contenedor/${containerId}/productos/revision`);
  }

  processTramiteCompletion(tramiteId: string, containerId:string): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.baseUrl}/tramite/${tramiteId}/contenedor/${containerId}/finalizar`);
  }

  getContenedores(tramiteId: string): Observable<Contenedor[]> {
    return this.http.get<Contenedor[]>(`${this.baseUrl}/contenedores/${tramiteId}`);
  }

  productExist(tramite: string, contenedor: string, barcode: string): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.baseUrl}/producto/existe/${barcode}/${tramite}/${contenedor}`);
  }

  updateProductWithValidation(request: ProductValidateRequest): Observable<Producto>{
    return this.http.put<Producto>(`${this.baseUrl}/producto/validate`, request)
  }

  getCantidades(tramite: string, contenedor: string, barcode: string): Observable<ProductoCantidad[]>{
    return this.http.get<ProductoCantidad[]>(`${this.baseUrl}/get-cantidades/${barcode}/${tramite}/${contenedor}`)
  }

}
