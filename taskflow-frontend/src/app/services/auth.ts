
import {
  Injectable,
  signal,
  computed
} from '@angular/core';

import { API_BASE_URL } from '../config/api.config';

import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { TaskService } from './task';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly apiUrl = `${API_BASE_URL}/auth`;
  private readonly storageKey = 'taskflow_session';

  private readonly tokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<AuthUser | null>(null);

  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(
    private readonly http: HttpClient,
    private readonly taskService: TaskService
  ) {
    this.restoreSession();
  }

  register(data: RegisterRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(response => {
        this.taskService.clearTasks();

        this.tokenSignal.set(response.accessToken);
        this.userSignal.set(response.user);

        sessionStorage.setItem(
          this.storageKey,
          JSON.stringify({
            accessToken: response.accessToken,
            user: response.user
          })
        );

        this.taskService.loadTasks();
      })
    );
  }

  getAccessToken(): string | null {
    return this.tokenSignal();
  }

  logout(): void {
    this.taskService.clearTasks();

    this.tokenSignal.set(null);
    this.userSignal.set(null);

    sessionStorage.removeItem(this.storageKey);
  }

  private restoreSession(): void {
    const storedSession = sessionStorage.getItem(this.storageKey);

    if (!storedSession) {
      return;
    }

    try {
      const session = JSON.parse(storedSession);

      if (
        typeof session.accessToken !== 'string' ||
        !session.user ||
        typeof session.user.id !== 'number' ||
        typeof session.user.email !== 'string' ||
        typeof session.user.role !== 'string' ||
        this.isTokenExpired(session.accessToken)
      ) {
        this.logout();
        return;
      }

      // Restore authentication only.
      // Task loading happens after App initialization.
      this.tokenSignal.set(session.accessToken);
      this.userSignal.set(session.user);

    } catch {
      this.logout();
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return true;
      }

      const payload = JSON.parse(
        atob(
          parts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      );

      return (
        typeof payload.exp !== 'number' ||
        payload.exp * 1000 <= Date.now()
      );

    } catch {
      return true;
    }
  }
}
