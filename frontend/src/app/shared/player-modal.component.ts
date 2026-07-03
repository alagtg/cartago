import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Player } from '../core/models/site.models';

@Component({
  selector: 'app-player-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="modal-backdrop" *ngIf="player" (click)="onBackdrop($event)">
    <div class="modal-card">
      <button class="modal-close" (click)="close.emit()">✕</button>
      <div class="split" style="padding:24px;">
        <div>
          <img [src]="player?.photoUrl" [alt]="player?.fullName" style="width:100%;height:500px;object-fit:cover;border-radius:20px;">
        </div>
        <div>
          <div class="badge">View Profile</div>
          <h2 style="font-size:2.3rem;margin:12px 0 6px;">{{ player?.fullName }}</h2>
          <div class="muted" style="margin-bottom:18px;">{{ player?.position }} • {{ player?.nationality }} • {{ player?.currentClub }}</div>

          <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:20px;">
            <div class="card stat-card"><b>Strong Foot</b><div class="muted">{{ player?.strongFoot }}</div></div>
            <div class="card stat-card"><b>Contract</b><div class="muted">{{ player?.contractStatus }}</div></div>
            <div class="card stat-card"><b>Height</b><div class="muted">{{ player?.height }} cm</div></div>
            <div class="card stat-card"><b>Weight</b><div class="muted">{{ player?.weight }} kg</div></div>
            <div class="card stat-card"><b>Matches</b><div class="muted">{{ player?.matchesPlayed }}</div></div>
            <div class="card stat-card"><b>Goals / Assists</b><div class="muted">{{ player?.goals }} / {{ player?.assists }}</div></div>
          </div>

          <div class="card" style="padding:18px;margin-bottom:20px;">
            <div style="font-weight:700;margin-bottom:10px;">Professional Summary</div>
            <div class="section-text">A dynamic profile presented automatically from your player data, current club, statistics and media links.</div>
            <div class="muted" style="margin-top:10px;">Minutes Played: {{ player?.minutesPlayed }}</div>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a class="btn btn-primary" [routerLink]="['/players', player?.slug]" (click)="close.emit()">Open Full Page</a>
            <a class="btn btn-secondary" *ngIf="player?.technicalReportUrl" [href]="player?.technicalReportUrl" target="_blank">Technical Report</a>
            <a class="btn btn-secondary" *ngIf="player?.videoUrl" [href]="player?.videoUrl" target="_blank">Highlights Video</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class PlayerModalComponent {
  @Input() player: Player | null = null;
  @Output() close = new EventEmitter<void>();

  onBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
