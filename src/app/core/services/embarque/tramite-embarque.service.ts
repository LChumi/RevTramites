import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TramiteEmbarque} from '@models/embarque/tramite-embarque';

@Injectable({
  providedIn: 'root'
})
export class TramiteEmbarqueService {

  private baseUrl = environment.apiMongo + 'tramite-embarque';
  private http = inject(HttpClient)

  list():Observable<TramiteEmbarque[]>{
    return this.http.get<TramiteEmbarque[]>(`${this.baseUrl}/list`);
  }

  crearDesdeFlete(flete:string, bl:string, proveedor:string):Observable<TramiteEmbarque>{
    return this.http.get<TramiteEmbarque>(`${this.baseUrl}/crear-desde-flete/${flete}/${bl}/${proveedor}`);
  }

  reemplazar(tramite:string, fleteNuevo: string):Observable<void>{
    return this.http.get<void>(`${this.baseUrl}/reemplazar/${tramite}/${fleteNuevo}`)
  }

  update(id:string , t:TramiteEmbarque):Observable<TramiteEmbarque>{
    return this.http.put<TramiteEmbarque>(`${this.baseUrl}/update/${id}`, t);
  }

}
