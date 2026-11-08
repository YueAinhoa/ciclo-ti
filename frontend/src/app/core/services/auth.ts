
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  // Iniciar sesión
  login(correo: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.apiUrl}token/`,
      { correo, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      })
    );
  }

  // Obtener el token de acceso
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Verificar si existe una sesión
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
