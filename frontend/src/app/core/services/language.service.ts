import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'fr' | 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'cartago_lang';
  private readonly supported: AppLanguage[] = ['en', 'fr', 'es'];

  constructor(private translate: TranslateService) {}

  initialize(): void {
    const lang = this.getInitialLanguage();
    this.translate.addLangs(this.supported);
    this.translate.setDefaultLang('en');
    this.setLanguage(lang);
  }

  private getInitialLanguage(): AppLanguage {
    const saved = localStorage.getItem(this.storageKey) as AppLanguage | null;
    if (saved && this.supported.includes(saved)) return saved;

    const browserLang = navigator.language.split('-')[0] as AppLanguage;
    return this.supported.includes(browserLang) ? browserLang : 'en';
  }

  currentLang(): AppLanguage {
    return (this.translate.currentLang || this.translate.defaultLang || 'en') as AppLanguage;
  }

  setLanguage(lang: AppLanguage): void {
    if (!this.supported.includes(lang)) return;
    localStorage.setItem(this.storageKey, lang);
    document.documentElement.lang = lang;
    this.translate.use(lang);
  }

  t(translations: Record<AppLanguage, string>): string {
    return translations[this.currentLang()];
  }
}
