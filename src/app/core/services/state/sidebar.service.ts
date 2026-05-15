import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private badgeValues = new BehaviorSubject({
    pendientes: 0,
    registrados: 0,
    finalizados: 0
  });

  badgeValues$ = this.badgeValues.asObservable();

  update(values: Partial<{ pendientes: number; registrados: number; finalizados: number }>){
    this.badgeValues.next({...this.badgeValues.value, ...values});
  }

}
