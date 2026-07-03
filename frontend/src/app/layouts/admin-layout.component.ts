import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';
import { LanguageSwitcherComponent } from '../shared/language-switcher.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, LanguageSwitcherComponent],
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
        <a routerLink="/admin/dashboard" routerLinkActive="active">{{ 'ADMIN.DASHBOARD' | translate }}</a>
        <a routerLink="/admin/players" routerLinkActive="active">{{ 'ADMIN.PLAYERS' | translate }}</a>
        <a routerLink="/admin/team" routerLinkActive="active">{{ 'ADMIN.TEAM' | translate }}</a>
        <a routerLink="/admin/services" routerLinkActive="active">{{ 'ADMIN.SERVICES' | translate }}</a>
        <a routerLink="/admin/messages" routerLinkActive="active">{{ 'ADMIN.MESSAGES' | translate }}</a>
        <a routerLink="/admin/club-requests" routerLinkActive="active">{{ 'ADMIN.CLUB_REQUESTS' | translate }}</a>
        <a routerLink="/admin/player-applications" routerLinkActive="active">{{ 'ADMIN.PLAYER_APPLICATIONS' | translate }}</a>
        <a routerLink="/admin/settings" routerLinkActive="active">{{ 'ADMIN.SETTINGS' | translate }}</a>
        <a href="" (click)="logout($event)">{{ 'ADMIN.LOGOUT' | translate }}</a>
      </nav>
    </aside>

    <main class="admin-main">
      <div class="admin-topbar">
        <div>
          <div class="badge">{{ 'ADMIN.AREA' | translate }}</div>
          <h1 style="margin:12px 0 0;font-size:2rem">Cartago Football Agency</h1>
        </div>
        <div style="display:grid;gap:12px;justify-items:end;">
          <app-language-switcher></app-language-switcher>
          <div class="muted">{{ 'ADMIN.PUBLIC_HINT' | translate }}</div>
        </div>
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
