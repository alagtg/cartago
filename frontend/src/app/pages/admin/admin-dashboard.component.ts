import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player.service';
import { TeamService } from '../../core/services/team.service';
import { ContactService } from '../../core/services/contact.service';
import { ClubRequestService } from '../../core/services/club-request.service';
import { PlayerApplicationService } from '../../core/services/player-application.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
  <div class="page-head">
    <div>
      <div class="badge">{{ 'ADMIN.DASHBOARD' | translate }}</div>
      <h2 class="section-title">{{ 'ADMIN.OVERVIEW' | translate }}</h2>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="card kpi-card"><div class="kpi-label">{{ 'ADMIN.PLAYERS' | translate }}</div><div class="kpi-value">{{ playersCount }}</div></div>
    <div class="card kpi-card"><div class="kpi-label">{{ 'ADMIN.TEAM_MEMBERS' | translate }}</div><div class="kpi-value">{{ teamCount }}</div></div>
    <div class="card kpi-card"><div class="kpi-label">{{ 'ADMIN.CLUB_REQUESTS' | translate }}</div><div class="kpi-value">{{ clubCount }}</div></div>
    <div class="card kpi-card"><div class="kpi-label">{{ 'ADMIN.PLAYER_APPLICATIONS' | translate }}</div><div class="kpi-value">{{ applicationsCount }}</div></div>
  </div>

  <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:24px;">
    <div class="card" style="padding:22px;">
      <h3 style="margin-top:0;">{{ 'ADMIN.QUICK_LINKS' | translate }}</h3>
      <div class="grid">
        <a class="link" routerLink="/admin/players/new">{{ 'ADMIN.ADD_PLAYER' | translate }}</a>
        <a class="link" routerLink="/admin/team/new">{{ 'ADMIN.ADD_MEMBER' | translate }}</a>
        <a class="link" routerLink="/admin/services/new">{{ 'ADMIN.ADD_SERVICE' | translate }}</a>
        <a class="link" routerLink="/admin/settings">{{ 'ADMIN.EDIT_SETTINGS' | translate }}</a>
      </div>
    </div>

    <div class="card" style="padding:22px;">
      <h3 style="margin-top:0;">{{ 'ADMIN.LATEST_ACTIVITY' | translate }}</h3>
      <div class="muted">{{ 'ADMIN.MESSAGES_COUNT' | translate }}: {{ messagesCount }}</div>
      <div class="muted">{{ 'ADMIN.CLUB_REQUESTS_COUNT' | translate }}: {{ clubCount }}</div>
      <div class="muted">{{ 'ADMIN.APPLICATIONS_COUNT' | translate }}: {{ applicationsCount }}</div>
      <div class="muted">{{ 'ADMIN.PUBLIC_HINT' | translate }}</div>
    </div>
  </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private playersApi = inject(PlayerService);
  private teamApi = inject(TeamService);
  private contactsApi = inject(ContactService);
  private clubApi = inject(ClubRequestService);
  private applicationsApi = inject(PlayerApplicationService);

  playersCount = 0;
  teamCount = 0;
  messagesCount = 0;
  clubCount = 0;
  applicationsCount = 0;

  ngOnInit(): void {
    this.playersApi.getAdminAll().subscribe((res) => this.playersCount = res.length);
    this.teamApi.getAdminAll().subscribe((res) => this.teamCount = res.length);
    this.contactsApi.getAdminAll().subscribe((res) => this.messagesCount = res.length);
    this.clubApi.getAdminAll().subscribe((res) => this.clubCount = res.length);
    this.applicationsApi.getAdminAll().subscribe((res) => this.applicationsCount = res.length);
  }
}
