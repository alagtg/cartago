import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../core/services/contact.service';
import { GoogleEmailService } from '../../core/services/google-email.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
  <section class="section" style="padding-top:120px;">
    <div class="container contact-grid">
      <div class="card" style="padding:24px;">
        <div class="badge">{{ 'CONTACT.TITLE' | translate }}</div>
        <h1 class="section-title">{{ 'CONTACT.PAGE_TITLE' | translate }}</h1>
        <p class="section-text">{{ 'CONTACT.PAGE_TEXT' | translate }}</p>

        <div class="grid" style="margin-top:20px;">
          <div class="card" style="padding:16px;">
            <b>{{ 'CONTACT.EMAIL' | translate }}</b>
            <div class="muted" style="margin-top:6px;">CartagoAgency&#64;hotmail.com</div>
          </div>
          <div class="card" style="padding:16px;">
            <b>{{ 'CONTACT.PHONE' | translate }}</b>
            <div class="muted" style="margin-top:6px;">+216 00 000 000</div>
          </div>
          <div class="card" style="padding:16px;">
            <b>Instagram</b>
            <div class="muted" style="margin-top:6px;">&#64;cartago.sports.agency</div>
          </div>
        </div>
      </div>

      <form class="card" style="padding:24px;" [formGroup]="form" (ngSubmit)="submit()">
        <div style="margin-top:16px;">
          <label>{{ 'CONTACT.EMAIL' | translate }}</label>
          <input class="input" formControlName="email" type="email" placeholder="Connecter votre email professionnel" readonly (click)="connectGoogleEmail()">
        </div>
        <div style="margin-top:16px;">
          <label>{{ 'CONTACT.SUBJECT' | translate }}</label>
          <input class="input" formControlName="subject">
        </div>
        <div style="margin-top:16px;">
          <label>{{ 'CONTACT.MESSAGE' | translate }}</label>
          <textarea class="textarea" formControlName="message"></textarea>
        </div>
        <div style="margin-top:18px;display:flex;gap:12px;align-items:center;">
          <button class="btn btn-primary" [disabled]="loading">{{ (loading ? 'CONTACT.SENDING' : 'CONTACT.SEND') | translate }}</button>
          <span class="muted" *ngIf="success">{{ 'CONTACT.SUCCESS' | translate }}</span>
          <span class="field-error" *ngIf="error">{{ error }}</span>
        </div>
      </form>
    </div>
  </section>
  `
})
export class ContactPageComponent {
  private fb = inject(FormBuilder);
  private api = inject(ContactService);
  private googleEmail = inject(GoogleEmailService);

  loading = false;
  success = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
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

    this.loading = true;
    this.success = false;
    this.error = '';

    const { email, subject, message } = this.form.getRawValue();
    const payload = {
      name: email || '',
      email: email || '',
      subject: subject || '',
      message: message || ''
    };

    this.api.send(payload).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        console.error('Contact send failed', err);
        this.error = this.formatContactError(err);
      }
    });
  }

  private formatContactError(err: any): string {
    if (err?.name === 'TimeoutError') {
      return "Le serveur n'a pas repondu a temps. Verifiez que le backend est lance.";
    }
    const detail = err?.error?.message || err?.message || err?.statusText;
    if (detail) {
      const status = err?.status ? ` (${err.status})` : '';
      return `Impossible d'envoyer le message${status} : ${detail}`;
    }
    return "Impossible d'envoyer le message pour le moment.";
  }
}
