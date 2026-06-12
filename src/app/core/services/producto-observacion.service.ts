import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProductoObservacion} from '@models/producto-observacion';
import {Observable} from 'rxjs';
import {CorreccionRequest} from '@dtos/correccion-request';
import {
  DashboardResumen,
  ObservacionPorBodega,
  ObservacionPorMes, TopProducto
} from '@features/observacion-producto/dto/dashboard.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoObservacionService {

  private baseUrl = environment.apiMongo;
  private http = inject(HttpClient);

  constructor() {
  }

  saveProduct(observacion: ProductoObservacion): Observable<ProductoObservacion> {
    return this.http.post<ProductoObservacion>(`${this.baseUrl}observacion/guardar`, observacion)
  }

  listObservaciones(bodega: any): Observable<ProductoObservacion[]> {
    return this.http.get<ProductoObservacion[]>(`${this.baseUrl}observacion/listar/${bodega}`)
  }

  addCorrecion(request: CorreccionRequest): Observable<ProductoObservacion> {
    return this.http.put<ProductoObservacion>(`${this.baseUrl}observacion/agregar-correccion`, request)
  }

  getResumen(bodega: number): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(`${this.baseUrl}observacion/dashboard/resumen`, {
      params: {bodega}
    });
  }

  getPorBodega(): Observable<ObservacionPorBodega[]> {
    return this.http.get<ObservacionPorBodega[]>(`${this.baseUrl}observacion/dashboard/por-bodega`);
  }

  getPorMes(bodega: number, anio: number = 2026): Observable<ObservacionPorMes[]> {
    return this.http.get<ObservacionPorMes[]>(`${this.baseUrl}observacion/dashboard/por-mes`, {
      params: {bodega, anio}
    });
  }

  getTopProductos(bodega: number, limite: number = 10): Observable<TopProducto[]> {
    return this.http.get<TopProducto[]>(`${this.baseUrl}observacion/dashboard/top-productos`, {
      params: {bodega, limite}
    });
  }
}
