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
        <tr *ngFor="let item of pagedServices">
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
  <div class="pagination" *ngIf="totalPages > 1">
    <button (click)="page = page - 1" [disabled]="page === 1">‹</button>
    <button *ngFor="let p of pages" [class.active]="page === p" (click)="page = p">{{ p }}</button>
    <button (click)="page = page + 1" [disabled]="page === totalPages">›</button>
  </div>
  `
})
export class AdminServicesComponent implements OnInit {
  private api = inject(AgencyServiceService);
  private translate = inject(TranslateService);
  services: AgencyService[] = [];
  page = 1;
  pageSize = 10;

  ngOnInit(): void { this.load(); }
  load(): void {
    this.api.getAdminAll().subscribe((res) => {
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

  remove(id: number): void {
    if (!confirm(this.translate.instant('ADMIN.DELETE_SERVICE_CONFIRM'))) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
