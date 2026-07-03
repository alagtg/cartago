import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerApplicationService } from '../../core/services/player-application.service';
import { PlayerApplication } from '../../core/models/site.models';

@Component({
  selector: 'app-admin-player-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  host: { 'data-page': 'admin-player-applications' },
  template: `
  <div class="page-head">
    <div><div class="badge">{{ 'ADMIN.PLAYER_APPLICATIONS' | translate }}</div><h2 class="section-title">{{ 'ADMIN.RECEIVED_PLAYER_CONTACTS' | translate }}</h2></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>{{ 'ADMIN.PLAYER' | translate }}</th><th>{{ 'ADMIN.NATIONALITY' | translate }}</th><th>{{ 'ADMIN.POSITION' | translate }}</th><th>{{ 'ADMIN.CURRENT_CLUB' | translate }}</th><th>{{ 'ADMIN.STATUS' | translate }}</th><th>{{ 'ADMIN.ACTION' | translate }}</th></tr></thead>
      <tbody>
        <tr *ngFor="let item of applications">
          <td>{{ item.fullName }}</td>
          <td>{{ item.nationality }}</td>
          <td>{{ item.position }}</td>
          <td>{{ item.currentClub }}</td>
          <td><span class="status" [class.status-new]="item.status === 'New'" [class.status-progress]="item.status === 'In Progress'" [class.status-processed]="item.status === 'Processed'">{{ item.status }}</span></td>
          <td><a class="btn btn-secondary" [routerLink]="['/admin/player-applications', item.id]">{{ 'ADMIN.OPEN_DETAIL' | translate }}</a></td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AdminPlayerApplicationsComponent implements OnInit {
  private api = inject(PlayerApplicationService);
  applications: PlayerApplication[] = [];
  ngOnInit(): void { this.api.getAdminAll().subscribe((res) => this.applications = res); }
}
