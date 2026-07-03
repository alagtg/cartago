import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { TeamMember } from '../models/site.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private http = inject(HttpClient);

  getAll(): Observable<TeamMember[]> { return this.http.get<TeamMember[]>(`${API_BASE_URL}/team`); }
  getContacts(): Observable<TeamMember[]> { return this.http.get<TeamMember[]>(`${API_BASE_URL}/team/contacts`); }
  getAdminAll(): Observable<TeamMember[]> { return this.http.get<TeamMember[]>(`${API_BASE_URL}/team/admin`); }
  getById(id: number): Observable<TeamMember> { return this.http.get<TeamMember>(`${API_BASE_URL}/team/admin/${id}`); }
  create(payload: TeamMember): Observable<TeamMember> { return this.http.post<TeamMember>(`${API_BASE_URL}/team/admin`, payload); }
  update(id: number, payload: TeamMember): Observable<void> { return this.http.put<void>(`${API_BASE_URL}/team/admin/${id}`, payload); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${API_BASE_URL}/team/admin/${id}`); }
}
