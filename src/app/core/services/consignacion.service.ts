import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import { ConsignacionRequest } from "@dtos/consignacion-request";
import {Observable} from 'rxjs';
import {ConsignacionResponse} from '@dtos/consignacion-response';

@Injectable({
  providedIn: 'root'
})
export class ConsignacionService {

  private baseUrl = environment.apiLogin + 'consignacion/';
  private http = inject(HttpClient);

  constructor() { }

  generarConsignacion(request: ConsignacionRequest): Observable<ConsignacionResponse> {
    return this.http.post<ConsignacionResponse>(`${this.baseUrl}generar`, request);
  }

}
