
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onRegister(): void {

    if (this.loading()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage.set(
        'Password must contain at least 8 characters.'
      );
      return;
    }

    if (this.password.length > 72) {
      this.errorMessage.set(
        'Password must not exceed 72 characters.'
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);

    this.auth.register({
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(
          'Account created successfully! Redirecting to login...'
        );

        this.router.navigateByUrl('/login', {
          state: {
            registrationSuccess: true
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);

        if (error.status === 409) {
          this.errorMessage.set(
            'An account with this email already exists.'
          );
        } else if (error.status === 400) {
          this.errorMessage.set(
            'Please check your details and try again.'
          );
        } else {
          this.errorMessage.set(
            'Registration failed. Please try again.'
          );
        }
      }
    });
  }
}
