import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../core/services/team.service';
import { TeamMember } from '../../core/models/site.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-head">
    <div><div class="badge">Our Team</div><h2 class="section-title">Manage team members</h2></div>
    <a routerLink="/admin/team/new" class="btn btn-primary">Add Member</a>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
      <tbody>
        <tr *ngFor="let member of team">
          <td>{{ member.fullName }}</td>
          <td>{{ member.role }}</td>
          <td>{{ member.email }}</td>
          <td>{{ member.phone }}</td>
          <td>
            <div class="toolbar">
              <a class="btn btn-secondary" [routerLink]="['/admin/team', member.id, 'edit']">Edit</a>
              <button class="btn btn-danger" (click)="remove(member.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AdminTeamComponent implements OnInit {
  private api = inject(TeamService);
  team: TeamMember[] = [];

  ngOnInit(): void { this.load(); }
  load(): void { this.api.getAdminAll().subscribe((res) => this.team = res); }
  remove(id: number): void {
    if (!confirm('Delete this team member?')) return;
    this.api.remove(id).subscribe(() => this.load());
  }
}
