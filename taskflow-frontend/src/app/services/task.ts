
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly apiUrl = `${API_BASE_URL}/tasks`;

  private readonly tasksSignal = signal<Task[]>([]);

  readonly tasks = this.tasksSignal.asReadonly();

  private loadVersion = 0;

  constructor(private http: HttpClient) {}

  // Clear tasks when user logs out or switches accounts
  clearTasks(): void {
    this.loadVersion++;
    this.tasksSignal.set([]);
  }

  // Load tasks belonging to the logged-in user
  loadTasks(): void {
    const version = ++this.loadVersion;

    this.tasksSignal.set([]);

    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        if (version === this.loadVersion) {
          this.tasksSignal.set(tasks);
        }
      },
      error: (error) => {
        if (version === this.loadVersion) {
          console.error('Failed to load tasks:', error);
        }
      }
    });
  }

  // Get all loaded tasks
  getTasks(): Task[] {
    return this.tasksSignal().map(task => ({ ...task }));
  }

  // Get total task count
  getTaskCount(): number {
    return this.tasksSignal().length;
  }

  // Filter tasks by workflow status
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasksSignal()
      .filter(task => task.status === status)
      .map(task => ({ ...task }));
  }

  // Move task to another workflow stage
  updateTaskStatus(
    taskId: number,
    newStatus: TaskStatus
  ): void {

    const version = this.loadVersion;

    this.http.patch<Task>(
      `${this.apiUrl}/${taskId}`,
      { status: newStatus }
    ).subscribe({
      next: (updatedTask) => {
        if (version !== this.loadVersion) return;

        this.tasksSignal.update(tasks =>
          tasks.map(task =>
            task.id === taskId ? updatedTask : task
          )
        );
      },
      error: (error) => {
        console.error('Failed to update task status:', error);
      }
    });
  }

  // Create new task
  addTask(taskData: Omit<Task, 'id'>): void {

    const version = this.loadVersion;

    this.http.post<Task>(
      this.apiUrl,
      taskData
    ).subscribe({
      next: (createdTask) => {
        if (version !== this.loadVersion) return;

        this.tasksSignal.update(tasks => [
          ...tasks,
          createdTask
        ]);
      },
      error: (error) => {
        console.error('Failed to create task:', error);
      }
    });
  }

  // Update existing task
  updateTask(updatedTask: Task): void {

    const { id, ...taskData } = updatedTask;
    const version = this.loadVersion;

    this.http.patch<Task>(
      `${this.apiUrl}/${id}`,
      taskData
    ).subscribe({
      next: (savedTask) => {
        if (version !== this.loadVersion) return;

        this.tasksSignal.update(tasks =>
          tasks.map(task =>
            task.id === id ? savedTask : task
          )
        );
      },
      error: (error) => {
        console.error('Failed to update task:', error);
      }
    });
  }

  // Delete task
  deleteTask(taskId: number): void {

    const version = this.loadVersion;

    this.http.delete(
      `${this.apiUrl}/${taskId}`
    ).subscribe({
      next: () => {
        if (version !== this.loadVersion) return;

        this.tasksSignal.update(tasks =>
          tasks.filter(task => task.id !== taskId)
        );
      },
      error: (error) => {
        console.error('Failed to delete task:', error);
      }
    });
  }
}
