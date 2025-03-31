import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Revision} from '@models/revision';
import {RevisionRequest} from '@models/revision-request';

@Injectable({
  providedIn: 'root'
})
export class RevisionService {

  private baseUrl = environment.apiUrlBase + 'revision';
  private http = inject(HttpClient)

  constructor() {
  }

  findByTramite(tramiteId: string): Observable<Revision[]> {
    return this.http.get<Revision[]>(`${this.baseUrl}/tramiteId/${tramiteId}`);
  }

  getAll(): Observable<Revision[]> {
    return this.http.get<Revision[]>(`${this.baseUrl}/listar`);
  }

  update(id: string, data: Revision): Observable<Revision> {
    return this.http.put<Revision>(`${this.baseUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  updateQuantities(tramiteId: string, containerId: string): Observable<Revision[]> {
    return this.http.put<Revision[]>(`${this.baseUrl}/updateQuantities/${tramiteId}/${containerId}`, {});
  }

  updateQuantity(request: RevisionRequest): Observable<Revision> {
    return this.http.put<Revision>(`${this.baseUrl}/updateQuantity`, request);
  }

  validate(tramiteId: string): Observable<Revision[]> {
    return this.http.get<Revision[]>(`${this.baseUrl}/validate/${tramiteId}`);
  }
}
