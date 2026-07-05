import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/site.models';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
  <div class="page-head">
    <div><div class="badge">{{ 'ADMIN.MESSAGES' | translate }}</div><h2 class="section-title">{{ 'ADMIN.MANAGE_MESSAGES' | translate }}</h2></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>{{ 'ADMIN.NAME' | translate }}</th><th>{{ 'ADMIN.EMAIL' | translate }}</th><th>{{ 'ADMIN.SUBJECT' | translate }}</th><th>{{ 'ADMIN.STATUS' | translate }}</th><th>{{ 'ADMIN.ACTIONS' | translate }}</th></tr></thead>
      <tbody>
        <tr *ngFor="let item of pagedMessages">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.subject }}</td>
          <td><span class="status" [class.status-read]="item.status === 'Read'" [class.status-unread]="item.status !== 'Read'">{{ item.status }}</span></td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/messages', item.id]">{{ 'ADMIN.OPEN' | translate }}</a>
              <button class="btn btn-secondary" *ngIf="item.status !== 'Read'" (click)="markRead(item.id)">{{ 'ADMIN.MARK_READ' | translate }}</button>
              <button class="btn btn-danger" (click)="remove(item.id)">{{ 'ADMIN.DELETE' | translate }}</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pagination" *ngIf="totalPages > 1">
    <button (click)="page = page - 1" [disabled]="page === 1">‹</button>
    <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
    <button (click)="page = page + 1" [disabled]="page === totalPages">›</button>
  </div>
  `
})
export class AdminMessagesComponent implements OnInit {
  private api = inject(ContactService);
  private translate = inject(TranslateService);
  messages: ContactMessage[] = [];
  page = 1;
  pageSize = 10;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getAdminAll().subscribe((res) => {
      this.messages = res;
      this.page = 1;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.messages.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedMessages(): ContactMessage[] {
    if (this.page > this.totalPages) this.page = 1;
    const start = (this.page - 1) * this.pageSize;
    return this.messages.slice(start, start + this.pageSize);
  }

  markRead(id: number): void {
    this.api.updateStatus(id, 'Read').subscribe(() => this.load());
  }

  remove(id: number): void {
    if (!confirm(this.translate.instant('ADMIN.DELETE_MESSAGE_CONFIRM'))) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
