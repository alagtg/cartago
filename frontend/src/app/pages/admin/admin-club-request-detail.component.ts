import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClubRequestService } from '../../core/services/club-request.service';
import { ClubRequest } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="page-head">
    <div><div class="badge">Club Request Detail</div><h2 class="section-title">{{ request?.clubName }}</h2></div>
    <div class="toolbar">
      <a routerLink="/admin/club-requests" class="btn btn-secondary">Back</a>
      <button class="btn btn-danger" (click)="remove()">Delete</button>
    </div>
  </div>

  <div class="card" style="padding:24px;" *ngIf="request">
    <div class="form-grid">
      <div class="card" style="padding:16px;"><b>Country</b><div class="muted">{{ request.country }}</div></div>
      <div class="card" style="padding:16px;"><b>Manager</b><div class="muted">{{ request.recruitmentManager }}</div></div>
      <div class="card" style="padding:16px;"><b>Email</b><div class="muted">{{ request.email }}</div></div>
      <div class="card" style="padding:16px;"><b>Phone</b><div class="muted">{{ request.phoneNumber }}</div></div>
      <div class="card" style="padding:16px;"><b>Target</b><div class="muted">{{ request.targetProfile }}</div></div>
      <div class="card" style="padding:16px;"><b>Budget</b><div class="muted">{{ request.estimatedBudget }}</div></div>
    </div>

    <div style="margin-top:18px;">
      <label>Status</label>
      <select class="select" [(ngModel)]="status" style="max-width:240px;">
        <option>New</option>
        <option>In Progress</option>
        <option>Processed</option>
      </select>
    </div>

    <div style="margin-top:16px;">
      <label>Admin Note</label>
      <textarea class="textarea" [(ngModel)]="adminNote"></textarea>
    </div>

    <div style="margin-top:16px;">
      <label>Additional Details</label>
      <div class="card" style="padding:16px;white-space:pre-wrap;">{{ request.additionalDetails || 'No extra details.' }}</div>
    </div>

    <div style="margin-top:20px;">
      <button class="btn btn-primary" (click)="save()">Save Status</button>
    </div>
  </div>
  `
})
export class AdminClubRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ClubRequestService);
  private router = inject(Router);
  id = 0;
  request?: ClubRequest;
  status = 'New';
  adminNote = '';

  ngOnInit(): void {
    this.id = +(this.route.snapshot.paramMap.get('id') || 0);
    this.api.getById(this.id).subscribe((res) => {
      this.request = res;
      this.status = res.status;
      this.adminNote = res.adminNote || '';
    });
  }

  save(): void {
    this.api.updateStatus(this.id, this.status, this.adminNote).subscribe(() => {
      this.api.getById(this.id).subscribe((res) => this.request = res);
    });
  }

  remove(): void {
    if (!confirm('Delete this request?')) return;
    this.api.remove(this.id).subscribe(() => this.router.navigateByUrl('/admin/club-requests'));
  }
}
