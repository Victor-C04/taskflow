
import { inject } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';

import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(Auth);

  const token = auth.getAccessToken();

  // Only attach JWT to our NestJS Task API.
  // Never send it to unrelated external services.
  const isTaskApi =
    req.url.startsWith('http://localhost:3000/tasks') &&
    (
      req.url === 'http://localhost:3000/tasks' ||
      req.url.startsWith('http://localhost:3000/tasks/')
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
