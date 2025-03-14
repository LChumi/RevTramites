import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Emails} from '@models/emails';
import {Destinatario} from '@models/destinatario';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  private baseUrl = environment.apiUrlBase + 'email';
  private http = inject(HttpClient)

  constructor() { }

  getByTipo(tipo: number): Observable<Emails> {
    return this.http.get<Emails>(`${this.baseUrl}/tipo/${tipo}`);
  }

  save(email: Emails): Observable<Emails> {
    return this.http.post<Emails>(`${this.baseUrl}/save`, email);
  }

  addAddressee(tipo: number, addressee: Destinatario): Observable<Emails> {
    return this.http.put<Emails>(`${this.baseUrl}/add/addressee/${tipo}`, addressee);
  }

  removeAddressee(tipo:number, addresse: string): Observable<Emails> {
    return this.http.delete<Emails>(`${this.baseUrl}/remove/${tipo}/${addresse}`);
  }
}
