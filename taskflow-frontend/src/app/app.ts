
import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';

import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';

import { Auth } from './services/auth';
import { TaskService } from './services/task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  readonly auth = inject(Auth);

  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  ngOnInit(): void {

    // Load tasks after authentication is initialized
    if (this.auth.isLoggedIn()) {
      this.taskService.loadTasks();
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
