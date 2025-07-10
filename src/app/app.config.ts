import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {provideAnimations} from '@angular/platform-browser/animations';
import {errorHandlerInterceptor} from '@interceptors/error-handler.interceptor';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(ToastModule),
    provideHttpClient(withFetch(), withInterceptors([errorHandlerInterceptor])),
    provideAnimations(),
    MessageService,
    ConfirmationService, provideClientHydration()
  ]
};
