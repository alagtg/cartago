import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TeamService } from '../../core/services/team.service';
import { TeamMember } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">{{ 'TEAM.CONTACTS_BADGE' | translate }}</div>
      <h1 class="section-title">{{ 'TEAM.CONTACTS_TITLE' | translate }}</h1>
      <p class="section-text">{{ 'TEAM.CONTACTS_TEXT' | translate }}</p>

      <div class="feature-grid" style="margin-top:26px;">
        <article class="card team-card" *ngFor="let member of team">
          <img class="team-photo" [src]="member.photoUrl" [alt]="member.fullName">
          <div class="team-body">
            <h3 style="margin:0 0 8px;">{{ member.fullName }}</h3>
            <div class="badge">{{ member.role }}</div>
            <p class="section-text" style="margin-top:14px;">{{ member.bio }}</p>
            <div style="margin-top:16px;" class="muted">
              <div>{{ member.email }}</div>
              <div>{{ member.phone }}</div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
  `
})
export class TeamContactsComponent implements OnInit {
  private api = inject(TeamService);
  team: TeamMember[] = [];

  ngOnInit(): void {
    this.api.getContacts().subscribe((res) => this.team = res);
  }
}
