import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamService } from '../../core/services/team.service';
import { TeamMember } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
  <div class="page-head">
    <div><div class="badge">{{ 'ADMIN.TEAM' | translate }}</div><h2 class="section-title">{{ 'ADMIN.MANAGE_TEAM' | translate }}</h2></div>
    <a routerLink="/admin/team/new" class="btn btn-primary">{{ 'ADMIN.ADD_MEMBER_BUTTON' | translate }}</a>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>{{ 'ADMIN.NAME' | translate }}</th><th>{{ 'ADMIN.ROLE' | translate }}</th><th>{{ 'ADMIN.EMAIL' | translate }}</th><th>{{ 'ADMIN.PHONE' | translate }}</th><th>{{ 'ADMIN.ACTIONS' | translate }}</th></tr></thead>
      <tbody>
        <tr *ngFor="let member of team">
          <td>{{ member.fullName }}</td>
          <td>{{ member.role }}</td>
          <td>{{ member.email }}</td>
          <td>{{ member.phone }}</td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/team', member.id, 'edit']">{{ 'ADMIN.EDIT' | translate }}</a>
              <button class="btn btn-danger" (click)="remove(member.id)">{{ 'ADMIN.DELETE' | translate }}</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AdminTeamComponent implements OnInit {
  private api = inject(TeamService);
  private translate = inject(TranslateService);
  team: TeamMember[] = [];

  ngOnInit(): void { this.load(); }
  load(): void { this.api.getAdminAll().subscribe((res) => this.team = res); }
  remove(id: number): void {
    if (!confirm(this.translate.instant('ADMIN.DELETE_MEMBER_CONFIRM'))) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
