import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Player } from '../models/site.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private http = inject(HttpClient);

  getAll(): Observable<Player[]> { return this.http.get<Player[]>(`${API_BASE_URL}/players`); }
  getFeatured(): Observable<Player[]> { return this.http.get<Player[]>(`${API_BASE_URL}/players/featured`); }
  getBySlug(slug: string): Observable<Player> { return this.http.get<Player>(`${API_BASE_URL}/players/${slug}`); }
  getAdminAll(): Observable<Player[]> { return this.http.get<Player[]>(`${API_BASE_URL}/players/admin`); }
  getById(id: number): Observable<Player> { return this.http.get<Player>(`${API_BASE_URL}/players/admin/${id}`); }
  create(payload: Player): Observable<Player> { return this.http.post<Player>(`${API_BASE_URL}/players/admin`, payload); }
  update(id: number, payload: Player): Observable<void> { return this.http.put<void>(`${API_BASE_URL}/players/admin/${id}`, payload); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${API_BASE_URL}/players/admin/${id}`); }
}
