import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Player } from '../core/models/site.models';
import { AppIconComponent } from './app-icon.component';
import { PlayerReportService } from '../core/services/player-report.service';

@Component({
  selector: 'app-player-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent, TranslateModule],
  template: `
  <div class="modal-backdrop" *ngIf="player" (click)="onBackdrop($event)">
    <div class="modal-card">
      <button class="modal-close" (click)="close.emit()" aria-label="Close profile"><app-icon name="x"></app-icon></button>
      <div class="split" style="padding:24px;">
        <div>
          <img [src]="player?.photoUrl" [alt]="player?.fullName" style="width:100%;height:500px;object-fit:cover;border-radius:20px;">
        </div>
        <div>
          <div class="badge">{{ 'PLAYERS.VIEW_PROFILE' | translate }}</div>
          <h2 style="font-size:2.3rem;margin:12px 0 6px;">{{ player?.fullName }}</h2>
          <div class="muted" style="margin-bottom:18px;">{{ player?.position }} • {{ player?.nationality }} • {{ player?.currentClub }}</div>

          <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:20px;">
            <div class="card stat-card"><b>{{ 'PLAYERS.STRONG_FOOT' | translate }}</b><div class="muted">{{ player?.strongFoot }}</div></div>
            <div class="card stat-card"><b>{{ 'PLAYERS.CONTRACT' | translate }}</b><div class="muted">{{ player?.contractStatus }}</div></div>
            <div class="card stat-card"><b>Height</b><div class="muted">{{ player?.height }} cm</div></div>
            <div class="card stat-card"><b>Weight</b><div class="muted">{{ player?.weight }} kg</div></div>
            <div class="card stat-card"><b>{{ 'PLAYERS.MATCHES' | translate }}</b><div class="muted">{{ player?.matchesPlayed }}</div></div>
            <div class="card stat-card"><b>{{ 'PLAYERS.GOALS' | translate }} / {{ 'PLAYERS.ASSISTS' | translate }}</b><div class="muted">{{ player?.goals }} / {{ player?.assists }}</div></div>
          </div>

          <div class="card" style="padding:18px;margin-bottom:20px;">
            <div style="font-weight:700;margin-bottom:10px;">{{ 'PLAYERS.OVERVIEW' | translate }}</div>
            <div class="section-text">{{ 'PLAYERS.AUTO_PROFILE' | translate }}</div>
            <div class="muted" style="margin-top:10px;">{{ 'PLAYERS.MINUTES' | translate }}: {{ player?.minutesPlayed }}</div>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a class="btn btn-primary" [routerLink]="['/players', player?.slug]" (click)="close.emit()">{{ 'PLAYERS.OPEN_FULL_PAGE' | translate }}</a>
            <button class="btn btn-secondary" type="button" (click)="printTechnicalReport()">{{ 'PLAYERS.TECHNICAL_REPORT' | translate }}</button>
            <a class="btn btn-secondary" *ngIf="player?.videoUrl" [href]="player?.videoUrl" target="_blank">{{ 'PLAYERS.HIGHLIGHTS' | translate }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class PlayerModalComponent {
  private reports = inject(PlayerReportService);
  @Input() player: Player | null = null;
  @Output() close = new EventEmitter<void>();

  onBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  printTechnicalReport(): void {
    if (this.player) this.reports.print(this.player);
  }
}
