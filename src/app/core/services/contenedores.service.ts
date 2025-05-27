import {inject, Injectable} from '@angular/core';
import {RevisionService} from '@services/revision.service';
import {MessageService} from 'primeng/api';
import {catchError, Observable, throwError} from 'rxjs';
import {Contenedor} from '@models/contenedor';

@Injectable({
  providedIn: 'root'
})
export class ContenedoresService {

  private revisionService = inject(RevisionService)
  private messageService= inject(MessageService)

  constructor() { }

  buscarContenedores(tramite: string): Observable<Contenedor[]>{
    return this.revisionService.getContenedores(tramite).pipe(
      catchError(err => {
        this.messageService.add({severity:'error', summary:'Ocurrio un problema', detail: err.message})
        return throwError(() => err);
      })
    );
  }
}
