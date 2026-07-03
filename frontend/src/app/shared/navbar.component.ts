import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppIconComponent } from './app-icon.component';
import { LanguageSwitcherComponent } from './language-switcher.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, AppIconComponent, LanguageSwitcherComponent],
  template: `
  <header class="site-header">
    <div class="container site-header-inner">
      <a routerLink="/" class="brand-link" (click)="menuOpen = false">
        <img class="logo-img" src="/assets/brand/cartago-logo.png" alt="Cartago logo">
        <div>
          <div class="brand-title">CARTAGO</div>
          <div class="brand-subtitle">Football Agency</div>
        </div>
      </a>

      <nav class="desktop-nav">
        <a href="" (click)="goToSection($event, 'players')">{{ 'NAV.PLAYERS' | translate }}</a>
        <a href="" (click)="goToSection($event, 'team')">{{ 'NAV.TEAM' | translate }}</a>
        <a href="" (click)="goToSection($event, 'services')">{{ 'NAV.SERVICES' | translate }}</a>
        <a href="" (click)="goToSection($event, 'contact')">{{ 'NAV.CONTACT' | translate }}</a>

        <app-language-switcher></app-language-switcher>
      </nav>

      <button type="button" class="menu-toggle" (click)="menuOpen = !menuOpen" aria-label="Open menu">
        <app-icon name="menu"></app-icon>
      </button>
    </div>

    <div class="mobile-menu" *ngIf="menuOpen">
      <div class="container mobile-menu-inner">
        <a href="" (click)="goToSection($event, 'players')">{{ 'NAV.PLAYERS' | translate }}</a>
        <a href="" (click)="goToSection($event, 'team')">{{ 'NAV.TEAM' | translate }}</a>
        <a href="" (click)="goToSection($event, 'services')">{{ 'NAV.SERVICES' | translate }}</a>
        <a href="" (click)="goToSection($event, 'contact')">{{ 'NAV.CONTACT' | translate }}</a>
        <a routerLink="/apply/player" (click)="menuOpen = false">{{ 'NAV.PLAYER_APPLICATION' | translate }}</a>
        <a routerLink="/apply/club" (click)="menuOpen = false">{{ 'NAV.CLUB_REQUEST' | translate }}</a>
        <a routerLink="/admin/login" (click)="menuOpen = false">{{ 'NAV.ADMIN_LOGIN' | translate }}</a>
        <app-language-switcher></app-language-switcher>
      </div>
    </div>
  </header>
  `
})
export class NavbarComponent {
  private router = inject(Router);

  menuOpen = false;

  goToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.menuOpen = false;

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.scrollToSection(sectionId);
      return;
    }

    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => this.scrollToSection(sectionId), 100);
    });
  }

  private scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
