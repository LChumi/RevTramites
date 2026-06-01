import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {PuertoEmbarque} from '@models/embarque/puerto-embarque';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuertoEmbarqueService {

  private baseUrl = environment.apiMongo + 'puerto-embarque';
  private http = inject(HttpClient)

  save(puerto: PuertoEmbarque):Observable<PuertoEmbarque>{
    return this.http.post<PuertoEmbarque>(`${this.baseUrl}/save`, puerto)
  }

  list():Observable<PuertoEmbarque[]>{
    return this.http.get<PuertoEmbarque[]>(`${this.baseUrl}/list`);
  }
}
