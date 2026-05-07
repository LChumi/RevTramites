import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {ProductoSis} from '@dtos/producto-sis';
import {HttpClient} from '@angular/common/http';
import {ConfiteriaRepor} from '@dtos/confiteria-repor';

@Injectable({
  providedIn: 'root'
})
export class ProductoSisService {

  private url = environment.apiLogin +'producto'
  private http = inject(HttpClient);

  constructor() { }

  getProducto(bodega:any,barraItem:any):Observable<ProductoSis>{
    const options ={
      params: { data:barraItem}
    };

    return this.http.get<ProductoSis>(`${this.url}/BuscarProducto/${bodega}`,options);
  }

  listaConfiteria(nombre: string): Observable<ConfiteriaRepor[]>{
    return this.http.get<ConfiteriaRepor[]>(`${this.url}/confiteria/${nombre}`);
  }
}
