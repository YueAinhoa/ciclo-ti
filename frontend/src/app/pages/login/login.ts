
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth';
import { Api } from '../../core/services/api';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  correo = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private api: Api,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.correo || !this.password) {
      this.errorMessage = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.isLoading = true;

    // Primero comprobamos las credenciales.
    this.auth.login(this.correo, this.password).subscribe({

      next: () => {

        // Después comprobamos que el usuario sea Administrador TI.
        this.api.getAll<unknown>('usuarios').subscribe({

          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },

          error: (error) => {
            this.auth.logout();
            this.isLoading = false;

            if (error.status === 403) {
              this.errorMessage = 'No tienes permisos para acceder. Solo puede ingresar el Administrador TI.';
            } else {
              this.errorMessage = 'No se pudo verificar tu acceso. Intenta nuevamente.';
            }
          }

        });
      },

      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica que Django esté ejecutándose.';
        }
      }

    });
  }
}
