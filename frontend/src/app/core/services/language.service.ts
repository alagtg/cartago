import { Injectable } from '@angular/core';

export type AppLanguage = 'en' | 'fr' | 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'cartago_lang';

  private current: AppLanguage = this.getInitialLanguage();

  private getInitialLanguage(): AppLanguage {
    const saved = localStorage.getItem(this.storageKey) as AppLanguage | null;
    return saved ?? 'en';
  }

  currentLang(): AppLanguage {
    return this.current;
  }

  setLanguage(lang: AppLanguage): void {
    this.current = lang;
    localStorage.setItem(this.storageKey, lang);
  }

  t(translations: Record<AppLanguage, string>): string {
    return translations[this.current];
  }
}