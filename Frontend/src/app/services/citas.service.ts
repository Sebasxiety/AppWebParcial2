import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private apiUrl = 'https://localhost:7130/api/Citas';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  get(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  create(cita: Partial<Cita>): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita, this.httpOptions);
  }

  update(id: number, cita: Partial<Cita>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cita, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
}