import {CanActivateFn, Router} from '@angular/router';
import {inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {

  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return router.createUrlTree(['/auth']);
  }

  const username = sessionStorage.getItem('username');

  if (username) {
    return true;
  }

  return router.createUrlTree(['/auth']);
};
