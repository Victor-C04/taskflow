
import { inject } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';

import { API_BASE_URL } from '../config/api.config';

import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(Auth);

  const token = auth.getAccessToken();

  // Only attach JWT to our NestJS Task API.
  // Never send it to unrelated external services.
  const isTaskApi =
    req.url.startsWith(`${API_BASE_URL}/tasks`) &&
    (
      req.url === `${API_BASE_URL}/tasks` ||
      req.url.startsWith(`${API_BASE_URL}/tasks/`)
    );

  if (token && isTaskApi) {

    const authenticatedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authenticatedRequest);
  }

  return next(req);
};
