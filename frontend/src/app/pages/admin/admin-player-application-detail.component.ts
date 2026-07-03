import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlayerApplicationService } from '../../core/services/player-application.service';
import { PlayerApplication } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="page-head">
    <div><div class="badge">Player Application Detail</div><h2 class="section-title">{{ application?.fullName }}</h2></div>
    <div class="toolbar">
      <a routerLink="/admin/player-applications" class="btn btn-secondary">Back</a>
      <button class="btn btn-danger" (click)="remove()">Delete</button>
    </div>
  </div>

  <div class="card" style="padding:24px;" *ngIf="application">
    <div class="form-grid">
      <div class="card" style="padding:16px;"><b>Nationality</b><div class="muted">{{ application.nationality }}</div></div>
      <div class="card" style="padding:16px;"><b>Position</b><div class="muted">{{ application.position }}</div></div>
      <div class="card" style="padding:16px;"><b>Current Club</b><div class="muted">{{ application.currentClub }}</div></div>
      <div class="card" style="padding:16px;"><b>Strong Foot</b><div class="muted">{{ application.strongFoot }}</div></div>
      <div class="card" style="padding:16px;"><b>Email</b><div class="muted">{{ application.email }}</div></div>
      <div class="card" style="padding:16px;"><b>Phone</b><div class="muted">{{ application.phoneNumber }}</div></div>
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

    <div style="margin-top:16px;" *ngIf="application.videoLink">
      <a class="btn btn-secondary" [href]="application.videoLink" target="_blank">Open Video Link</a>
    </div>

    <div style="margin-top:20px;">
      <button class="btn btn-primary" (click)="save()">Save Status</button>
    </div>
  </div>
  `
})
export class AdminPlayerApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(PlayerApplicationService);
  private router = inject(Router);
  id = 0;
  application?: PlayerApplication;
  status = 'New';
  adminNote = '';

  ngOnInit(): void {
    this.id = +(this.route.snapshot.paramMap.get('id') || 0);
    this.api.getById(this.id).subscribe((res) => {
      this.application = res;
      this.status = res.status;
      this.adminNote = res.adminNote || '';
    });
  }

  save(): void {
    this.api.updateStatus(this.id, this.status, this.adminNote).subscribe(() => {
      this.api.getById(this.id).subscribe((res) => this.application = res);
    });
  }

  remove(): void {
    if (!confirm('Delete this application?')) return;
    this.api.remove(this.id).subscribe(() => this.router.navigateByUrl('/admin/player-applications'));
  }
}
