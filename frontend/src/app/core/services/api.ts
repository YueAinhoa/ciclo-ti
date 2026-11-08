
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private readonly baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  // Consultar todos los registros
  getAll<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}/`);
  }

  
    getFiltered<T>(endpoint: string, params: Record<string, string>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}/`, { params });
    }


  // Consultar un registro por su ID
  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}/${id}/`);
  }

  // Crear un registro
  create<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}/`, data);
  }

  // Actualizar un registro completo
  update<T>(endpoint: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}/${id}/`, data);
  }

  // Actualizar parcialmente un registro
  partialUpdate<T>(endpoint: string, id: number, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}/${id}/`, data);
  }

  // Eliminar un registro
  delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${endpoint}/${id}/`);
  }
}
