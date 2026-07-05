import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../core/models/site.models';
import { PlayerReportService } from '../../core/services/player-report.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
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
                <div class="badge">{{ 'PLAYERS.PROFILE' | translate }}</div>
                <div class="muted" style="margin-top:8px;">{{ 'PLAYERS.AUTO_PROFILE' | translate }}</div>
              </div>
            </div>
            <h1 class="section-title" style="margin-top:18px;">{{ player.fullName }}</h1>
            <p class="section-text" style="font-size:1.1rem;max-width:none;">{{ player.position }} • {{ player.nationality }} • {{ player.currentClub }} • {{ player.contractStatus }}</p>

            <div class="player-cv-grid" style="margin-top:20px;">
              <div class="card stat-card">
                <div class="muted">{{ 'PLAYERS.STRONG_FOOT' | translate }}</div>
                <div class="stat-value">{{ player.strongFoot }}</div>
              </div>
              <div class="card stat-card">
                <div class="muted">{{ 'PLAYERS.HEIGHT_WEIGHT' | translate }}</div>
                <div class="stat-value">{{ player.height }} cm / {{ player.weight }} kg</div>
              </div>
              <div class="card stat-card">
                <div class="muted">{{ 'PLAYERS.MINUTES' | translate }}</div>
                <div class="stat-value">{{ player.minutesPlayed }}</div>
              </div>
            </div>

            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px;">
              <a href="/#players" class="btn btn-secondary">{{ 'PLAYERS.BACK_HOME' | translate }}</a>
              <button class="btn btn-primary" type="button" (click)="printTechnicalReport()">{{ 'PLAYERS.TECHNICAL_REPORT' | translate }}</button>
              <a class="btn btn-secondary" *ngIf="player.videoUrl" [href]="player.videoUrl" target="_blank">{{ 'PLAYERS.HIGHLIGHTS' | translate }}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="section" style="padding-top:26px;">
        <div class="player-cv-grid">
          <div class="card stat-card">
            <div class="muted">{{ 'PLAYERS.MATCHES' | translate }}</div>
            <div class="stat-value">{{ player.matchesPlayed }}</div>
          </div>
          <div class="card stat-card">
            <div class="muted">{{ 'PLAYERS.GOALS' | translate }}</div>
            <div class="stat-value">{{ player.goals }}</div>
          </div>
          <div class="card stat-card">
            <div class="muted">{{ 'PLAYERS.ASSISTS' | translate }}</div>
            <div class="stat-value">{{ player.assists }}</div>
          </div>
        </div>

        <div class="split" style="margin-top:24px;align-items:start;">
          <div class="card preview-card">
            <div class="badge">{{ 'PLAYERS.OVERVIEW' | translate }}</div>
            <h3 style="margin-top:16px;">{{ 'PLAYERS.CV_TITLE' | translate }}</h3>
            <p class="section-text">{{ 'PLAYERS.CV_TEXT' | translate }}</p>
            <div class="grid" style="margin-top:16px;grid-template-columns:repeat(2,minmax(0,1fr));">
              <div class="card stat-card"><b>{{ 'PLAYERS.DOB' | translate }}</b><div class="muted">{{ player.dateOfBirth | date:'longDate' }}</div></div>
              <div class="card stat-card"><b>{{ 'PLAYERS.NATIONALITY' | translate }}</b><div class="muted">{{ player.nationality }}</div></div>
              <div class="card stat-card"><b>{{ 'PLAYERS.CURRENT_CLUB' | translate }}</b><div class="muted">{{ player.currentClub }}</div></div>
              <div class="card stat-card"><b>{{ 'PLAYERS.CONTRACT' | translate }}</b><div class="muted">{{ player.contractStatus }}</div></div>
            </div>
          </div>

          <div class="card preview-card">
            <div class="badge">{{ 'PLAYERS.AGENCY_CONTACT' | translate }}</div>
            <h3 style="margin-top:16px;">{{ 'PLAYERS.NEED_DETAILS' | translate }}</h3>
            <p class="section-text">{{ 'PLAYERS.CONTACT_TEXT' | translate }}</p>
            <div class="grid" style="margin-top:16px;">
              <a class="btn btn-primary" href="/#contact">{{ 'PLAYERS.CONTACT_AGENCY' | translate }}</a>
              <a class="btn btn-secondary" routerLink="/apply/club">{{ 'ACTIONS.CLUB_REQUEST' | translate }}</a>
            </div>
          </div>
        </div>

        <div class="card preview-card" *ngIf="videoEmbedUrl" style="margin-top:24px;">
          <div class="badge">{{ 'PLAYERS.HIGHLIGHTS' | translate }}</div>
          <h3 style="margin-top:16px;">Video YouTube</h3>
          <div style="position:relative;width:100%;aspect-ratio:16 / 9;margin-top:16px;border-radius:18px;overflow:hidden;border:1px solid var(--line);background:#071427;">
            <iframe
              [src]="videoEmbedUrl"
              title="Player video"
              style="position:absolute;inset:0;width:100%;height:100%;border:0;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen>
            </iframe>
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
  private reports = inject(PlayerReportService);
  private sanitizer = inject(DomSanitizer);
  player?: Player;
  videoEmbedUrl?: SafeResourceUrl;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.getBySlug(slug).subscribe((res) => {
      this.player = res;
      const embedUrl = this.toYoutubeEmbedUrl(res.videoUrl);
      this.videoEmbedUrl = embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : undefined;
    });
  }

  printTechnicalReport(): void {
    if (this.player) this.reports.print(this.player);
  }

  private toYoutubeEmbedUrl(url?: string): string {
    if (!url) return '';

    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace('www.', '');

      if (host === 'youtu.be') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }

      if (host === 'youtube.com' || host === 'm.youtube.com') {
        if (parsed.pathname === '/watch') {
          const id = parsed.searchParams.get('v');
          return id ? `https://www.youtube.com/embed/${id}` : '';
        }

        const parts = parsed.pathname.split('/').filter(Boolean);
        if ((parts[0] === 'shorts' || parts[0] === 'embed') && parts[1]) {
          return `https://www.youtube.com/embed/${parts[1]}`;
        }
      }
    } catch {
      return '';
    }

    return '';
  }
}
