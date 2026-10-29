
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  onLogin(): void {

    if (this.loading()) {
      return;
    }

    this.errorMessage.set('');

    if (!this.email.trim() || !this.password) {
      this.errorMessage.set('Please enter your email and password.');
      return;
    }

    this.loading.set(true);

    this.auth.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {

        this.loading.set(false);

        // Get the page requested before login
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl');

        // Redirect to requested page or Dashboard
        const destination =
          returnUrl === '/dashboard' || returnUrl === '/workflow'
            ? returnUrl
            : '/dashboard';

        this.router.navigateByUrl(destination);
      },

      error: (error: HttpErrorResponse) => {

        this.loading.set(false);

        if (error.status === 401) {
          this.errorMessage.set('Invalid email or password.');
        } else {
          this.errorMessage.set(
            'Unable to log in. Please try again.'
          );
        }
      }
    });
  }
}
