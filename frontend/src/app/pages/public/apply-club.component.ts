import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClubRequestService } from '../../core/services/club-request.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">Club Request</div>
      <h1 class="section-title">Send a club recruitment request</h1>
      <p class="section-text">When the admin clicks a request, it opens a dedicated detail interface.</p>

      <form class="card" style="padding:24px;margin-top:26px;" [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <div><label>Club Name</label><input class="input" formControlName="clubName"></div>
          <div><label>Country</label><input class="input" formControlName="country"></div>
          <div><label>Recruitment Manager</label><input class="input" formControlName="recruitmentManager"></div>
          <div><label>Email</label><input class="input" formControlName="email"></div>
          <div><label>Phone Number</label><input class="input" formControlName="phoneNumber"></div>
          <div><label>Target Profile</label><input class="input" formControlName="targetProfile"></div>
          <div><label>Estimated Budget</label><input class="input" formControlName="estimatedBudget"></div>
          <div><label>Contract Duration</label><input class="input" formControlName="contractDuration"></div>
        </div>
        <div style="margin-top:16px;">
          <label>Additional Details</label>
          <textarea class="textarea" formControlName="additionalDetails"></textarea>
        </div>

        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;">
          <button class="btn btn-primary" [disabled]="form.invalid || loading">{{ loading ? 'Sending...' : 'Submit Club Request' }}</button>
          <span class="muted" *ngIf="success">Request sent successfully.</span>
        </div>
      </form>
    </div>
  </section>
  `
})
export class ApplyClubComponent {
  private fb = inject(FormBuilder);
  private api = inject(ClubRequestService);
  loading = false;
  success = false;

  form = this.fb.group({
    clubName: ['', Validators.required],
    country: ['', Validators.required],
    recruitmentManager: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    targetProfile: ['', Validators.required],
    estimatedBudget: ['', Validators.required],
    contractDuration: ['', Validators.required],
    additionalDetails: ['']
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
