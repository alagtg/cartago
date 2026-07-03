import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { TeamService } from '../../core/services/team.service';
import { AgencyServiceService } from '../../core/services/agency-service.service';
import { SettingsService } from '../../core/services/settings.service';
import { ContactService } from '../../core/services/contact.service';
import { Player, TeamMember, AgencyService, SiteSetting } from '../../core/models/site.models';
import { PlayerModalComponent } from '../../shared/player-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, PlayerModalComponent],
  template: `
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-logo">
        <img src="/assets/brand/cartago-logo.png" alt="Cartago logo">
      </div>
      <div class="hero-copy">
        <h1>Cartago Football Agency</h1>
        <p>{{ getSetting('heroSubtitle', 'Elite Representation • Global Network • Strategic Growth') }}</p>
        <div class="hero-actions">
          <a href="#players" class="btn btn-primary">Explore Players <span>→</span></a>
          <a href="#contact" class="btn btn-secondary">Contact Us</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="about">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">About The Agency</div>
          <h2 class="section-title">International positioning with premium football expertise</h2>
          <p class="section-text">We help players, clubs and partners move faster with strong scouting, negotiation support and strategic visibility across Europe, Africa and the Middle East.</p>
        </div>
      </div>
      <div class="info-grid">
        <article class="card info-card">
          <div class="service-icon">🌍</div>
          <h3>Positioning</h3>
          <p class="section-text">Cartago Football Agency connects talent, clubs and opportunities through a premium international network.</p>
        </article>
        <article class="card info-card">
          <div class="service-icon">🎯</div>
          <h3>Vision</h3>
          <p class="section-text">{{ getSetting('vision', 'Become a global reference in football representation and talent development.') }}</p>
        </article>
        <article class="card info-card">
          <div class="service-icon">🤝</div>
          <h3>Mission</h3>
          <p class="section-text">{{ getSetting('mission', 'Empower athletes through strategic career management, international exposure and professional excellence.') }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section" id="players">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">Players</div>
          <h2 class="section-title">Search and browse player profiles</h2>
          <p class="section-text">Pagination is available here on the home page so you can manage 30 players or more without opening another page.</p>
        </div>
      </div>

      <div class="card" style="padding:18px;margin-bottom:22px;">
        <div class="toolbar">
          <input class="input" style="max-width:360px;" [(ngModel)]="searchTerm" placeholder="Search by player, nationality, club or position">
          <select class="select" style="max-width:220px;" [(ngModel)]="selectedPosition">
            <option value="">All positions</option>
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
              <button class="btn btn-primary" (click)="selectedPlayer = player">View Profile</button>
              <a class="btn btn-secondary" [routerLink]="['/players', player.slug]">Open Full Page</a>
            </div>
          </div>
        </article>
      </div>

      <ng-template #emptyPlayers>
        <div class="card empty-state">No players found with the current search.</div>
      </ng-template>

      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="page = page - 1" [disabled]="page === 1">‹</button>
        <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
        <button (click)="page = page + 1" [disabled]="page === totalPages">›</button>
      </div>
    </div>
  </section>

  <section class="section" id="team">
    <div class="container">
      <div class="page-head">
        <div>
          <div class="badge">Our Team</div>
          <h2 class="section-title">Every team member visible directly on the home page</h2>
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
              <div class="muted">✉ {{ member.email }}</div>
              <div class="muted">☎ {{ member.phone }}</div>
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
          <div class="badge">Services</div>
          <h2 class="section-title">Player and club services in the same home experience</h2>
        </div>
      </div>

      <div class="list-cards">
        <article class="card service-card" *ngFor="let item of services">
          <div class="service-body">
            <div class="service-icon">{{ getIcon(item.icon) }}</div>
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
        <div class="badge">Ready to work together?</div>
        <h2 class="section-title" style="margin-top:14px;">Players, clubs and partners can reach the agency directly.</h2>
      </div>
      <div class="toolbar">
        <a routerLink="/apply/player" class="btn btn-primary">Player Application</a>
        <a routerLink="/apply/club" class="btn btn-secondary">Club Request</a>
      </div>
    </div>
  </section>

  <section class="section" id="contact">
    <div class="container contact-grid">
      <div class="grid">
        <article class="card contact-card">
          <div class="badge">Get In Touch</div>
          <h2 class="section-title" style="font-size:2.2rem;margin-top:14px;">Ready to work together?</h2>
          <p class="section-text">Players, clubs and partners can reach the agency directly from the website.</p>
        </article>
        <article class="card contact-card">
          <div class="footer-title">Follow Us</div>
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
            <label>Name</label>
            <input class="input" formControlName="name" placeholder="Your name">
          </div>
          <div>
            <label>Email</label>
            <input class="input" formControlName="email" placeholder="your@email.com">
          </div>
        </div>
        <div style="margin-top:16px;">
          <label>Subject</label>
          <input class="input" formControlName="subject" placeholder="Subject">
        </div>
        <div style="margin-top:16px;">
          <label>Message</label>
          <textarea class="textarea" formControlName="message" placeholder="Your message..."></textarea>
        </div>
        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <button class="btn btn-primary" [disabled]="contactForm.invalid || contactLoading">{{ contactLoading ? 'Sending...' : 'Send Message' }}</button>
          <span class="muted" *ngIf="contactSuccess">Message sent successfully.</span>
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

  getIcon(icon: string): string {
    const map: Record<string, string> = {
      star: '★',
      file: '📄',
      plane: '✈',
      search: '🔎',
      radar: '📡',
      report: '📋',
      trophy: '🏆',
      contract: '✍'
    };
    return map[icon] || '⚽';
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
