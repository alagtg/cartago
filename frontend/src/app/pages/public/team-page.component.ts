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
      <div class="badge">{{ 'TEAM.TITLE' | translate }}</div>
      <h1 class="section-title">{{ 'TEAM.PAGE_TITLE' | translate }}</h1>
      <p class="section-text">{{ 'TEAM.PAGE_TEXT' | translate }}</p>

      <div class="feature-grid" style="margin-top:26px;">
        <article class="card team-card" *ngFor="let member of pagedTeam">
          <img class="team-photo" [src]="member.photoUrl" [alt]="member.fullName">
          <div class="team-body">
            <h3 style="margin:0 0 8px;">{{ member.fullName }}</h3>
            <div class="badge">{{ member.role }}</div>
            <p class="section-text" style="margin-top:14px;">{{ member.bio }}</p>
            <div class="muted" style="margin-top:14px;">{{ member.email }} • {{ member.phone }}</div>
          </div>
        </article>
      </div>
      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="page = page - 1" [disabled]="page === 1">‹</button>
        <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
        <button (click)="page = page + 1" [disabled]="page === totalPages">›</button>
      </div>
    </div>
  </section>
  `
})
export class TeamPageComponent implements OnInit {
  private api = inject(TeamService);
  team: TeamMember[] = [];
  page = 1;
  pageSize = 6;

  ngOnInit(): void {
    this.api.getAll().subscribe((res) => {
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
}
