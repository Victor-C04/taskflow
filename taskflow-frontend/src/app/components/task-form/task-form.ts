
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnChanges {

  @Input() task: Task | null = null;

  @Output() save = new EventEmitter<Omit<Task, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;

  statuses: TaskStatus[] = [
    'To Do',
    'In Progress',
    'In Review',
    'Completed'
  ];

  priorities: TaskPriority[] = [
    'Low',
    'Medium',
    'High'
  ];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      status: ['To Do', Validators.required],
      priority: ['Medium', Validators.required],
      assignedTo: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      if (this.task) {
        this.taskForm.patchValue(this.task);
      } else {
        this.taskForm.reset({
          title: '',
          description: '',
          status: 'To Do',
          priority: 'Medium',
          assignedTo: '',
          dueDate: ''
        });
      }
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.taskForm.getRawValue());
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
