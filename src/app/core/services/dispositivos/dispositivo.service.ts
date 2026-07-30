import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Dispositivo } from '@models/dispositivos/dispositivo';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  private readonly api = `${environment.apiMongo}dispositivos`;
  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Dispositivo[]>(this.api);
  }

  findById(id: string) {
    return this.http.get<Dispositivo>(`${this.api}/${id}`);
  }

  disponibles(marca?: string) {
    const params: Record<string, string> = {};

    if (marca) {
      params['marca'] = marca;
    }

    return this.http.get<Dispositivo[]>(`${this.api}/disponibles`, {params});
  }

  registrar(dispositivo: Dispositivo) {
    return this.http.post<Dispositivo>(this.api, dispositivo);
  }

  cambiarEstado(id: string, estado: string) {
    return this.http.patch<Dispositivo>(`${this.api}/${id}/estado`, null, {params: { estado }}
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  actualizar(id: string, dispositivo: Dispositivo): Observable<Dispositivo> {
    return this.http.put<Dispositivo>(`${this.api}/${id}/actualizar`, dispositivo);
  }

}
