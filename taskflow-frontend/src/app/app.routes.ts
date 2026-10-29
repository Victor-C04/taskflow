
import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { WorkflowBoard } from './pages/workflow-board/workflow-board';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'workflow',
    component: WorkflowBoard,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
