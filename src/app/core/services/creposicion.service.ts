import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Creposicion, CreposicionID} from '@dtos/creposicion';
import {ValidarRecepcionResult} from '@dtos/recepcion-almacenes/validar-recepcion-result';

@Injectable({
  providedIn: 'root'
})
export class CreposicionService {

  private baseUrl = `${environment.apiAssist}models/creposicion`
  private baseOracle = `${environment.apiOracle}`
  private http = inject(HttpClient)

  getCreposicionByUser(tipo: number, usuario: string, finalizado: number): Observable<Creposicion[]> {
    return this.http.get<Creposicion[]>(`${this.baseUrl}/list-user/${tipo}/${usuario}/${finalizado}`)
  }

  getById(id: CreposicionID): Observable<Creposicion> {
    return this.http.post<Creposicion>(`${this.baseUrl}/get-by-id`, id)
  }

  updateRecepcionFinalizado(id: CreposicionID): Observable<Creposicion> {
    return this.http.put<Creposicion>(`${this.baseUrl}/revision-finalizado`, id)
  }

  listFinalizados(tipo: number, finalizado: number): Observable<Creposicion[]> {
    return this.http.get<Creposicion[]>(`${this.baseUrl}/list-finalizados/${tipo}/${finalizado}`)
  }

  validarRecepcion(empresa: number, creposicion: number): Observable<ValidarRecepcionResult>{
    return this.http.get<ValidarRecepcionResult>(`${this.baseOracle}/fuction/validar/recepcion/${empresa}/${creposicion}`)
  }

}
