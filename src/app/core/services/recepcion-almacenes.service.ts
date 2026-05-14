import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {ProductosPendientes} from '@dtos/recepcion-almacenes/productos-pendientes';
import {HttpClient} from '@angular/common/http';
import {ComprobantesCcoRequest} from '@dtos/recepcion-almacenes/comprobantes-cco-request';
import {Comprobantes} from '@dtos/recepcion-almacenes/comprobantes';


@Injectable({
  providedIn: 'root'
})
export class RecepcionAlmacenesService {

  private baseUrl = `${environment.apiAssist}assist`
  private http = inject(HttpClient);

  constructor() { }

  getComprobantesByEmpresa(empresa: number): Observable<Comprobantes[]>{
    return this.http.get<Comprobantes[]>(`${this.baseUrl}/recepcion/${empresa}/empresa`);
  }

  getComprobantesByBodega(bodega: number): Observable<Comprobantes[]>{
    return this.http.get<Comprobantes[]>(`${this.baseUrl}/recepcion/${bodega}/bodega`);
  }

  getListProductos(request: ComprobantesCcoRequest): Observable<ProductosPendientes[]>{
    return this.http.post<ProductosPendientes[]>(`${this.baseUrl}/recepcion/crear-revision`, request)
  }

}
