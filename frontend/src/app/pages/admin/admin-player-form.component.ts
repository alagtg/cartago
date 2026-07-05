import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-admin-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  template: `
  <div class="page-head">
    <div>
      <div class="badge">{{ 'ADMIN.PLAYERS' | translate }}</div>
      <h2 class="section-title">{{ (editMode ? 'ADMIN.EDIT_PLAYER' : 'ADMIN.CREATE_PLAYER') | translate }}</h2>
    </div>
    <a routerLink="/admin/players" class="btn btn-secondary">Back</a>
  </div>

  <form class="card" style="padding:24px;" [formGroup]="form" (ngSubmit)="submit()">
    <div class="admin-form-preview">
      <div class="card preview-card">
        <img [src]="form.value.photoUrl || '/assets/players/player-1.jpg'" alt="Preview" style="width:100%;height:280px;object-fit:cover;border-radius:18px;">
        <div style="margin-top:14px;font-weight:800;">{{ form.value.fullName || 'Player name' }}</div>
        <div class="muted" style="margin-top:6px;">{{ form.value.position || 'Position' }} • {{ form.value.nationality || 'Nationality' }}</div>
        <div class="form-hint">The slug is created automatically from the full name unless you edit it manually.</div>
      </div>

      <div>
        <div class="form-grid">
          <div><label>Full Name</label><input class="input" formControlName="fullName" (input)="syncSlug()"></div>
          <div><label>Slug</label><input class="input" formControlName="slug"></div>
          <div><label>Date of Birth</label><input class="input" type="date" formControlName="dateOfBirth"></div>
          <div><label>Nationality</label><input class="input" formControlName="nationality"></div>
          <div><label>Height</label><input class="input" type="number" formControlName="height"></div>
          <div><label>Weight</label><input class="input" type="number" formControlName="weight"></div>
          <div><label>Position</label><input class="input" formControlName="position"></div>
          <div><label>Strong Foot</label><input class="input" formControlName="strongFoot"></div>
          <div><label>Current Club</label><input class="input" formControlName="currentClub"></div>
          <div><label>Contract Status</label><input class="input" formControlName="contractStatus"></div>
          <div><label>Matches Played</label><input class="input" type="number" formControlName="matchesPlayed"></div>
          <div><label>Goals</label><input class="input" type="number" formControlName="goals"></div>
          <div><label>Assists</label><input class="input" type="number" formControlName="assists"></div>
          <div><label>Minutes Played</label><input class="input" type="number" formControlName="minutesPlayed"></div>
          <div><label>Video Url</label><input class="input" formControlName="videoUrl"></div>
          <div>
            <label>Technical Report Url</label>
            <input class="input" formControlName="technicalReportUrl" placeholder="https://.../rapport.pdf">
            <div class="form-hint">Ajoutez une vraie URL PDF. Les liens example.com sont ignores.</div>
          </div>
          <div style="grid-column:1 / -1;"><label>Photo Url</label><input class="input" formControlName="photoUrl"></div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:28px;"><input type="checkbox" formControlName="isFeatured"> Featured</div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:28px;"><input type="checkbox" formControlName="isActive"> Active</div>
        </div>
      </div>
    </div>

    <div style="margin-top:20px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (editMode ? 'Update Player' : 'Create Player') }}</button>
      <span class="muted" *ngIf="successMessage">{{ successMessage }}</span>
      <span class="field-error" *ngIf="errorMessage">{{ errorMessage }}</span>
    </div>
  </form>
  `
})
export class AdminPlayerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(PlayerService);
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
    slug: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    nationality: ['', Validators.required],
    height: [180, Validators.required],
    weight: [75, Validators.required],
    position: ['', Validators.required],
    strongFoot: ['', Validators.required],
    currentClub: ['', Validators.required],
    contractStatus: ['', Validators.required],
    matchesPlayed: [0, Validators.required],
    goals: [0, Validators.required],
    assists: [0, Validators.required],
    minutesPlayed: [0, Validators.required],
    videoUrl: [''],
    technicalReportUrl: [''],
    photoUrl: ['/assets/players/player-1.jpg', Validators.required],
    isFeatured: [false],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.editMode = !!id;
    if (id) {
      this.id = +id;
      this.api.getById(this.id).subscribe((res) => {
        this.form.patchValue({
          ...(res as any),
          technicalReportUrl: this.cleanTechnicalReportUrl(res.technicalReportUrl)
        });
      });
    }
  }

  syncSlug(): void {
    if (this.editMode) return;
    const name = this.form.value.fullName || '';
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    this.form.patchValue({ slug }, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';
    const payload = {
      ...(this.form.getRawValue() as any),
      technicalReportUrl: this.cleanTechnicalReportUrl(this.form.value.technicalReportUrl || '')
    };

    if (this.editMode) {
      this.api.update(this.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.successMessage = 'Player updated successfully.';
          this.router.navigateByUrl('/admin/players');
        },
        error: () => {
          this.saving = false;
          this.errorMessage = 'Unable to update the player.';
        }
      });
      return;
    }

    this.api.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Player created successfully.';
        this.router.navigateByUrl('/admin/players');
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Unable to create the player.';
      }
    });
  }

  private cleanTechnicalReportUrl(url?: string | null): string {
    const trimmed = (url || '').trim();
    if (!trimmed || trimmed.includes('example.com/report.pdf')) return '';
    return trimmed;
  }
}
