import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-head">
    <div>
      <div class="badge">Player Detail</div>
      <h2 class="section-title">{{ player?.fullName }}</h2>
    </div>
    <div class="toolbar">
      <a class="btn btn-secondary" routerLink="/admin/players">Back</a>
      <a class="btn btn-primary" *ngIf="player" [routerLink]="['/admin/players', player.id, 'edit']">Edit</a>
    </div>
  </div>

  <div class="card" *ngIf="player" style="padding:24px;">
    <div class="split">
      <img [src]="player.photoUrl" [alt]="player.fullName" style="height:420px;width:100%;object-fit:cover;border-radius:20px;">
      <div>
        <div class="badge">{{ player.position }}</div>
        <div class="muted" style="margin-top:12px;">{{ player.nationality }} • {{ player.currentClub }}</div>
        <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:18px;">
          <div class="card" style="padding:14px;">Strong Foot<div class="muted">{{ player.strongFoot }}</div></div>
          <div class="card" style="padding:14px;">Contract<div class="muted">{{ player.contractStatus }}</div></div>
          <div class="card" style="padding:14px;">Matches<div class="muted">{{ player.matchesPlayed }}</div></div>
          <div class="card" style="padding:14px;">Goals / Assists<div class="muted">{{ player.goals }} / {{ player.assists }}</div></div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class AdminPlayerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(PlayerService);
  player?: Player;

  ngOnInit(): void {
    const id = +(this.route.snapshot.paramMap.get('id') || 0);
    this.api.getById(id).subscribe((res) => this.player = res);
  }
}
