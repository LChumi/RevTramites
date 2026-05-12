import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, mapTo, Observable, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly baseUrl = `${environment.apiOracle}reports/report/pedido`;
  private readonly http = inject(HttpClient);

  getPdfReport(codigo: string): Observable<Blob> {
    return this.fetchBlob(`${this.baseUrl}/pdf?pedido=${codigo}`);
  }

  getExcelReport(codigo: string): Observable<Blob> {
    return this.fetchBlob(`${this.baseUrl}/excel?pedido=${codigo}`);
  }

  private fetchBlob(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.status === 0
      ? 'Error de red o CORS'
      : `Error ${error.status}: ${error.message}`;

    console.error('[ReportService]', message);
    return throwError(() => new Error(message));
  }

}
