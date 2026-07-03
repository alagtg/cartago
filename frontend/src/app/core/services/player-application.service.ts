import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { PlayerApplication } from '../models/site.models';
import { Observable, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerApplicationService {
  private http = inject(HttpClient);

  create(payload: Omit<PlayerApplication, 'id' | 'createdAt' | 'status' | 'adminNote'>): Observable<PlayerApplication> {
    return this.http.post<PlayerApplication>(`${API_BASE_URL}/player-applications`, payload).pipe(timeout(12000));
  }

  getAdminAll(): Observable<PlayerApplication[]> {
    return this.http.get<PlayerApplication[]>(`${API_BASE_URL}/player-applications/admin`);
  }

  getById(id: number): Observable<PlayerApplication> {
    return this.http.get<PlayerApplication>(`${API_BASE_URL}/player-applications/admin/${id}`);
  }

  updateStatus(id: number, status: string, adminNote: string): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/player-applications/admin/${id}/status`, { status, adminNote });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/player-applications/admin/${id}`);
  }
}
