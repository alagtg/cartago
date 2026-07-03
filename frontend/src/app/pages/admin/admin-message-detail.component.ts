import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-head">
    <div><div class="badge">Message Detail</div><h2 class="section-title">{{ message?.subject }}</h2></div>
    <div class="toolbar">
      <a routerLink="/admin/messages" class="btn btn-secondary">Back</a>
      <button class="btn btn-primary" (click)="markRead()" *ngIf="message?.status !== 'Read'">Mark as Read</button>
      <button class="btn btn-danger" (click)="remove()">Delete</button>
    </div>
  </div>

  <div class="card" style="padding:24px;" *ngIf="message">
    <div class="muted">{{ message.name }} • {{ message.email }}</div>
    <div class="muted" style="margin-top:8px;">{{ message.createdAt | date:'medium' }}</div>
    <div class="card" style="padding:18px;margin-top:18px;white-space:pre-wrap;">{{ message.message }}</div>
  </div>
  `
})
export class AdminMessageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ContactService);
  private router = inject(Router);
  message?: ContactMessage;
  id = 0;

  ngOnInit(): void {
    this.id = +(this.route.snapshot.paramMap.get('id') || 0);
    this.api.getById(this.id).subscribe((res) => this.message = res);
  }

  markRead(): void {
    this.api.updateStatus(this.id, 'Read').subscribe(() => this.api.getById(this.id).subscribe((res) => this.message = res));
  }

  remove(): void {
    if (!confirm('Delete this message?')) return;
    this.api.remove(this.id).subscribe(() => this.router.navigateByUrl('/admin/messages'));
  }
}
