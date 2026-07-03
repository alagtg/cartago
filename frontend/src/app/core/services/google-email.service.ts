import { Injectable } from '@angular/core';
import { GOOGLE_CLIENT_ID } from '../config/google-auth.config';

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleEmailProfile {
  email: string;
  name?: string;
  picture?: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleEmailService {
  private scriptPromise?: Promise<void>;

  connect(): Promise<GoogleEmailProfile> {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('REMPLACE_PAR_TON_GOOGLE_CLIENT_ID')) {
      return Promise.reject(new Error('Google Client ID manquant.'));
    }

    return this.loadScript().then(() => new Promise<GoogleEmailProfile>((resolve, reject) => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (response: any) => {
          if (response.error || !response.access_token) {
            reject(new Error(response.error || 'Connexion Google annulee.'));
            return;
          }

          try {
            const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` }
            });
            const profile = await profileResponse.json();

            if (!profile.email) {
              reject(new Error('Adresse email Google introuvable.'));
              return;
            }

            resolve({
              email: profile.email,
              name: profile.name,
              picture: profile.picture
            });
          } catch {
            reject(new Error("Impossible de recuperer l'email Google."));
          }
        }
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    }));
  }

  private loadScript(): Promise<void> {
    if (window.google?.accounts?.oauth2) {
      return Promise.resolve();
    }

    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Impossible de charger Google.'));
      document.head.appendChild(script);
    });

    return this.scriptPromise;
  }
}
