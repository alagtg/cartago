import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { SiteSetting } from '../models/site.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);

  getAll(): Observable<SiteSetting[]> { return this.http.get<SiteSetting[]>(`${API_BASE_URL}/settings`); }
  getAdminAll(): Observable<SiteSetting[]> { return this.http.get<SiteSetting[]>(`${API_BASE_URL}/settings/admin`); }
  saveAll(payload: SiteSetting[]): Observable<void> { return this.http.put<void>(`${API_BASE_URL}/settings/admin`, payload); }
}
