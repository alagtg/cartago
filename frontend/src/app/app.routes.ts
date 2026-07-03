import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { HomeComponent } from './pages/public/home.component';
import { PlayersComponent } from './pages/public/players.component';
import { ServicesPageComponent } from './pages/public/services-page.component';
import { PlayerDetailComponent } from './pages/public/player-detail.component';
import { TeamPageComponent } from './pages/public/team-page.component';
import { ContactPageComponent } from './pages/public/contact-page.component';
import { ApplyPlayerComponent } from './pages/public/apply-player.component';
import { ApplyClubComponent } from './pages/public/apply-club.component';
import { TeamContactsComponent } from './pages/public/team-contacts.component';
import { LoginComponent } from './pages/admin/login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminPlayersComponent } from './pages/admin/admin-players.component';
import { AdminPlayerFormComponent } from './pages/admin/admin-player-form.component';
import { AdminPlayerDetailComponent } from './pages/admin/admin-player-detail.component';
import { AdminTeamComponent } from './pages/admin/admin-team.component';
import { AdminTeamFormComponent } from './pages/admin/admin-team-form.component';
import { AdminServicesComponent } from './pages/admin/admin-services.component';
import { AdminServiceFormComponent } from './pages/admin/admin-service-form.component';
import { AdminMessagesComponent } from './pages/admin/admin-messages.component';
import { AdminMessageDetailComponent } from './pages/admin/admin-message-detail.component';
import { AdminClubRequestsComponent } from './pages/admin/admin-club-requests.component';
import { AdminClubRequestDetailComponent } from './pages/admin/admin-club-request-detail.component';
import { AdminPlayerApplicationsComponent } from './pages/admin/admin-player-applications.component';
import { AdminPlayerApplicationDetailComponent } from './pages/admin/admin-player-application-detail.component';
import { AdminSettingsComponent } from './pages/admin/admin-settings.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'players', component: PlayersComponent },
      { path: 'players/:slug', component: PlayerDetailComponent },
      { path: 'services', component: ServicesPageComponent },
      { path: 'team', component: TeamPageComponent },
      { path: 'contact', component: ContactPageComponent },
      { path: 'apply/player', component: ApplyPlayerComponent },
      { path: 'apply/club', component: ApplyClubComponent },
      { path: 'contacts/team', component: TeamContactsComponent }
    ]
  },
  { path: 'admin/login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'players', component: AdminPlayersComponent },
      { path: 'players/new', component: AdminPlayerFormComponent },
      { path: 'players/:id', component: AdminPlayerDetailComponent },
      { path: 'players/:id/edit', component: AdminPlayerFormComponent },
      { path: 'team', component: AdminTeamComponent },
      { path: 'team/new', component: AdminTeamFormComponent },
      { path: 'team/:id/edit', component: AdminTeamFormComponent },
      { path: 'services', component: AdminServicesComponent },
      { path: 'services/new', component: AdminServiceFormComponent },
      { path: 'services/:id/edit', component: AdminServiceFormComponent },
      { path: 'messages', component: AdminMessagesComponent },
      { path: 'messages/:id', component: AdminMessageDetailComponent },
      { path: 'club-requests', component: AdminClubRequestsComponent },
      { path: 'club-requests/:id', component: AdminClubRequestDetailComponent },
      { path: 'player-applications', component: AdminPlayerApplicationsComponent },
      { path: 'player-applications/:id', component: AdminPlayerApplicationDetailComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
