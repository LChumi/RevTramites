import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Creposicion, CreposicionID} from '@dtos/creposicion';

@Injectable({
  providedIn: 'root'
})
export class CreposicionService {

  private baseUrl = `${environment.apiAssist}models/creposicion`
  private http = inject(HttpClient)

  getCreposicionByUser(tipo: number, usuario:string, finalizado: number): Observable<Creposicion[]>{
    return this.http.get<Creposicion[]>(`${this.baseUrl}/list-user/${tipo}/${usuario}/${finalizado}`)
  }

  getById(id: CreposicionID):Observable<Creposicion>{
    return this.http.post<Creposicion>(`${this.baseUrl}/get-by-id`, id)
  }
}
