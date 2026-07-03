import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerApplicationService } from '../../core/services/player-application.service';
import { GoogleEmailService } from '../../core/services/google-email.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container">
      <div class="badge">{{ 'APPLY_PLAYER.BADGE' | translate }}</div>
      <h1 class="section-title">{{ 'APPLY_PLAYER.TITLE' | translate }}</h1>
      <p class="section-text">{{ 'APPLY_PLAYER.TEXT' | translate }}</p>

      <form class="card" style="padding:24px;margin-top:26px;" [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <div><label>{{ 'APPLY_PLAYER.FULL_NAME' | translate }}</label><input class="input" formControlName="fullName"></div>
          <div><label>{{ 'APPLY_PLAYER.DOB' | translate }}</label><input class="input" type="date" formControlName="dateOfBirth"></div>
          <div><label>{{ 'APPLY_PLAYER.NATIONALITY' | translate }}</label><input class="input" formControlName="nationality"></div>
          <div><label>{{ 'APPLY_PLAYER.POSITION' | translate }}</label><input class="input" formControlName="position"></div>
          <div><label>{{ 'APPLY_PLAYER.STRONG_FOOT' | translate }}</label><input class="input" formControlName="strongFoot"></div>
          <div><label>{{ 'APPLY_PLAYER.CURRENT_CLUB' | translate }}</label><input class="input" formControlName="currentClub"></div>
          <div><label>{{ 'APPLY_PLAYER.HEIGHT' | translate }}</label><input class="input" type="number" formControlName="height"></div>
          <div><label>{{ 'APPLY_PLAYER.WEIGHT' | translate }}</label><input class="input" type="number" formControlName="weight"></div>
          <div><label>{{ 'APPLY_PLAYER.CONTRACT' | translate }}</label><input class="input" formControlName="contractSituation"></div>
          <div><label>{{ 'APPLY_PLAYER.VIDEO' | translate }}</label><input class="input" formControlName="videoLink"></div>
          <div><label>{{ 'APPLY_PLAYER.PHONE' | translate }}</label><input class="input" formControlName="phoneNumber"></div>
          <div><label>{{ 'APPLY_PLAYER.EMAIL' | translate }}</label><input class="input" formControlName="email" type="email" placeholder="Connecter votre email professionnel" readonly (click)="connectGoogleEmail()"></div>
        </div>
        <div style="margin-top:16px;">
          <label>{{ 'APPLY_PLAYER.NOTES' | translate }}</label>
          <textarea class="textarea" formControlName="additionalNotes"></textarea>
        </div>

        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;">
          <button class="btn btn-primary" [disabled]="loading">{{ (loading ? 'APPLY_PLAYER.SUBMITTING' : 'APPLY_PLAYER.SUBMIT') | translate }}</button>
          <span class="muted" *ngIf="success">{{ 'APPLY_PLAYER.SUCCESS' | translate }}</span>
          <span class="field-error" *ngIf="error">{{ error }}</span>
        </div>
      </form>
    </div>
  </section>
  `
})
export class ApplyPlayerComponent {
  private fb = inject(FormBuilder);
  private api = inject(PlayerApplicationService);
  private googleEmail = inject(GoogleEmailService);
  loading = false;
  success = false;
  error = '';

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
        this.error = "Impossible d'envoyer la candidature pour le moment.";
      }
    });
  }
}
