import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player.service';
import { TeamService } from '../../core/services/team.service';
import { AgencyServiceService } from '../../core/services/agency-service.service';
import { SettingsService } from '../../core/services/settings.service';
import { ContactService } from '../../core/services/contact.service';
import { Player, TeamMember, AgencyService, SiteSetting } from '../../core/models/site.models';
import { PlayerModalComponent } from '../../shared/player-modal.component';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, PlayerModalComponent, AppIconComponent, TranslateModule],
  template: `
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-logo">
        <img src="/assets/brand/cartago-logo.png" alt="Cartago logo">
      </div>
      <div class="hero-copy">
        <h1>{{ 'HOME.TITLE' | translate }}</h1>
        <p>{{ getSetting('heroSubtitle', ('HOME.SUBTITLE' | translate)) }}</p>
        <div class="hero-actions">
          <a href="#players" class="btn btn-primary">{{ 'HOME.EXPLORE_PLAYERS' | translate }} <app-icon name="arrow-right"></app-icon></a>
          <a href="#contact" class="btn btn-secondary">{{ 'HOME.CONTACT_US' | translate }}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="about">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">{{ 'HOME.ABOUT_BADGE' | translate }}</div>
          <h2 class="section-title">{{ 'HOME.ABOUT_TITLE' | translate }}</h2>
          <p class="section-text">{{ 'HOME.ABOUT_TEXT' | translate }}</p>
        </div>
      </div>
      <div class="info-grid">
        <article class="card info-card">
          <div class="service-icon"><app-icon name="globe"></app-icon></div>
          <h3>{{ 'HOME.POSITIONING' | translate }}</h3>
          <p class="section-text">{{ 'HOME.POSITIONING_TEXT' | translate }}</p>
        </article>
        <article class="card info-card">
          <div class="service-icon"><app-icon name="target"></app-icon></div>
          <h3>{{ 'HOME.VISION' | translate }}</h3>
          <p class="section-text">{{ getSetting('vision', ('HOME.VISION_TEXT' | translate)) }}</p>
        </article>
        <article class="card info-card">
          <div class="service-icon"><app-icon name="handshake"></app-icon></div>
          <h3>{{ 'HOME.MISSION' | translate }}</h3>
          <p class="section-text">{{ getSetting('mission', ('HOME.MISSION_TEXT' | translate)) }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section" id="players">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">{{ 'HOME.PLAYERS_BADGE' | translate }}</div>
          <h2 class="section-title">{{ 'HOME.PLAYERS_TITLE' | translate }}</h2>
          <p class="section-text">{{ 'HOME.PLAYERS_TEXT' | translate }}</p>
        </div>
      </div>

      <div class="card" style="padding:18px;margin-bottom:22px;">
        <div class="toolbar">
          <input class="input" style="max-width:360px;" [(ngModel)]="searchTerm" [placeholder]="'PLAYERS.SEARCH' | translate">
          <select class="select" style="max-width:220px;" [(ngModel)]="selectedPosition">
            <option value="">{{ 'PLAYERS.ALL_POSITIONS' | translate }}</option>
            <option *ngFor="let position of positions" [value]="position">{{ position }}</option>
          </select>
        </div>
      </div>

      <div class="list-cards" *ngIf="pagedPlayers.length; else emptyPlayers">
        <article class="card player-card" *ngFor="let player of pagedPlayers">
          <img class="player-photo" [src]="player.photoUrl" [alt]="player.fullName">
          <div class="player-body">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
              <div>
                <h3 style="margin:0 0 6px;">{{ player.fullName }}</h3>
                <div class="muted">{{ player.position }} • {{ player.nationality }}</div>
              </div>
              <span class="badge">{{ player.currentClub }}</span>
            </div>
            <div class="muted" style="margin-top:12px;">Strong foot: {{ player.strongFoot }}</div>
            <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
              <button class="btn btn-primary" (click)="selectedPlayer = player">{{ 'PLAYERS.VIEW_PROFILE' | translate }}</button>
              <a class="btn btn-secondary" [routerLink]="['/players', player.slug]">{{ 'PLAYERS.OPEN_FULL_PAGE' | translate }}</a>
            </div>
          </div>
        </article>
      </div>

      <ng-template #emptyPlayers>
        <div class="card empty-state">{{ 'PLAYERS.EMPTY' | translate }}</div>
      </ng-template>

      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="page = page - 1" [disabled]="page === 1" aria-label="Previous page"><app-icon name="chevron-left"></app-icon></button>
        <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
        <button (click)="page = page + 1" [disabled]="page === totalPages" aria-label="Next page"><app-icon name="chevron-right"></app-icon></button>
      </div>
    </div>
  </section>

  <section class="section" id="team">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">{{ 'HOME.TEAM_BADGE' | translate }}</div>
          <h2 class="section-title">{{ 'HOME.TEAM_TITLE' | translate }}</h2>
        </div>
      </div>

      <div class="list-cards">
        <article class="card team-card" *ngFor="let member of team">
          <img class="team-photo" [src]="member.photoUrl" [alt]="member.fullName">
          <div class="team-body">
            <h3 style="margin:0 0 6px;">{{ member.fullName }}</h3>
            <div class="badge">{{ member.role }}</div>
            <p class="section-text" style="margin-top:14px;">{{ member.bio }}</p>
            <div style="margin-top:16px;display:grid;gap:8px;">
              <div class="muted contact-line"><app-icon name="mail"></app-icon> {{ member.email }}</div>
              <div class="muted contact-line"><app-icon name="phone"></app-icon> {{ member.phone }}</div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section" id="services">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">{{ 'HOME.SERVICES_BADGE' | translate }}</div>
          <h2 class="section-title">{{ 'HOME.SERVICES_TITLE' | translate }}</h2>
        </div>
      </div>

      <div class="list-cards">
        <article class="card service-card" *ngFor="let item of services">
          <div class="service-body">
            <div class="service-icon"><app-icon [name]="getIconName(item.icon)"></app-icon></div>
            <div class="badge" style="margin-top:16px;">{{ item.category }}</div>
            <h3 style="margin:14px 0 8px;">{{ item.title }}</h3>
            <p class="section-text">{{ item.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container card cta-panel">
      <div>
        <div class="badge">{{ 'HOME.READY_TITLE' | translate }}</div>
        <h2 class="section-title" style="margin-top:14px;">{{ 'HOME.READY_TEXT' | translate }}</h2>
      </div>
      <div class="toolbar">
        <a routerLink="/apply/player" class="btn btn-primary">{{ 'ACTIONS.PLAYER_APPLICATION' | translate }}</a>
        <a routerLink="/apply/club" class="btn btn-secondary">{{ 'ACTIONS.CLUB_REQUEST' | translate }}</a>
      </div>
    </div>
  </section>

  <section class="section" id="contact">
    <div class="container contact-grid">
      <div class="grid">
        <article class="card contact-card">
          <div class="badge">{{ 'HOME.GET_IN_TOUCH' | translate }}</div>
          <h2 class="section-title" style="font-size:2.2rem;margin-top:14px;">{{ 'HOME.READY_TITLE' | translate }}</h2>
          <p class="section-text">{{ 'HOME.CONTACT_TEXT' | translate }}</p>
        </article>
        <article class="card contact-card">
          <div class="footer-title">{{ 'HOME.FOLLOW_US' | translate }}</div>
          <div class="grid" style="gap:12px;margin-top:12px;">
            <div><b>Email</b><div class="muted" style="margin-top:6px;">contact&#64;cartagoagency.com</div></div>
            <div><b>Phone</b><div class="muted" style="margin-top:6px;">+216 00 000 000</div></div>
            <div><b>Instagram</b><div class="muted" style="margin-top:6px;">&#64;cartago.sports.agency</div></div>
          </div>
        </article>
      </div>

      <form class="card" style="padding:24px;" [formGroup]="contactForm" (ngSubmit)="submitContact()">
        <div class="form-grid">
          <div>
            <label>{{ 'CONTACT.NAME' | translate }}</label>
            <input class="input" formControlName="name" [placeholder]="'CONTACT.NAME_PLACEHOLDER' | translate">
          </div>
          <div>
            <label>{{ 'CONTACT.EMAIL' | translate }}</label>
            <input class="input" formControlName="email" [placeholder]="'CONTACT.EMAIL_PLACEHOLDER' | translate">
          </div>
        </div>
        <div style="margin-top:16px;">
          <label>{{ 'CONTACT.SUBJECT' | translate }}</label>
          <input class="input" formControlName="subject" [placeholder]="'CONTACT.SUBJECT_PLACEHOLDER' | translate">
        </div>
        <div style="margin-top:16px;">
          <label>{{ 'CONTACT.MESSAGE' | translate }}</label>
          <textarea class="textarea" formControlName="message" [placeholder]="'CONTACT.MESSAGE_PLACEHOLDER' | translate"></textarea>
        </div>
        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <button class="btn btn-primary" [disabled]="contactForm.invalid || contactLoading">{{ (contactLoading ? 'CONTACT.SENDING' : 'CONTACT.SEND') | translate }}</button>
          <span class="muted" *ngIf="contactSuccess">{{ 'CONTACT.SUCCESS' | translate }}</span>
          <span class="field-error" *ngIf="contactError">{{ contactError }}</span>
        </div>
      </form>
    </div>
  </section>

  <app-player-modal [player]="selectedPlayer" (close)="selectedPlayer = null"></app-player-modal>
  `
})
export class HomeComponent implements OnInit {
  private playersApi = inject(PlayerService);
  private teamApi = inject(TeamService);
  private servicesApi = inject(AgencyServiceService);
  private settingsApi = inject(SettingsService);
  private contactApi = inject(ContactService);
  private fb = inject(FormBuilder);

