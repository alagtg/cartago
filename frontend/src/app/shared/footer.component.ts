import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule],
  template: `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <img class="logo-img" src="/assets/brand/cartago-logo.png" alt="Cartago logo">
          <div style="font-size:1.2rem;font-weight:800;letter-spacing:.04em;">CARTAGO</div>
          <div>Football Agency</div>
          <p class="muted" style="max-width:340px;">{{ 'FOOTER.AGENCY_TEXT' | translate }}</p>
        </div>

        <div class="footer-column">
          <div class="footer-title">{{ 'FOOTER.QUICK_LINKS' | translate }}</div>
          <a class="footer-link" href="/#players">{{ 'NAV.PLAYERS' | translate }}</a>
          <a class="footer-link" href="/#services">{{ 'NAV.SERVICES' | translate }}</a>
          <a class="footer-link" href="/#team">{{ 'NAV.TEAM' | translate }}</a>
          <a class="footer-link" href="/#contact">{{ 'NAV.CONTACT' | translate }}</a>
        </div>

        <div class="footer-column">
          <div class="footer-title">{{ 'FOOTER.SERVICES' | translate }}</div>
          <span class="footer-link">{{ 'FOOTER.PLAYER_REPRESENTATION' | translate }}</span>
          <span class="footer-link">{{ 'FOOTER.SCOUTING' | translate }}</span>
          <span class="footer-link">{{ 'FOOTER.CONTRACT_MANAGEMENT' | translate }}</span>
          <span class="footer-link">{{ 'FOOTER.ADVISORY' | translate }}</span>
          <span class="footer-link">{{ 'FOOTER.LEGAL' | translate }}</span>
        </div>

        <div class="footer-column">
          <div class="footer-title">{{ 'FOOTER.LEGAL' | translate }}</div>
          <span class="footer-link">{{ 'FOOTER.PRIVACY_POLICY' | translate }}</span>
          <span class="footer-link">{{ 'FOOTER.TERMS' | translate }}</span>
          <span class="footer-link">{{ 'FOOTER.COOKIE' | translate }}</span>
        </div>
      </div>

      <div class="footer-bottom">{{ 'FOOTER.COPYRIGHT' | translate }}</div>
    </div>
  </footer>
  `
})
export class FooterComponent {}
