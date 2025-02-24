import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const username = sessionStorage.getItem("username");
  if (username) {
    return true;
  }else{
    const router = inject(Router)
    router.navigate(['/icep/auth']).then(r => {});
  }
  return true;
};
