import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFilterModel, TaskItemStatus, TaskPagedResponse } from '../../core/models/task.model';
import { CategoryResponse } from '../../core/models/category.model';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, debounceTime, Observable, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks$!: Observable<TaskPagedResponse>;
  categories$!: Observable<CategoryResponse[]>;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
  ) {}

  private filterSubject = new BehaviorSubject<TaskFilterModel>({
    pageNumber: 1,
    pageSize: 10,
  });

  ngOnInit() {
    this.categories$ = this.categoryService.getAll().pipe(shareReplay(1));

    this.tasks$ = this.filterSubject.pipe(
      debounceTime(300),
      switchMap((filter) => this.taskService.getPaged(filter)),
      shareReplay(1),
    );
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value || undefined;
    this.filterSubject.next({
      ...this.filterSubject.value,
      searchTerm,
      pageNumber: 1,
    });
  }

  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterSubject.next({
      ...this.filterSubject.value,
      status: value ? (value as TaskItemStatus) : undefined,
      pageNumber: 1,
    });
  }

  loadTasks() {
    this.filterSubject.next(this.filterSubject.value);
  }

  deleteTask(id: string) {
    this.taskService.delete(id).subscribe({
      next: () => this.loadTasks(),
    });
  }
}
