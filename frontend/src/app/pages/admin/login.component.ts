import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageSwitcherComponent } from '../../shared/language-switcher.component';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LanguageSwitcherComponent],
  template: `
  <section class="section" style="min-height:100vh;display:grid;place-items:center;padding:32px;">
    <form class="card" style="width:min(460px,100%);padding:28px;" [formGroup]="form" (ngSubmit)="submit()">
      <div style="text-align:center;margin-bottom:22px;">
        <img src="/assets/brand/cartago-logo.png" alt="Cartago logo" style="height:72px;margin:0 auto 12px;">
        <div class="badge">{{ 'ADMIN.LOGIN' | translate }}</div>
        <h1 style="margin:14px 0 0;">Cartago Football Agency</h1>
      </div>
      <div>
        <label>{{ 'ADMIN.EMAIL' | translate }}</label>
        <input class="input" formControlName="email">
      </div>
      <div style="margin-top:16px;">
        <label>{{ 'ADMIN.PASSWORD' | translate }}</label>
        <input class="input" type="password" formControlName="password">
      </div>
      <div *ngIf="error" style="margin-top:14px;color:#ffd7d7;">{{ error | translate }}</div>
      <div style="margin-top:20px;">
        <button class="btn btn-primary" style="width:100%;" [disabled]="form.invalid || loading">{{ (loading ? 'ADMIN.CONNECTING' : 'ADMIN.LOGIN_BUTTON') | translate }}</button>
      </div>
      <div style="display:flex;justify-content:center;margin-top:16px;">
        <app-language-switcher></app-language-switcher>
      </div>
    </form>
  </section>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => this.router.navigateByUrl('/admin/dashboard'),
      error: (err) => {
        this.loading = false;
        console.error('Admin login failed', err);
        this.error = this.formatLoginError(err);
      }
    });
  }

  private formatLoginError(err: any): string {
    if (err?.status === 0) {
      return "Impossible de contacter l'API. Verifiez l'URL backend et CORS.";
    }
    if (err?.status === 401 || err?.status === 400) {
      return 'Email ou mot de passe invalide.';
    }
    const detail = err?.error?.message || err?.message || err?.statusText;
    if (detail) {
      return `Erreur login (${err?.status || 'API'}) : ${detail}`;
    }
    return 'Email ou mot de passe invalide.';
  }
}
