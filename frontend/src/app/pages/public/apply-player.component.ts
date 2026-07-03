import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PlayerApplicationService } from '../../core/services/player-application.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">Player Application</div>
      <h1 class="section-title">Join the agency</h1>
      <p class="section-text">This form is connected to the backend and visible in the admin area.</p>

      <form class="card" style="padding:24px;margin-top:26px;" [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <div><label>Full Name</label><input class="input" formControlName="fullName"></div>
          <div><label>Date of Birth</label><input class="input" type="date" formControlName="dateOfBirth"></div>
          <div><label>Nationality</label><input class="input" formControlName="nationality"></div>
          <div><label>Position</label><input class="input" formControlName="position"></div>
          <div><label>Strong Foot</label><input class="input" formControlName="strongFoot"></div>
          <div><label>Current Club</label><input class="input" formControlName="currentClub"></div>
          <div><label>Height (cm)</label><input class="input" type="number" formControlName="height"></div>
          <div><label>Weight (kg)</label><input class="input" type="number" formControlName="weight"></div>
          <div><label>Contract Situation</label><input class="input" formControlName="contractSituation"></div>
          <div><label>Video Link</label><input class="input" formControlName="videoLink"></div>
          <div><label>Phone Number</label><input class="input" formControlName="phoneNumber"></div>
          <div><label>Email</label><input class="input" formControlName="email"></div>
        </div>
        <div style="margin-top:16px;">
          <label>Additional Notes</label>
          <textarea class="textarea" formControlName="additionalNotes"></textarea>
        </div>

        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;">
          <button class="btn btn-primary" [disabled]="form.invalid || loading">{{ loading ? 'Submitting...' : 'Submit Application' }}</button>
          <span class="muted" *ngIf="success">Application sent successfully.</span>
        </div>
      </form>
    </div>
  </section>
  `
})
export class ApplyPlayerComponent {
  private fb = inject(FormBuilder);
  private api = inject(PlayerApplicationService);
  loading = false;
  success = false;

  form = this.fb.group({
    fullName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    nationality: ['', Validators.required],
    position: ['', Validators.required],
    strongFoot: ['', Validators.required],
    height: [180, Validators.required],
    weight: [72, Validators.required],
    currentClub: ['', Validators.required],
    contractSituation: ['', Validators.required],
    videoLink: [''],
    phoneNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    additionalNotes: ['']
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.api.create(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.form.reset();
      },
      error: () => this.loading = false
    });
  }
}
