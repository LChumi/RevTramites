import {inject, Injectable} from '@angular/core';
import {SalidaBuque} from '@models/embarque/salida-buque';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {OpcionBarataResponse} from '@models/embarque/opcion-barata-response';
import {CotizacionConsignatario} from '@models/embarque/cotizacion-consignatario';
import {OpcionFlete} from '@models/embarque/opcion-flete';

@Injectable({
  providedIn: 'root'
})
export class SalidaBuqueService {

  private baseUrl = environment.apiMongo + 'salida-buque';
  private http = inject(HttpClient)

  save(buque: SalidaBuque):Observable<SalidaBuque>{
    return this.http.post<SalidaBuque>(`${this.baseUrl}/save`, buque);
  }

  listByProcesoCotizacion(idCotizacionConsignatario: string): Observable<SalidaBuque[]>{
    return this.http.get<SalidaBuque[]>(`${this.baseUrl}/list-by-cotizacion/${idCotizacionConsignatario}`);
  }

  updateBuque(id: string, buque: SalidaBuque): Observable<SalidaBuque>{
    return this.http.put<SalidaBuque>(`${this.baseUrl}/update-buque/${id}`, buque);
  }

  bestOption(procesoCotizacionId: string): Observable<OpcionBarataResponse>{
    return this.http.get<OpcionBarataResponse>(`${this.baseUrl}/mejor-opcion/${procesoCotizacionId}`);
  }

  addOpcion(idBuque: string, idCotizacionConsignatario: string , opcion: OpcionFlete): Observable<SalidaBuque>{
    return this.http.put<SalidaBuque>(`${this.baseUrl}/add-opcion/${idBuque}/${idCotizacionConsignatario}`, opcion);
  }

  actualizarOpcion(idBuque: string, idCotizacionConsignatario: string , idOpcion: string, opcion:OpcionFlete): Observable<SalidaBuque>{
    return this.http.put<SalidaBuque>(`${this.baseUrl}/${idBuque}/cotizaciones/${idCotizacionConsignatario}/opciones/${idOpcion}`, opcion);
  }

  eliminarOpcion(idBuque: string, idCotizacionConsignatario: string , idOpcion: string): Observable<SalidaBuque>{
    return this.http.delete<SalidaBuque>(`${this.baseUrl}/${idBuque}/cotizaciones/${idCotizacionConsignatario}/opciones/${idOpcion}`);
  }

}
