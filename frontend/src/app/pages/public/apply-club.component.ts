import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClubRequestService } from '../../core/services/club-request.service';
import { GoogleEmailService } from '../../core/services/google-email.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">{{ 'APPLY_CLUB.BADGE' | translate }}</div>
      <h1 class="section-title">{{ 'APPLY_CLUB.TITLE' | translate }}</h1>
      <p class="section-text">{{ 'APPLY_CLUB.TEXT' | translate }}</p>

      <form class="card" style="padding:24px;margin-top:26px;" [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <div><label>{{ 'APPLY_CLUB.CLUB_NAME' | translate }}</label><input class="input" formControlName="clubName"></div>
          <div><label>{{ 'APPLY_CLUB.COUNTRY' | translate }}</label><input class="input" formControlName="country"></div>
          <div><label>{{ 'APPLY_CLUB.MANAGER' | translate }}</label><input class="input" formControlName="recruitmentManager"></div>
          <div><label>{{ 'APPLY_CLUB.EMAIL' | translate }}</label><input class="input" formControlName="email" type="email" placeholder="Connecter votre email professionnel" readonly (click)="connectGoogleEmail()"></div>
          <div><label>{{ 'APPLY_CLUB.PHONE' | translate }}</label><input class="input" formControlName="phoneNumber"></div>
          <div><label>{{ 'APPLY_CLUB.TARGET' | translate }}</label><input class="input" formControlName="targetProfile"></div>
          <div><label>{{ 'APPLY_CLUB.BUDGET' | translate }}</label><input class="input" formControlName="estimatedBudget"></div>
          <div><label>{{ 'APPLY_CLUB.DURATION' | translate }}</label><input class="input" formControlName="contractDuration"></div>
        </div>
        <div style="margin-top:16px;">
          <label>{{ 'APPLY_CLUB.DETAILS' | translate }}</label>
          <textarea class="textarea" formControlName="additionalDetails"></textarea>
        </div>

        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;">
          <button class="btn btn-primary" [disabled]="loading">{{ (loading ? 'APPLY_CLUB.SENDING' : 'APPLY_CLUB.SUBMIT') | translate }}</button>
          <span class="muted" *ngIf="success">{{ 'APPLY_CLUB.SUCCESS' | translate }}</span>
          <span class="field-error" *ngIf="error">{{ error }}</span>
        </div>
      </form>
    </div>
  </section>
  `
})
export class ApplyClubComponent {
  private fb = inject(FormBuilder);
  private api = inject(ClubRequestService);
  private googleEmail = inject(GoogleEmailService);
  loading = false;
  success = false;
  error = '';

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

  connectGoogleEmail(): void {
    this.googleEmail.connect().then((profile) => {
      this.form.patchValue({ email: profile.email });
      this.error = '';
    }).catch((error: Error) => {
      this.error = error.message;
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = this.form.controls.email.invalid
        ? 'Cliquez sur le champ Email pour connecter votre compte Google.'
        : 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const payload = this.form.getRawValue() as any;
    this.loading = true;
    this.success = false;
    this.error = '';

    this.api.create(payload).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.form.reset();
      },
      error: () => {
        this.loading = false;
        this.error = "Impossible d'envoyer la demande pour le moment.";
      }
    });
  }
}
