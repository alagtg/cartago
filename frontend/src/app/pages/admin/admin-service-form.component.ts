import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgencyServiceService } from '../../core/services/agency-service.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-admin-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AppIconComponent],
  template: `
  <div class="page-head">
    <div><div class="badge">Services</div><h2 class="section-title">{{ editMode ? 'Edit Service' : 'Add Service' }}</h2></div>
    <a routerLink="/admin/services" class="btn btn-secondary">Back</a>
  </div>

  <form class="card" style="padding:24px;" [formGroup]="form" (ngSubmit)="submit()">
    <div class="admin-form-preview">
      <div class="card preview-card">
        <div class="service-icon"><app-icon [name]="iconPreview"></app-icon></div>
        <div style="margin-top:16px;font-weight:800;">{{ form.value.title || 'Service title' }}</div>
        <div class="badge" style="margin-top:10px;">{{ form.value.category || 'Category' }}</div>
        <p class="section-text" style="margin-top:14px;">{{ form.value.description || 'Service description preview.' }}</p>
      </div>

      <div>
        <div class="form-grid">
          <div><label>Title</label><input class="input" formControlName="title"></div>
          <div><label>Category</label><input class="input" formControlName="category"></div>
          <div><label>Icon</label><input class="input" formControlName="icon"></div>
          <div><label>Display Order</label><input class="input" type="number" formControlName="displayOrder"></div>
        </div>
        <div style="margin-top:16px;">
          <label>Description</label>
          <textarea class="textarea" formControlName="description"></textarea>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;align-items:center;"><input type="checkbox" formControlName="isActive"> Active</div>
      </div>
    </div>

    <div style="margin-top:20px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (editMode ? 'Update Service' : 'Create Service') }}</button>
      <span class="muted" *ngIf="successMessage">{{ successMessage }}</span>
      <span class="field-error" *ngIf="errorMessage">{{ errorMessage }}</span>
    </div>
  </form>
  `
})
export class AdminServiceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(AgencyServiceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  editMode = false;
  id = 0;
  saving = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.group({
    id: [0],
    title: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    icon: ['star', Validators.required],
    displayOrder: [1, Validators.required],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.editMode = !!id;
    if (id) {
      this.id = +id;
      this.api.getById(this.id).subscribe((res) => this.form.patchValue(res as any));
    }
  }

  get iconPreview(): string {
    const value = this.form.value.icon || 'star';
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
    return map[value] || 'football';
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';
    const payload = this.form.getRawValue() as any;

    if (this.editMode) {
      this.api.update(this.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.successMessage = 'Service updated successfully.';
          this.router.navigateByUrl('/admin/services');
        },
        error: () => {
          this.saving = false;
          this.errorMessage = 'Unable to update the service.';
        }
      });
      return;
    }

    this.api.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Service created successfully.';
        this.router.navigateByUrl('/admin/services');
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Unable to create the service.';
      }
    });
  }
}
