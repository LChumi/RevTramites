import {CanActivateFn, Router} from '@angular/router';
import {inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {

  const platformId = inject(PLATFORM_ID)
  if (isPlatformBrowser(platformId)){
    const username = sessionStorage.getItem("username");
    if (username) {
      return true;
    } else {
      const router = inject(Router)
      router.navigate(['/icep/auth']).then(r => {
      });
    }
    return true;
  } else {
    const router = inject(Router)
    router.navigate(['/icep/auth']).then(r => {
    });
    return false;
  }
};
