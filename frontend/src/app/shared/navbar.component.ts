import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
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

        <div class="lang-switch">
          <button type="button" class="lang-btn" [class.active]="currentLang === 'en'" (click)="setLang('en')">EN</button>
          <button type="button" class="lang-btn" [class.active]="currentLang === 'fr'" (click)="setLang('fr')">FR</button>
          <button type="button" class="lang-btn" [class.active]="currentLang === 'es'" (click)="setLang('es')">ES</button>
        </div>
      </nav>

      <button type="button" class="menu-toggle" (click)="menuOpen = !menuOpen" aria-label="Open menu">
        ☰
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
      </div>
    </div>
  </header>
  `
})
export class NavbarComponent {
  private router = inject(Router);
  private translate = inject(TranslateService);

  menuOpen = false;

  constructor() {
    const savedLang = localStorage.getItem('cartago_lang') || 'en';
    this.translate.addLangs(['en', 'fr', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }

  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  setLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('cartago_lang', lang);
  }

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