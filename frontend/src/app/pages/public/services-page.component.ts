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
        <div class="card" style="padding:24px;" *ngFor="let item of services">
          <div class="badge">{{ item.category }}</div>
          <h3 style="margin:14px 0 8px;">{{ item.title }}</h3>
          <p class="section-text">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
  `
})
export class ServicesPageComponent implements OnInit {
  private api = inject(AgencyServiceService);
  services: AgencyService[] = [];

  ngOnInit(): void {
    this.api.getAll().subscribe((res) => this.services = res);
  }
}
