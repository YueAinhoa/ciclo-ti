
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // Ruta pública: inicio de sesión.
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },

  // Rutas privadas: panel administrativo.
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),

    canActivate: [authGuard],

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },

      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/roles/roles').then(m => m.Roles)
      },

      {
        path: 'areas',
        loadComponent: () =>
          import('./pages/areas/areas').then(m => m.Areas)
      },

      {
        path: 'perfiles-puesto',
        loadComponent: () =>
          import('./pages/perfiles-puesto/perfiles-puesto').then(m => m.PerfilesPuesto)
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios').then(m => m.Usuarios)
      },

      {
        path: 'tipos-equipo',
        loadComponent: () =>
          import('./pages/tipos-equipo/tipos-equipo').then(m => m.TiposEquipo)
      },

      {
        path: 'equipos',
        loadComponent: () =>
          import('./pages/equipos/equipos').then(m => m.Equipos)
      },

      {
        path: 'asignaciones',
        loadComponent: () =>
          import('./pages/asignaciones/asignaciones').then(m => m.Asignaciones)
      }

    ]
  },

  // Cualquier ruta desconocida vuelve al login.
  {
    path: '**',
    redirectTo: 'login'
  }

];