  players: Player[] = [];
  team: TeamMember[] = [];
  services: AgencyService[] = [];
  settings: SiteSetting[] = [];
  selectedPlayer: Player | null = null;
  searchTerm = '';
  selectedPosition = '';
  page = 1;
  pageSize = 6;
  contactLoading = false;
  contactSuccess = false;
  contactError = '';

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  ngOnInit(): void {
    this.playersApi.getAll().subscribe((res) => this.players = res);
    this.teamApi.getAll().subscribe((res) => this.team = res);
    this.servicesApi.getAll().subscribe((res) => this.services = res);
    this.settingsApi.getAll().subscribe((res) => this.settings = res);
  }

  get positions(): string[] {
    return [...new Set(this.players.map((p) => p.position))];
  }

  get filteredPlayers(): Player[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = this.players.filter((p) => {
      const haystack = [p.fullName, p.nationality, p.currentClub, p.position, p.strongFoot].join(' ').toLowerCase();
      const matchesTerm = !term || haystack.includes(term);
      const matchesPosition = !this.selectedPosition || p.position === this.selectedPosition;
      return matchesTerm && matchesPosition;
    });
    const maxPage = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.page > maxPage) this.page = 1;
    return filtered;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredPlayers.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedPlayers(): Player[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredPlayers.slice(start, start + this.pageSize);
  }

  getSetting(key: string, fallback: string): string {
    return this.settings.find((s) => s.key === key)?.value || fallback;
  }

  getIconName(icon: string): string {
    const map: Record<string, string> = {
      star: 'star',
      file: 'file-text',
      plane: 'plane',
      search: 'search',
      radar: 'radar',
      report: 'clipboard-list',
      trophy: 'trophy',
      contract: 'pen-line'
    };
    return map[icon] || 'football';
  }

  submitContact(): void {
    if (this.contactForm.invalid) return;
    this.contactLoading = true;
    this.contactSuccess = false;
    this.contactError = '';
    this.contactApi.send(this.contactForm.getRawValue() as any).subscribe({
      next: () => {
        this.contactLoading = false;
        this.contactSuccess = true;
        this.contactForm.reset();
      },
      error: () => {
        this.contactLoading = false;
        this.contactError = 'Unable to send the message right now.';
      }
    });
  }
}
