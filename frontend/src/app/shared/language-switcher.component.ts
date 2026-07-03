import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLanguage, LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lang-switch" aria-label="Language selector">
      <button
        type="button"
        class="lang-btn"
        *ngFor="let lang of languages"
        [class.active]="currentLang === lang"
        (click)="setLang(lang)">
        {{ lang.toUpperCase() }}
      </button>
    </div>
  `
})
export class LanguageSwitcherComponent {
  private language = inject(LanguageService);
  languages: AppLanguage[] = ['en', 'fr', 'es'];

  get currentLang(): AppLanguage {
    return this.language.currentLang();
  }

  setLang(lang: AppLanguage): void {
    this.language.setLanguage(lang);
  }
}
