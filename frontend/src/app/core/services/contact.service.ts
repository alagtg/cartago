import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { ContactMessage } from '../models/site.models';
import { Observable, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  send(payload: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(`${API_BASE_URL}/contact-messages`, payload).pipe(timeout(12000));
  }

  getAdminAll(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${API_BASE_URL}/contact-messages/admin`);
  }

  getById(id: number): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${API_BASE_URL}/contact-messages/admin/${id}`);
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/contact-messages/admin/${id}/status`, { status });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/contact-messages/admin/${id}`);
  }
}
