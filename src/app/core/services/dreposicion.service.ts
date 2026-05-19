import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {Dreposicion} from '@dtos/dreposicion';
import {HttpClient} from '@angular/common/http';
import {RevisionProductoRequest} from '@dtos/revision-producto-request';

@Injectable({
  providedIn: 'root'
})
export class DreposicionService {

  private baseUrl = `${environment.apiAssist}models/dreposicion`
  private http = inject(HttpClient)

  getListaDreposicion(creposicion:number):Observable<Dreposicion[]>{
    return this.http.get<Dreposicion[]>(`${this.baseUrl}/get/${creposicion}`)
  }

  quantityAdded(revision: RevisionProductoRequest): Observable<Dreposicion>{
    return this.http.post<Dreposicion>(`${this.baseUrl}/getByBarra`, revision)
  }

}
