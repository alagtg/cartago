import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgencyServiceService } from '../../core/services/agency-service.service';
import { AgencyService } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
  <div class="page-head">
    <div><div class="badge">{{ 'ADMIN.SERVICES' | translate }}</div><h2 class="section-title">{{ 'ADMIN.MANAGE_SERVICES' | translate }}</h2></div>
    <a routerLink="/admin/services/new" class="btn btn-primary">{{ 'ADMIN.ADD_SERVICE_BUTTON' | translate }}</a>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>{{ 'ADMIN.TITLE' | translate }}</th><th>{{ 'ADMIN.CATEGORY' | translate }}</th><th>{{ 'ADMIN.ORDER' | translate }}</th><th>{{ 'ADMIN.ACTIONS' | translate }}</th></tr></thead>
      <tbody>
        <tr *ngFor="let item of services">
          <td>{{ item.title }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.displayOrder }}</td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/services', item.id, 'edit']">{{ 'ADMIN.EDIT' | translate }}</a>
              <button class="btn btn-danger" (click)="remove(item.id)">{{ 'ADMIN.DELETE' | translate }}</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AdminServicesComponent implements OnInit {
  private api = inject(AgencyServiceService);
  private translate = inject(TranslateService);
  services: AgencyService[] = [];
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getAdminAll().subscribe((res) => this.services = res); }
  remove(id: number): void {
    if (!confirm(this.translate.instant('ADMIN.DELETE_SERVICE_CONFIRM'))) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
