import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../core/services/contact.service';

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
            <div class="muted" style="margin-top:6px;">contact&#64;cartagoagency.com</div>
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
        <div class="form-grid">
          <div>
            <label>{{ 'CONTACT.NAME' | translate }}</label>
            <input class="input" formControlName="name">
          </div>
          <div>
            <label>{{ 'CONTACT.EMAIL' | translate }}</label>
            <input class="input" formControlName="email">
          </div>
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
          <button class="btn btn-primary" [disabled]="form.invalid || loading">{{ (loading ? 'CONTACT.SENDING' : 'CONTACT.SEND') | translate }}</button>
          <span class="muted" *ngIf="success">{{ 'CONTACT.SUCCESS' | translate }}</span>
        </div>
      </form>
    </div>
  </section>
  `
})
export class ContactPageComponent {
  private fb = inject(FormBuilder);
  private api = inject(ContactService);

  loading = false;
  success = false;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.api.send(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.form.reset();
      },
      error: () => this.loading = false
    });
  }
}
