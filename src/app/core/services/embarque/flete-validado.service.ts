import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {FleteValidacionRequest} from '@models/embarque/flete-validacion-request';
import {Observable} from 'rxjs';
import {FleteValidado} from '@models/embarque/flete-validado';
import {FleteAnularRequest} from '@models/embarque/flete-anular-request';

@Injectable({
  providedIn: 'root'
})
export class FleteValidadoService {

  private baseUrl = environment.apiMongo + 'confiteria';
  private http = inject(HttpClient)

  validarFlete(request: FleteValidacionRequest):Observable<FleteValidado>{
    return this.http.post<FleteValidado>(`${this.baseUrl}/save`, request);
  }

  anularFlete(request: FleteAnularRequest): Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/anular`, request);
  }
}
