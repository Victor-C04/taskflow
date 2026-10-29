
import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task';
import { TaskForm } from '../../components/task-form/task-form';

@Component({
  selector: 'app-workflow-board',
  standalone: true,
  imports: [CommonModule, TaskForm],
  templateUrl: './workflow-board.html',
  styleUrl: './workflow-board.css'
})
export class WorkflowBoard {

  // Reactively read tasks from the service
  readonly tasks = computed(() => this.taskService.tasks());

  statuses: TaskStatus[] = [
    'To Do',
    'In Progress',
    'In Review',
    'Completed'
  ];

  showTaskForm = false;
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) {
  console.log('Workflow Board initialized');
  this.taskService.loadTasks();
}

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks().filter(task => task.status === status);
  }

  openCreateTask(): void {
    this.selectedTask = null;
    this.showTaskForm = true;
  }

  openEditTask(task: Task): void {
    this.selectedTask = {
      ...task,
      dueDate: task.dueDate.slice(0, 10)
    };

    this.showTaskForm = true;
  }

  closeTaskForm(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
  }

  saveTask(taskData: Omit<Task, 'id'>): void {
    if (this.selectedTask) {
      this.taskService.updateTask({
        ...taskData,
        id: this.selectedTask.id
      });
    } else {
      this.taskService.addTask(taskData);
    }

    this.closeTaskForm();
  }

  deleteTask(task: Task): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id);
  }

  moveTask(task: Task, direction: number): void {
    const currentIndex = this.statuses.indexOf(task.status);
    const newIndex = currentIndex + direction;

    if (newIndex < 0 || newIndex >= this.statuses.length) {
      return;
    }

    this.taskService.updateTaskStatus(
      task.id,
      this.statuses[newIndex]
    );
  }

  canMovePrevious(task: Task): boolean {
    return this.statuses.indexOf(task.status) > 0;
  }

  canMoveNext(task: Task): boolean {
    return this.statuses.indexOf(task.status) <
      this.statuses.length - 1;
  }
}
