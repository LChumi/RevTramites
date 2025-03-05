import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {ErrorResponse} from '@dtos/error-response';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.error(`HTTP Error: ${err}`);

      //Procesar el error y convertirlo como ErrorResponse
      const error: ErrorResponse ={
        status: err.status,
        message: err.error?.message || err.message || 'Error desconocido',
      }

      //Propaga el error a los suscriptores
      return throwError(() => error);

    })
  );
};
