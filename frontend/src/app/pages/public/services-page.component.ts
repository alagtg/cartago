import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyServiceService } from '../../core/services/agency-service.service';
import { AgencyService } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">Services</div>
      <h1 class="section-title">Support for players and clubs</h1>
      <p class="section-text">Every service below is loaded from the backend and can be managed by the admin area.</p>

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
