import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
}

export interface User {
  username: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7130/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay un token guardado al inicializar el servicio
    this.checkStoredToken();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = {
      Username: username,
      Password: password
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData, httpOptions)
      .pipe(
        tap(response => {
          // Guardar el token y la información del usuario
          this.storeUserData(response.token, username);
        })
      );
  }

  logout(): void {
    // Limpiar el almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiration');
    
    // Actualizar el estado del usuario actual
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (!token || !expiration) {
      return false;
    }

    // Verificar si el token no ha expirado
    const expirationDate = new Date(expiration);
    const currentDate = new Date();
    
    if (currentDate >= expirationDate) {
      this.logout(); // Token expirado, hacer logout automático
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeUserData(token: string, username: string): void {
    // Decodificar el token JWT para obtener información adicional
    const payload = this.decodeToken(token);
    
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', payload.role || '');
    localStorage.setItem('tokenExpiration', payload.exp ? new Date(payload.exp * 1000).toISOString() : '');

    // Actualizar el usuario actual
    const user: User = {
      username: username,
      role: payload.role || '',
      token: token
    };
    
    this.currentUserSubject.next(user);
  }

  private checkStoredToken(): void {
    if (this.isAuthenticated()) {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');

      if (username && token) {
        const user: User = {
          username: username,
          role: role || '',
          token: token
        };
        this.currentUserSubject.next(user);
      }
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      return {};
    }
  }
}