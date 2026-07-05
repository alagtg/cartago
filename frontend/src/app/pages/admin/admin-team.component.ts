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
        <tr *ngFor="let member of pagedTeam">
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
  <div class="pagination" *ngIf="totalPages > 1">
    <button (click)="page = page - 1" [disabled]="page === 1">‹</button>
    <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
    <button (click)="page = page + 1" [disabled]="page === totalPages">›</button>
  </div>
  `
})
export class AdminTeamComponent implements OnInit {
  private api = inject(TeamService);
  private translate = inject(TranslateService);
  team: TeamMember[] = [];
  page = 1;
  pageSize = 10;

  ngOnInit(): void { this.load(); }
  load(): void {
    this.api.getAdminAll().subscribe((res) => {
      this.team = res;
      this.page = 1;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.team.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedTeam(): TeamMember[] {
    if (this.page > this.totalPages) this.page = 1;
    const start = (this.page - 1) * this.pageSize;
    return this.team.slice(start, start + this.pageSize);
  }

  remove(id: number): void {
    if (!confirm(this.translate.instant('ADMIN.DELETE_MEMBER_CONFIRM'))) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
