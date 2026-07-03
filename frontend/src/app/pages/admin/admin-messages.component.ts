import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/site.models';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-head">
    <div><div class="badge">Contact Messages</div><h2 class="section-title">Manage public contact messages</h2></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        <tr *ngFor="let item of messages">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.subject }}</td>
          <td><span class="status" [class.status-read]="item.status === 'Read'" [class.status-unread]="item.status !== 'Read'">{{ item.status }}</span></td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/messages', item.id]">Open</a>
              <button class="btn btn-secondary" *ngIf="item.status !== 'Read'" (click)="markRead(item.id)">Mark Read</button>
              <button class="btn btn-danger" (click)="remove(item.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AdminMessagesComponent implements OnInit {
  private api = inject(ContactService);
  messages: ContactMessage[] = [];
  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getAdminAll().subscribe((res) => this.messages = res);
  }

  markRead(id: number): void {
    this.api.updateStatus(id, 'Read').subscribe(() => this.load());
  }

  remove(id: number): void {
    if (!confirm('Delete this message?')) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
