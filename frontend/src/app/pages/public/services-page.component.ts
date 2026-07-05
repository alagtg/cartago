import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AgencyServiceService } from '../../core/services/agency-service.service';
import { AgencyService } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">{{ 'SERVICES.TITLE' | translate }}</div>
      <h1 class="section-title">{{ 'SERVICES.PAGE_TITLE' | translate }}</h1>
      <p class="section-text">{{ 'SERVICES.PAGE_TEXT' | translate }}</p>

      <div class="feature-grid" style="margin-top:26px;">
        <div class="card" style="padding:24px;" *ngFor="let item of pagedServices">
          <div class="badge">{{ item.category }}</div>
          <h3 style="margin:14px 0 8px;">{{ item.title }}</h3>
          <p class="section-text">{{ item.description }}</p>
        </div>
      </div>
      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="page = page - 1" [disabled]="page === 1">‹</button>
        <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
        <button (click)="page = page + 1" [disabled]="page === totalPages">›</button>
      </div>
    </div>
  </section>
  `
})
export class ServicesPageComponent implements OnInit {
  private api = inject(AgencyServiceService);
  services: AgencyService[] = [];
  page = 1;
  pageSize = 6;

  ngOnInit(): void {
    this.api.getAll().subscribe((res) => {
      this.services = res;
      this.page = 1;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.services.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedServices(): AgencyService[] {
    if (this.page > this.totalPages) this.page = 1;
    const start = (this.page - 1) * this.pageSize;
    return this.services.slice(start, start + this.pageSize);
  }
}
