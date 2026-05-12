import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MenuItem} from '@dtos/menu-item';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = environment.apiMongo + 'menu';
  private http = inject(HttpClient)

  constructor() { }

  getMenu(userId: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}/get/${userId}/usuario`);
  }

}
