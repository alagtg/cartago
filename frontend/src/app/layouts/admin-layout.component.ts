import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="brand">
        <img class="logo-img" src="/assets/brand/cartago-logo.png" alt="Cartago logo">
        <div>
          <div style="font-weight:800">Cartago Admin</div>
          <div class="muted" style="font-size:.9rem">{{ auth.currentUser?.fullName }}</div>
        </div>
      </div>

      <nav>
        <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/admin/players" routerLinkActive="active">Players</a>
        <a routerLink="/admin/team" routerLinkActive="active">Our Team</a>
        <a routerLink="/admin/services" routerLinkActive="active">Services</a>
        <a routerLink="/admin/messages" routerLinkActive="active">Contact Messages</a>
        <a routerLink="/admin/club-requests" routerLinkActive="active">Club Requests</a>
        <a routerLink="/admin/player-applications" routerLinkActive="active">Player Applications</a>
        <a routerLink="/admin/settings" routerLinkActive="active">Settings</a>
        <a href="" (click)="logout($event)">Logout</a>
      </nav>
    </aside>

    <main class="admin-main">
      <div class="admin-topbar">
        <div>
          <div class="badge">Admin Area</div>
          <h1 style="margin:12px 0 0;font-size:2rem">Cartago Football Agency</h1>
        </div>
        <div class="muted">Public site stays accessible without login.</div>
      </div>
      <router-outlet></router-outlet>
    </main>
  </div>
  `
})
export class AdminLayoutComponent {
  auth = inject(AuthService);

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
  }
}
