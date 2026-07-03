import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { ClubRequest } from '../models/site.models';
import { Observable, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClubRequestService {
  private http = inject(HttpClient);

  create(payload: Omit<ClubRequest, 'id' | 'createdAt' | 'status' | 'adminNote'>): Observable<ClubRequest> {
    return this.http.post<ClubRequest>(`${API_BASE_URL}/club-requests`, payload).pipe(timeout(12000));
  }

  getAdminAll(): Observable<ClubRequest[]> { return this.http.get<ClubRequest[]>(`${API_BASE_URL}/club-requests/admin`); }
  getById(id: number): Observable<ClubRequest> { return this.http.get<ClubRequest>(`${API_BASE_URL}/club-requests/admin/${id}`); }
  updateStatus(id: number, status: string, adminNote: string): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/club-requests/admin/${id}/status`, { status, adminNote });
  }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${API_BASE_URL}/club-requests/admin/${id}`); }
}
