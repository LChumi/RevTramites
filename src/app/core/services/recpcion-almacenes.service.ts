import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {ProductosPendientes} from '@dtos/recepcion-almacenes/productos-pendientes';
import {HttpClient} from '@angular/common/http';
import {ComprobantesCcoRequest} from '@dtos/recepcion-almacenes/comprobantes-cco-request';


@Injectable({
  providedIn: 'root'
})
export class RecpcionAlmacenesService {

  private baseUrl = `${environment.apiAssist}assist/recepcion`
  private http = inject(HttpClient);

  constructor() { }

  getComprobantesByEmpresa(empresa: number): Observable<ProductosPendientes>{
    return this.http.get<ProductosPendientes>(`${this.baseUrl}/recepcion/${empresa}/comprobantes`);
  }

  getListProductos(request: ComprobantesCcoRequest): Observable<ProductosPendientes[]>{
    return this.http.post<ProductosPendientes[]>(`${this.baseUrl}/recepcion/productos`, request)
  }



}
