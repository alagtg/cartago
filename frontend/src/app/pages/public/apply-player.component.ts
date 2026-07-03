import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerApplicationService } from '../../core/services/player-application.service';

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
          <div><label>{{ 'APPLY_PLAYER.EMAIL' | translate }}</label><input class="input" formControlName="email"></div>
        </div>
        <div style="margin-top:16px;">
          <label>{{ 'APPLY_PLAYER.NOTES' | translate }}</label>
          <textarea class="textarea" formControlName="additionalNotes"></textarea>
        </div>

        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;">
          <button class="btn btn-primary" [disabled]="form.invalid || loading">{{ (loading ? 'APPLY_PLAYER.SUBMITTING' : 'APPLY_PLAYER.SUBMIT') | translate }}</button>
          <span class="muted" *ngIf="success">{{ 'APPLY_PLAYER.SUCCESS' | translate }}</span>
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
