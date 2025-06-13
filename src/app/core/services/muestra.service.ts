import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '@models/producto';
import {MuestraRequest} from '@models/muestra-request';
import {ProductValidateRequest} from '@dtos/product-validate-request';

@Injectable({
  providedIn: 'root'
})
export class MuestraService {

  private baseUrl = environment.apiUrlBase + 'muestra';
  private http = inject(HttpClient)

  constructor() {
  }

  addCompare(request: MuestraRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/add/compare/`, request)
  }

  validate(tramite: string, contenedor: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/validate/${tramite}/${contenedor}`);
  }

  getMuestras(tramite: string, contenedor: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/${tramite}/${contenedor}`);
  }

  updateProductWithValidation(request: ProductValidateRequest): Observable<Producto>{
    return this.http.put<Producto>(`${this.baseUrl}/producto/validate`, request)
  }
}
