import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { SiteSetting } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="page-head">
    <div><div class="badge">Settings</div><h2 class="section-title">Site text and identity</h2></div>
  </div>

  <div class="card" style="padding:24px;">
    <div class="form-grid">
      <div *ngFor="let item of settings">
        <label>{{ item.key }}</label>
        <input class="input" [(ngModel)]="item.value">
      </div>
    </div>
    <div style="margin-top:20px;">
      <button class="btn btn-primary" (click)="save()">Save Settings</button>
      <span class="muted" style="margin-left:12px;" *ngIf="saved">Saved.</span>
    </div>
  </div>
  `
})
export class AdminSettingsComponent implements OnInit {
  private api = inject(SettingsService);
  settings: SiteSetting[] = [];
  saved = false;

  ngOnInit(): void {
    this.api.getAdminAll().subscribe((res) => this.settings = res);
  }

  save(): void {
    this.api.saveAll(this.settings).subscribe(() => this.saved = true);
  }
}
