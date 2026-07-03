import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" [ngSwitch]="name">
      <ng-container *ngSwitchCase="'globe'">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M2 12h20"></path>
        <path d="M12 2a15.3 15.3 0 0 1 0 20"></path>
        <path d="M12 2a15.3 15.3 0 0 0 0 20"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'target'">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </ng-container>
      <ng-container *ngSwitchCase="'handshake'">
        <path d="M11 17 7 13l-3 3"></path>
        <path d="m13 17 4-4 3 3"></path>
        <path d="m7 13 3-3 2 2 2-2 3 3"></path>
        <path d="m8 18 2 2 2-2"></path>
        <path d="m12 18 2 2 2-2"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'mail'">
        <rect x="3" y="5" width="18" height="14" rx="2"></rect>
        <path d="m3 7 9 6 9-6"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'phone'">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'star'">
        <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2z"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'file-text'">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <path d="M14 2v6h6"></path>
        <path d="M8 13h8"></path>
        <path d="M8 17h6"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'plane'">
        <path d="M17.8 19.2 16 13l5-5.1c1.4-1.4 1.4-3.5.4-4.5s-3.1-1-4.5.4L11.8 9 5.6 7.2 4.2 8.6l5.2 3.2-3.1 3.1-2.5-.4-1.1 1.1 3.8 1.9 1.9 3.8 1.1-1.1-.4-2.5 3.1-3.1 3.2 5.2z"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'search'">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'radar'">
        <path d="M12 12h.01"></path>
        <path d="M16.2 7.8a6 6 0 0 1 0 8.4"></path>
        <path d="M7.8 7.8a6 6 0 0 0 0 8.4"></path>
        <path d="M19 5a10 10 0 0 1 0 14"></path>
        <path d="M5 5a10 10 0 0 0 0 14"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'clipboard-list'">
        <rect x="8" y="2" width="8" height="4" rx="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <path d="M8 12h.01"></path>
        <path d="M12 12h4"></path>
        <path d="M8 16h.01"></path>
        <path d="M12 16h4"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'trophy'">
        <path d="M8 21h8"></path>
        <path d="M12 17v4"></path>
        <path d="M7 4h10v5a5 5 0 0 1-10 0z"></path>
        <path d="M7 6H4a2 2 0 0 0 2 5h1"></path>
        <path d="M17 6h3a2 2 0 0 1-2 5h-1"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'pen-line'">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'football'">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m12 7 4 3-1.5 5h-5L8 10z"></path>
        <path d="m12 7-1-4"></path>
        <path d="m16 10 4-1"></path>
        <path d="m14.5 15 2.5 3"></path>
        <path d="m9.5 15-2.5 3"></path>
        <path d="M8 10 4 9"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'menu'">
        <path d="M4 6h16"></path>
        <path d="M4 12h16"></path>
        <path d="M4 18h16"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'x'">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'arrow-right'">
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'chevron-left'">
        <path d="m15 18-6-6 6-6"></path>
      </ng-container>
      <ng-container *ngSwitchCase="'chevron-right'">
        <path d="m9 18 6-6-6-6"></path>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m12 7 4 3-1.5 5h-5L8 10z"></path>
      </ng-container>
    </svg>
  `
})
export class AppIconComponent {
  @Input() name = 'football';
}
