import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProductoObservacion} from '@models/producto-observacion';
import {Observable} from 'rxjs';
import {CorreccionRequest} from '@dtos/correccion-request';

@Injectable({
  providedIn: 'root'
})
export class ProductoObservacionService {

  private baseUrl = environment.apiMongo;
  private http = inject(HttpClient);

  constructor() { }

  saveProduct(observacion: ProductoObservacion): Observable<ProductoObservacion> {
    return this.http.post<ProductoObservacion>(`${this.baseUrl}observacion/guardar`, observacion)
  }

  listObservaciones(bodega: any):Observable<ProductoObservacion[]> {
    return this.http.get<ProductoObservacion[]>(`${this.baseUrl}observacion/listar/${bodega}`)
  }

  addCorrecion(request: CorreccionRequest): Observable<ProductoObservacion>{
    return this.http.put<ProductoObservacion>(`${this.baseUrl}observacion/agregar-correccion`, request)
  }
}
