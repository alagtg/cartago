import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../core/models/site.models';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="player-cv" *ngIf="player">
    <div class="container">
      <div class="card player-cv-header">
        <div class="player-cv-hero">
          <img class="player-cv-photo" [src]="player.photoUrl" [alt]="player.fullName">
          <div>
            <div class="player-cv-brand">
              <img src="/assets/brand/cartago-logo.png" alt="Cartago logo" style="width:78px;height:78px;border-radius:18px;background:rgba(17,34,65,.92);padding:10px;">
              <div>
                <div class="badge">Player Profile</div>
                <div class="muted" style="margin-top:8px;">Automatically generated from the latest profile data.</div>
              </div>
            </div>
            <h1 class="section-title" style="margin-top:18px;">{{ player.fullName }}</h1>
            <p class="section-text" style="font-size:1.1rem;max-width:none;">{{ player.position }} • {{ player.nationality }} • {{ player.currentClub }} • {{ player.contractStatus }}</p>

            <div class="player-cv-grid" style="margin-top:20px;">
              <div class="card stat-card">
                <div class="muted">Strong Foot</div>
                <div class="stat-value">{{ player.strongFoot }}</div>
              </div>
              <div class="card stat-card">
                <div class="muted">Height / Weight</div>
                <div class="stat-value">{{ player.height }} cm / {{ player.weight }} kg</div>
              </div>
              <div class="card stat-card">
                <div class="muted">Minutes Played</div>
                <div class="stat-value">{{ player.minutesPlayed }}</div>
              </div>
            </div>

            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px;">
              <a href="/#players" class="btn btn-secondary">Back to Home Players</a>
              <a class="btn btn-primary" *ngIf="player.technicalReportUrl" [href]="player.technicalReportUrl" target="_blank">Technical Report</a>
              <a class="btn btn-secondary" *ngIf="player.videoUrl" [href]="player.videoUrl" target="_blank">Highlights Video</a>
            </div>
          </div>
        </div>
      </div>

      <div class="section" style="padding-top:26px;">
        <div class="player-cv-grid">
          <div class="card stat-card">
            <div class="muted">Matches Played</div>
            <div class="stat-value">{{ player.matchesPlayed }}</div>
          </div>
          <div class="card stat-card">
            <div class="muted">Goals</div>
            <div class="stat-value">{{ player.goals }}</div>
          </div>
          <div class="card stat-card">
            <div class="muted">Assists</div>
            <div class="stat-value">{{ player.assists }}</div>
          </div>
        </div>

        <div class="split" style="margin-top:24px;align-items:start;">
          <div class="card preview-card">
            <div class="badge">Profile Overview</div>
            <h3 style="margin-top:16px;">Professional CV style presentation</h3>
            <p class="section-text">This page updates automatically with the player photo, club, logo, statistics and links you enter from the admin interface. It stays presentable even when the underlying data changes.</p>
            <div class="grid" style="margin-top:16px;grid-template-columns:repeat(2,minmax(0,1fr));">
              <div class="card stat-card"><b>Date of Birth</b><div class="muted">{{ player.dateOfBirth | date:'longDate' }}</div></div>
              <div class="card stat-card"><b>Nationality</b><div class="muted">{{ player.nationality }}</div></div>
              <div class="card stat-card"><b>Current Club</b><div class="muted">{{ player.currentClub }}</div></div>
              <div class="card stat-card"><b>Contract</b><div class="muted">{{ player.contractStatus }}</div></div>
            </div>
          </div>

          <div class="card preview-card">
            <div class="badge">Agency Contact</div>
            <h3 style="margin-top:16px;">Need more details?</h3>
            <p class="section-text">Cartago Football Agency can share scouting information, video analysis and technical follow-up based on the current player profile.</p>
            <div class="grid" style="margin-top:16px;">
              <a class="btn btn-primary" href="/#contact">Contact The Agency</a>
              <a class="btn btn-secondary" routerLink="/apply/club">Club Request</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `
})
export class PlayerDetailComponent implements OnInit {
  private api = inject(PlayerService);
  private route = inject(ActivatedRoute);
  player?: Player;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.getBySlug(slug).subscribe((res) => this.player = res);
  }
}
