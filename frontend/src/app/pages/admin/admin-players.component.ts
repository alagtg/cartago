import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
  <div class="page-head">
    <div>
      <div class="badge">{{ 'ADMIN.PLAYERS' | translate }}</div>
      <h2 class="section-title">{{ 'ADMIN.MANAGE_PLAYERS' | translate }}</h2>
    </div>
    <a routerLink="/admin/players/new" class="btn btn-primary">{{ 'ADMIN.ADD_PLAYER_BUTTON' | translate }}</a>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>{{ 'ADMIN.PLAYER' | translate }}</th>
          <th>{{ 'ADMIN.POSITION' | translate }}</th>
          <th>{{ 'ADMIN.NATIONALITY' | translate }}</th>
          <th>{{ 'ADMIN.CURRENT_CLUB' | translate }}</th>
          <th>{{ 'ADMIN.FEATURED' | translate }}</th>
          <th style="width:220px;">{{ 'ADMIN.ACTIONS' | translate }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let player of players">
          <td>{{ player.fullName }}</td>
          <td>{{ player.position }}</td>
          <td>{{ player.nationality }}</td>
          <td>{{ player.currentClub }}</td>
          <td>{{ (player.isFeatured ? 'ADMIN.YES' : 'ADMIN.NO') | translate }}</td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/players', player.id]">{{ 'ADMIN.VIEW' | translate }}</a>
              <a class="btn btn-secondary" [routerLink]="['/admin/players', player.id, 'edit']">{{ 'ADMIN.EDIT' | translate }}</a>
              <button class="btn btn-danger" (click)="remove(player.id)">{{ 'ADMIN.DELETE' | translate }}</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AdminPlayersComponent implements OnInit {
  private api = inject(PlayerService);
  private translate = inject(TranslateService);
  players: Player[] = [];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getAdminAll().subscribe((res) => this.players = res);
  }

  remove(id: number): void {
    if (!confirm(this.translate.instant('ADMIN.DELETE_PLAYER_CONFIRM'))) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
