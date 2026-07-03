import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { TeamService } from '../../core/services/team.service';
import { ContactService } from '../../core/services/contact.service';
import { ClubRequestService } from '../../core/services/club-request.service';
import { PlayerApplicationService } from '../../core/services/player-application.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-head">
    <div>
      <div class="badge">Dashboard</div>
      <h2 class="section-title">Admin overview</h2>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="card kpi-card"><div class="kpi-label">Players</div><div class="kpi-value">{{ playersCount }}</div></div>
    <div class="card kpi-card"><div class="kpi-label">Team Members</div><div class="kpi-value">{{ teamCount }}</div></div>
    <div class="card kpi-card"><div class="kpi-label">Club Requests</div><div class="kpi-value">{{ clubCount }}</div></div>
    <div class="card kpi-card"><div class="kpi-label">Player Applications</div><div class="kpi-value">{{ applicationsCount }}</div></div>
  </div>

  <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:24px;">
    <div class="card" style="padding:22px;">
      <h3 style="margin-top:0;">Quick Links</h3>
      <div class="grid">
        <a class="link" routerLink="/admin/players/new">Add player</a>
        <a class="link" routerLink="/admin/team/new">Add team member</a>
        <a class="link" routerLink="/admin/services/new">Add service</a>
        <a class="link" routerLink="/admin/settings">Edit site settings</a>
      </div>
    </div>

    <div class="card" style="padding:22px;">
      <h3 style="margin-top:0;">Latest activity</h3>
      <div class="muted">Messages: {{ messagesCount }}</div>
      <div class="muted">Club requests: {{ clubCount }}</div>
      <div class="muted">Player applications: {{ applicationsCount }}</div>
      <div class="muted">Public site remains accessible without login.</div>
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
