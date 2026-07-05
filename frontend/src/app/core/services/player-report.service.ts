import { Injectable } from '@angular/core';
import { Player } from '../models/site.models';

@Injectable({ providedIn: 'root' })
export class PlayerReportService {
  print(player: Player): void {
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    document.body.appendChild(frame);

    const doc = frame.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(this.buildHtml(player));
    doc.close();

    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 1000);
    }, 500);
  }

  private buildHtml(player: Player): string {
    const name = this.safe(player.fullName);
    const position = this.safe(player.position);
    const foot = this.safe(player.strongFoot);
    const club = this.safe(player.currentClub);
    const nationality = this.safe(player.nationality);
    const contract = this.safe(player.contractStatus);
    const photo = this.safe(player.photoUrl || '/assets/players/player-1.jpg');
    const birthDate = this.formatDate(player.dateOfBirth);

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rapport technique - ${name}</title>
  <style>
    @page { size: A4; margin: 6mm; }
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; font-family: Arial, sans-serif; color: #132033; background: #fff; overflow: hidden; }
    .sheet { width: 100%; height: 285mm; page-break-after: avoid; page-break-inside: avoid; border: 3px solid #d4af37; overflow: hidden; background: linear-gradient(180deg, #ffffff 0%, #f7f9fd 100%); }
    .header { height: 108px; display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; background: linear-gradient(135deg, #061226 0%, #10244a 62%, #1d3260 100%); color: #fff; border-bottom: 6px solid #d4af37; }
    .brand { display: flex; align-items: center; gap: 15px; }
    .brand img { width: 72px; height: 72px; object-fit: contain; background: #071427; border: 2px solid rgba(212, 175, 55, .58); border-radius: 8px; padding: 7px; }
    .brand strong, .brand span { display: block; }
    .brand strong { color: #f1d06b; font-size: 23px; line-height: 1.1; }
    .brand span, .tag { color: #e8eef8; font-size: 13px; text-transform: uppercase; letter-spacing: .1em; }
    .tag { border: 1px solid rgba(212, 175, 55, .62); color: #071427; background: linear-gradient(135deg, #d4af37, #f1d06b); padding: 9px 13px; border-radius: 999px; font-weight: 800; }
    .main { display: grid; grid-template-columns: 235px 1fr; height: calc(285mm - 108px); }
    .side { background: linear-gradient(180deg, #10244a 0%, #071427 100%); border-right: 3px solid #d4af37; padding: 17px; color: #fff; }
    .photo { width: 100%; height: 292px; object-fit: cover; border-radius: 8px; border: 3px solid #d4af37; }
    .side-block { margin-top: 18px; padding-top: 15px; border-top: 1px solid rgba(212, 175, 55, .36); }
    h3, h2 { margin: 0 0 12px; color: #071427; font-size: 15px; text-transform: uppercase; letter-spacing: .08em; }
    h3::after, h2::after { content: ""; display: block; width: 38px; height: 3px; margin-top: 6px; background: #d4af37; border-radius: 999px; }
    .side-block h3 { color: #f1d06b; }
    .side-block p { display: grid; gap: 4px; margin: 0 0 13px; font-size: 13.5px; }
    b { color: #69788d; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
    .side-block b { color: #b9c7dc; }
    .side-block span { font-weight: 800; color: #fff; font-size: 15px; }
    .points span { font-weight: 800; color: #132033; }
    .content { padding: 24px 24px 22px; background: linear-gradient(180deg, rgba(16,36,74,.05), rgba(255,255,255,0) 26%); }
    h1 { margin: 0; font-size: 40px; line-height: 1; color: #071427; border-left: 7px solid #d4af37; padding-left: 14px; }
    .subtitle { margin: 11px 0 0 21px; color: #344966; font-weight: 800; font-size: 15px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 22px 0; }
    .stats div { border: 1px solid #cbd6e5; border-bottom: 5px solid #d4af37; padding: 14px 11px; border-radius: 9px; background: linear-gradient(180deg, #ffffff 0%, #edf3fb 100%); }
    .stats span { display: block; font-size: 29px; line-height: 1; font-weight: 900; color: #071427; }
    .stats b { display: block; margin-top: 7px; color: #10244a; }
    .block { border-top: 2px solid #d9e0ea; padding-top: 18px; margin-top: 18px; }
    .block p { margin: 0; color: #263a55; line-height: 1.55; font-size: 15px; }
    .points { display: grid; grid-template-columns: repeat(2, 1fr); gap: 11px; }
    .points div { padding: 14px; border-radius: 9px; background: linear-gradient(180deg, #f8fafc, #edf3fb); border: 1px solid #cbd6e5; border-left: 5px solid #d4af37; }
    .points b, .points span { display: block; }
    .points span { margin-top: 6px; font-size: 15px; }
    .note { background: linear-gradient(135deg, #071427, #10244a); color: #fff; padding: 17px; border-radius: 9px; border: 1px solid rgba(212, 175, 55, .44); }
    .note h2 { color: #d4af37; }
    .note p { color: #dce5f3; }
  </style>
</head>
<body>
  <article class="sheet">
    <header class="header">
      <div class="brand">
        <img src="/assets/brand/cartago-logo.png" alt="Cartago Football Agency">
        <div><strong>Cartago Football Agency</strong><span>Technical player report</span></div>
      </div>
      <div class="tag">Rapport technique</div>
    </header>
    <div class="main">
      <aside class="side">
        <img class="photo" src="${photo}" alt="${name}">
        <div class="side-block">
          <h3>Identite</h3>
          <p><b>Naissance</b><span>${birthDate}</span></p>
          <p><b>Nationalite</b><span>${nationality}</span></p>
          <p><b>Taille</b><span>${player.height} cm</span></p>
          <p><b>Poids</b><span>${player.weight} kg</span></p>
        </div>
        <div class="side-block">
          <h3>Situation</h3>
          <p><b>Club</b><span>${club}</span></p>
          <p><b>Contrat</b><span>${contract}</span></p>
        </div>
      </aside>
      <main class="content">
        <h1>${name}</h1>
        <p class="subtitle">${position} - ${foot} - ${club}</p>
        <div class="stats">
          <div><span>${player.matchesPlayed}</span><b>Matchs</b></div>
          <div><span>${player.goals}</span><b>Buts</b></div>
          <div><span>${player.assists}</span><b>Passes</b></div>
          <div><span>${player.minutesPlayed}</span><b>Minutes</b></div>
        </div>
        <section class="block">
          <h2>Profil sportif</h2>
          <p>Joueur ${position} evoluant a ${club}. Profil suivi par Cartago Football Agency, avec une evaluation basee sur les informations sportives disponibles, la situation contractuelle et les statistiques recentes.</p>
        </section>
        <section class="block">
          <h2>Points cles</h2>
          <div class="points">
            <div><b>Position principale</b><span>${position}</span></div>
            <div><b>Pied fort</b><span>${foot}</span></div>
            <div><b>Experience</b><span>${player.matchesPlayed} matchs</span></div>
            <div><b>Contribution</b><span>${player.goals} buts / ${player.assists} passes</span></div>
          </div>
        </section>
        <section class="block note">
          <h2>Note agence</h2>
          <p>Ce rapport resume le profil professionnel du joueur pour faciliter une premiere analyse club. Les donnees peuvent etre completees par videos, references sportives et documents officiels.</p>
        </section>
      </main>
    </div>
  </article>
</body>
</html>`;
  }

  private safe(value?: string | null): string {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char] || char));
  }

  private formatDate(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return this.safe(value);
    return date.toLocaleDateString('fr-FR');
  }
}
