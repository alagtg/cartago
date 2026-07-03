import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { AgencyService } from '../models/site.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgencyServiceService {
  private http = inject(HttpClient);

  getAll(): Observable<AgencyService[]> { return this.http.get<AgencyService[]>(`${API_BASE_URL}/services`); }
  getAdminAll(): Observable<AgencyService[]> { return this.http.get<AgencyService[]>(`${API_BASE_URL}/services/admin`); }
  getById(id: number): Observable<AgencyService> { return this.http.get<AgencyService>(`${API_BASE_URL}/services/admin/${id}`); }
  create(payload: AgencyService): Observable<AgencyService> { return this.http.post<AgencyService>(`${API_BASE_URL}/services/admin`, payload); }
  update(id: number, payload: AgencyService): Observable<void> { return this.http.put<void>(`${API_BASE_URL}/services/admin/${id}`, payload); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${API_BASE_URL}/services/admin/${id}`); }
}
