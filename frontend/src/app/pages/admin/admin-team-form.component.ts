import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeamService } from '../../core/services/team.service';

@Component({
  selector: 'app-admin-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="page-head">
    <div><div class="badge">Our Team</div><h2 class="section-title">{{ editMode ? 'Edit Team Member' : 'Add Team Member' }}</h2></div>
    <a routerLink="/admin/team" class="btn btn-secondary">Back</a>
  </div>

  <form class="card" style="padding:24px;" [formGroup]="form" (ngSubmit)="submit()">
    <div class="admin-form-preview">
      <div class="card preview-card">
        <img [src]="form.value.photoUrl || '/assets/team/team-1.jpg'" alt="Preview" style="width:100%;height:280px;object-fit:cover;border-radius:18px;">
        <div style="margin-top:14px;font-weight:800;">{{ form.value.fullName || 'Team member' }}</div>
        <div class="muted" style="margin-top:6px;">{{ form.value.role || 'Role' }}</div>
      </div>

      <div>
        <div class="form-grid">
          <div><label>Full Name</label><input class="input" formControlName="fullName"></div>
          <div><label>Role</label><input class="input" formControlName="role"></div>
          <div><label>Email</label><input class="input" formControlName="email"></div>
          <div><label>Phone</label><input class="input" formControlName="phone"></div>
          <div><label>Photo Url</label><input class="input" formControlName="photoUrl"></div>
          <div><label>Display Order</label><input class="input" type="number" formControlName="displayOrder"></div>
        </div>
        <div style="margin-top:16px;">
          <label>Bio</label>
          <textarea class="textarea" formControlName="bio"></textarea>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;align-items:center;"><input type="checkbox" formControlName="isActive"> Active</div>
      </div>
    </div>

    <div style="margin-top:20px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (editMode ? 'Update Member' : 'Create Member') }}</button>
      <span class="muted" *ngIf="successMessage">{{ successMessage }}</span>
      <span class="field-error" *ngIf="errorMessage">{{ errorMessage }}</span>
    </div>
  </form>
  `
})
export class AdminTeamFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(TeamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  editMode = false;
  id = 0;
  saving = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.group({
    id: [0],
    fullName: ['', Validators.required],
    role: ['', Validators.required],
    bio: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    photoUrl: ['/assets/team/team-1.jpg', Validators.required],
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
          this.successMessage = 'Team member updated successfully.';
          this.router.navigateByUrl('/admin/team');
        },
        error: () => {
          this.saving = false;
          this.errorMessage = 'Unable to update the team member.';
        }
      });
      return;
    }

    this.api.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Team member created successfully.';
        this.router.navigateByUrl('/admin/team');
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Unable to create the team member.';
      }
    });
  }
}
