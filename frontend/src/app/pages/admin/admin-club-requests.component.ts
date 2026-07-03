import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClubRequestService } from '../../core/services/club-request.service';
import { ClubRequest } from '../../core/models/site.models';

@Component({
  selector: 'app-admin-club-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  host: { 'data-page': 'admin-club-requests' },
  template: `
  <div class="page-head">
    <div><div class="badge">Club Requests</div><h2 class="section-title">Received club contacts</h2></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>Club</th><th>Country</th><th>Manager</th><th>Budget</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        <tr *ngFor="let item of requests">
          <td>{{ item.clubName }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.recruitmentManager }}</td>
          <td>{{ item.estimatedBudget }}</td>
          <td><span class="status" [class.status-new]="item.status === 'New'" [class.status-progress]="item.status === 'In Progress'" [class.status-processed]="item.status === 'Processed'">{{ item.status }}</span></td>
          <td><a class="btn btn-secondary" [routerLink]="['/admin/club-requests', item.id]">Open Detail</a></td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AdminClubRequestsComponent implements OnInit {
  private api = inject(ClubRequestService);
  requests: ClubRequest[] = [];
  ngOnInit(): void { this.api.getAdminAll().subscribe((res) => this.requests = res); }
}
