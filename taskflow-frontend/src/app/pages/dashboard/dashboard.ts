
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private readonly taskService = inject(TaskService);

  readonly tasks = this.taskService.tasks;

  readonly totalTasks = computed(() => this.tasks().length);

  readonly todoTasks = computed(() =>
    this.countByStatus('To Do')
  );

  readonly inProgressTasks = computed(() =>
    this.countByStatus('In Progress')
  );

  readonly inReviewTasks = computed(() =>
    this.countByStatus('In Review')
  );

  readonly completedTasks = computed(() =>
    this.countByStatus('Completed')
  );

  countByStatus(status: TaskStatus): number {
    return this.tasks().filter(
      task => task.status === status
    ).length;
  }
}
