
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  readonly auth = inject(Auth);
  private readonly router = inject(Router);

  get userName(): string {
    return this.auth.currentUser()?.name ?? 'User';
  }

  get userRole(): string {
    return this.auth.currentUser()?.role ?? 'MEMBER';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
