import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Player } from '../../core/models/site.models';
import { PlayerService } from '../../core/services/player.service';
import { PlayerModalComponent } from '../../shared/player-modal.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerModalComponent, TranslateModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">{{ 'PLAYERS.TITLE' | translate }}</div>
          <h1 class="section-title">{{ 'PLAYERS.PAGE_TITLE' | translate }}</h1>
          <p class="section-text">{{ 'PLAYERS.PAGE_TEXT' | translate }}</p>
        </div>
      </div>

      <div class="card" style="padding:18px;margin-bottom:22px;">
        <div class="toolbar">
          <input class="input" style="max-width:340px;" [(ngModel)]="searchTerm" [placeholder]="'PLAYERS.SEARCH_SHORT' | translate">
          <select class="select" style="max-width:220px;" [(ngModel)]="selectedPosition">
            <option value="">{{ 'PLAYERS.ALL_POSITIONS' | translate }}</option>
            <option *ngFor="let position of positions" [value]="position">{{ position }}</option>
          </select>
          <select class="select" style="max-width:220px;" [(ngModel)]="pageSize">
            <option [ngValue]="6">{{ 'PLAYERS.PER_PAGE' | translate:{ count: 6 } }}</option>
            <option [ngValue]="9">{{ 'PLAYERS.PER_PAGE' | translate:{ count: 9 } }}</option>
            <option [ngValue]="12">{{ 'PLAYERS.PER_PAGE' | translate:{ count: 12 } }}</option>
          </select>
        </div>
      </div>

      <div class="list-cards" *ngIf="pagedPlayers.length; else empty">
        <article class="card player-card" *ngFor="let player of pagedPlayers">
          <img class="player-photo" [src]="player.photoUrl" [alt]="player.fullName">
          <div class="player-body">
            <h3 style="margin:0 0 6px;">{{ player.fullName }}</h3>
            <div class="muted">{{ player.position }} • {{ player.nationality }}</div>
            <div class="muted" style="margin-top:6px;">{{ player.currentClub }}</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;">
              <button class="btn btn-primary" (click)="selectedPlayer = player">{{ 'PLAYERS.VIEW_PROFILE' | translate }}</button>
            </div>
          </div>
        </article>
      </div>

      <ng-template #empty>
        <div class="card empty-state">{{ 'PLAYERS.EMPTY' | translate }}</div>
      </ng-template>

      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="page = page - 1" [disabled]="page === 1">‹</button>
        <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
        <button (click)="page = page + 1" [disabled]="page === totalPages">›</button>
      </div>
    </div>
  </section>

  <app-player-modal [player]="selectedPlayer" (close)="selectedPlayer = null"></app-player-modal>
  `
})
export class PlayersComponent implements OnInit {
  private api = inject(PlayerService);
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  searchTerm = '';
  selectedPosition = '';
  page = 1;
  pageSize = 9;

  ngOnInit(): void {
    this.api.getAll().subscribe((res) => this.players = res);
  }

  get positions(): string[] {
    return [...new Set(this.players.map((p) => p.position))];
  }

  get filtered(): Player[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = this.players.filter((p) => {
      const matchesTerm = !term || [p.fullName, p.nationality, p.currentClub, p.position].join(' ').toLowerCase().includes(term);
      const matchesPosition = !this.selectedPosition || p.position === this.selectedPosition;
      return matchesTerm && matchesPosition;
    });
    if (this.page > Math.max(1, Math.ceil(filtered.length / this.pageSize))) this.page = 1;
    return filtered;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedPlayers(): Player[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }
}
