import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../core/services/team.service';
import { TeamMember } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">Our Team</div>
      <h1 class="section-title">Professional profiles with photos</h1>
      <p class="section-text">You asked for team photos, so the cards already include image zones that you can replace with real photos later.</p>

      <div class="feature-grid" style="margin-top:26px;">
        <article class="card team-card" *ngFor="let member of team">
          <img class="team-photo" [src]="member.photoUrl" [alt]="member.fullName">
          <div class="team-body">
            <h3 style="margin:0 0 8px;">{{ member.fullName }}</h3>
            <div class="badge">{{ member.role }}</div>
            <p class="section-text" style="margin-top:14px;">{{ member.bio }}</p>
            <div class="muted" style="margin-top:14px;">{{ member.email }} • {{ member.phone }}</div>
          </div>
        </article>
      </div>
    </div>
  </section>
  `
})
export class TeamPageComponent implements OnInit {
  private api = inject(TeamService);
  team: TeamMember[] = [];

  ngOnInit(): void {
    this.api.getAll().subscribe((res) => this.team = res);
  }
}
