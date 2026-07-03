import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-head">
    <div>
      <div class="badge">Players</div>
      <h2 class="section-title">Manage players</h2>
    </div>
    <a routerLink="/admin/players/new" class="btn btn-primary">Add Player</a>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Position</th>
          <th>Nationality</th>
          <th>Current Club</th>
          <th>Featured</th>
          <th style="width:220px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let player of players">
          <td>{{ player.fullName }}</td>
          <td>{{ player.position }}</td>
          <td>{{ player.nationality }}</td>
          <td>{{ player.currentClub }}</td>
          <td>{{ player.isFeatured ? 'Yes' : 'No' }}</td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/players', player.id]">View</a>
              <a class="btn btn-secondary" [routerLink]="['/admin/players', player.id, 'edit']">Edit</a>
              <button class="btn btn-danger" (click)="remove(player.id)">Delete</button>
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
  players: Player[] = [];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getAdminAll().subscribe((res) => this.players = res);
  }

  remove(id: number): void {
    if (!confirm('Delete this player?')) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
