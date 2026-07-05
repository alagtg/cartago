import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClubRequestService } from '../../core/services/club-request.service';
import { ClubRequest } from '../../core/models/site.models';

@Component({
  selector: 'app-admin-club-requests',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  host: { 'data-page': 'admin-club-requests' },
  template: `
  <div class="page-head">
    <div><div class="badge">{{ 'ADMIN.CLUB_REQUESTS' | translate }}</div><h2 class="section-title">{{ 'ADMIN.RECEIVED_CLUB_CONTACTS' | translate }}</h2></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>{{ 'ADMIN.CLUB' | translate }}</th><th>{{ 'ADMIN.COUNTRY' | translate }}</th><th>{{ 'ADMIN.MANAGER' | translate }}</th><th>{{ 'ADMIN.BUDGET' | translate }}</th><th>{{ 'ADMIN.STATUS' | translate }}</th><th>{{ 'ADMIN.ACTION' | translate }}</th></tr></thead>
      <tbody>
        <tr *ngFor="let item of pagedRequests">
          <td>{{ item.clubName }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.recruitmentManager }}</td>
          <td>{{ item.estimatedBudget }}</td>
          <td><span class="status" [class.status-new]="item.status === 'New'" [class.status-progress]="item.status === 'In Progress'" [class.status-processed]="item.status === 'Processed'">{{ item.status }}</span></td>
          <td><a class="btn btn-secondary" [routerLink]="['/admin/club-requests', item.id]">{{ 'ADMIN.OPEN_DETAIL' | translate }}</a></td>
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
export class AdminClubRequestsComponent implements OnInit {
  private api = inject(ClubRequestService);
  requests: ClubRequest[] = [];
  page = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.api.getAdminAll().subscribe((res) => {
      this.requests = res;
      this.page = 1;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.requests.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedRequests(): ClubRequest[] {
    if (this.page > this.totalPages) this.page = 1;
    const start = (this.page - 1) * this.pageSize;
    return this.requests.slice(start, start + this.pageSize);
  }
}
