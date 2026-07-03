import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgencyServiceService } from '../../core/services/agency-service.service';
import { AgencyService } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-head">
    <div><div class="badge">Services</div><h2 class="section-title">Manage services</h2></div>
    <a routerLink="/admin/services/new" class="btn btn-primary">Add Service</a>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>Title</th><th>Category</th><th>Order</th><th>Actions</th></tr></thead>
      <tbody>
        <tr *ngFor="let item of services">
          <td>{{ item.title }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.displayOrder }}</td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/services', item.id, 'edit']">Edit</a>
              <button class="btn btn-danger" (click)="remove(item.id)">Delete</button>
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
  services: AgencyService[] = [];
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getAdminAll().subscribe((res) => this.services = res); }
  remove(id: number): void {
    if (!confirm('Delete this service?')) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
