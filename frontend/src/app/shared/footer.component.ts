import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <img class="logo-img" src="/assets/brand/cartago-logo.png" alt="Cartago logo">
          <div style="font-size:1.2rem;font-weight:800;letter-spacing:.04em;">CARTAGO</div>
          <div style="margin-top:-4px;">Football Agency</div>
          <p class="muted" style="max-width:340px;">Elite representation for football talents worldwide.</p>
        </div>

        <div class="footer-column">
          <div class="footer-title">Quick Links</div>
          <a class="footer-link" href="/#players">Players</a>
          <a class="footer-link" href="/#services">Services</a>
          <a class="footer-link" href="/#team">Team</a>
          <a class="footer-link" href="/#contact">Contact</a>
        </div>

        <div class="footer-column">
          <div class="footer-title">Services</div>
          <span class="footer-link">Player Representation</span>
          <span class="footer-link">Scouting</span>
          <span class="footer-link">Contract Management</span>
          <span class="footer-link">Advisory</span>
          <span class="footer-link">Legal</span>
        </div>

        <div class="footer-column">
          <div class="footer-title">Legal</div>
          <span class="footer-link">Privacy Policy</span>
          <span class="footer-link">Terms of Service</span>
          <span class="footer-link">Cookie Policy</span>
        </div>
      </div>

      <div class="footer-bottom">© 2026 Cartago Football Agency. All rights reserved.</div>
    </div>
  </footer>
  `
})
export class FooterComponent {}
