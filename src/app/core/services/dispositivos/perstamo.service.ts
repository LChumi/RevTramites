import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Prestamo } from '@models/dispositivos/prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private readonly api = `${environment.apiMongo}prestamos`;
  private readonly http = inject(HttpClient);

  entregar(prestamo: Prestamo) {
    return this.http.post<Prestamo>(`${this.api}/entregar`, prestamo);
  }

  devolver(id: string, estadoFinal: string, observaciones?: string) {
    const params: Record<string, string> = {estadoFinal};

    if (observaciones) {
      params['observaciones'] = observaciones;
    }

    return this.http.patch<Prestamo>(`${this.api}/${id}/devolver`, null, {params});
  }

  activos() {
    return this.http.get<Prestamo[]>(`${this.api}/activos`);
  }

  ocupadoPor(dispositivoId: string) {
    return this.http.get<Prestamo>(`${this.api}/dispositivo/${dispositivoId}/ocupado`);
  }

  historial(serial: string) {
    return this.http.get<Prestamo[]>(`${this.api}/historial/${serial}`);
  }

  findById(id: string) {
    return this.http.get<Prestamo>(`${this.api}/${id}`);
  }

  findAll() {
    return this.http.get<Prestamo[]>(this.api);
  }

}
