import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (_route, _state) => {

  const router = inject(Router);

  const username = sessionStorage.getItem('username');

  if (username) {
    return true;
  }

  return router.createUrlTree(['/auth']);
};
