import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {ProductosPendientes} from '@dtos/recepcion-almacenes/productos-pendientes';
import {HttpClient} from '@angular/common/http';
import {ComprobantesCcoRequest} from '@dtos/recepcion-almacenes/comprobantes-cco-request';
import {Comprobantes} from '@dtos/recepcion-almacenes/comprobantes';
import {ServiceResponse} from '@dtos/service-response';


@Injectable({
  providedIn: 'root'
})
export class RecepcionAlmacenesService {

  private baseUrl = `${environment.apiAssist}assist`
  private http = inject(HttpClient);

  constructor() { }

  getComprobantesByEmpresaAndTipo(empresa: number, tipo:number): Observable<Comprobantes[]>{
    return this.http.get<Comprobantes[]>(`${this.baseUrl}/recepcion/${empresa}/empresa/${tipo}`);
  }

  getComprobantesByBodega(bodega: number): Observable<Comprobantes[]>{
    return this.http.get<Comprobantes[]>(`${this.baseUrl}/recepcion/${bodega}/bodega`);
  }

  initRevision(request: ComprobantesCcoRequest): Observable<ServiceResponse>{
    return this.http.post<ServiceResponse>(`${this.baseUrl}/recepcion/crear-revision`, request)
  }

}
