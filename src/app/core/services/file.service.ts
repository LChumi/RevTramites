import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tramite} from '@models/tramite';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = environment.apiUrlBase + 'file';
  private http = inject(HttpClient)

  constructor() {
  }

  sendExcel(file: File, fechaLlega: any, tramiteId: string, contenedorId: any): Observable<Tramite> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tramiteId', tramiteId);
    formData.append('contenedorId', contenedorId);
    formData.append('fechaLlegada', fechaLlega);

    return this.http.post<Tramite>(`${this.baseUrl}/excel/tramite`, formData, {})
  }

  sendTramite(tramiteId: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/send/tramite/${tramiteId}`, { responseType: 'text' })
  }
}
