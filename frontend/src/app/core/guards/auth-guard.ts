
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {

  const auth = inject(Auth);
  const router = inject(Router);

  // Comprobar si existe un token de acceso.
  if (auth.isAuthenticated()) {
    return true;
  }

  // Si no existe una sesión, enviar al login.
  return router.createUrlTree(['/login']);
};
