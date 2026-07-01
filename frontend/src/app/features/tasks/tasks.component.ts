import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, shareReplay, switchMap, tap } from 'rxjs';
import {
  TaskFilterModel,
  TaskResponse,
  TaskItemStatus,
  TaskPagedResponse,
} from '../../core/models/task.model';
import { CategoryResponse } from '../../core/models/category.model';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TaskFilterBarComponent } from './components/task-filter-bar/task-filter-bar.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    AsyncPipe,
    NavbarComponent,
    SidebarComponent,
    TaskFilterBarComponent,
    TaskListComponent,
    TaskModalComponent,
  ],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks$!: Observable<TaskPagedResponse>;
  categories$!: Observable<CategoryResponse[]>;

  selectedCategoryId: string | null = null;
  selectedCategoryName = 'All Tasks';

  modalTask?: TaskResponse;
  showTaskModal = false;

  private filterSubject = new BehaviorSubject<TaskFilterModel>({ pageNumber: 1, pageSize: 10 });
  private categoriesSubject = new BehaviorSubject<CategoryResponse[]>([]);

  selectedCategoryDescription: string | null = null;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.categories$ = this.categoriesSubject.asObservable();
    this.reloadCategories();

    this.tasks$ = this.filterSubject.pipe(
      switchMap((filter) => this.taskService.getPaged(filter)),
      shareReplay(1),
    );
  }

  onCategorySelected(event: { id: string | null; name: string; description?: string }) {
    this.selectedCategoryId = event.id;
    this.selectedCategoryName = event.name;
    this.selectedCategoryDescription = event.description ?? null;
    this.patchFilter({ categoryId: event.id ?? undefined, pageNumber: 1 });
  }

  onSearchChange(searchTerm: string | undefined) {
    this.patchFilter({ searchTerm, pageNumber: 1 });
  }

  onStatusChange(status: TaskItemStatus | undefined) {
    this.patchFilter({ status, pageNumber: 1 });
  }

  onPageChange(page: number) {
    this.patchFilter({ pageNumber: page });
  }

  openCreateModal() {
    this.modalTask = undefined;
    this.showTaskModal = true;
  }

  openEditModal(task: TaskResponse) {
    this.modalTask = task;
    this.showTaskModal = true;
  }

  closeModal() {
    this.showTaskModal = false;
  }

  onTaskSaved() {
    this.closeModal();
    this.reload();
    this.reloadCategories();
  }

  onDeleteTask(id: string) {
    this.taskService.delete(id).subscribe({
      next: () => {
        this.reload();
        this.reloadCategories();
      },
    });
  }

  private previousStatuses = new Map<string, TaskItemStatus>();

  onToggleStatus(task: TaskResponse) {
    let status: TaskItemStatus;
    if (task.status === 'Done') {
      status = this.previousStatuses.get(task.id) ?? 'Todo';
    } else {
      this.previousStatuses.set(task.id, task.status);
      status = 'Done';
    }
    this.taskService.update(task.id, { status }).subscribe({
      next: () => {
        this.reload();
        this.reloadCategories();
      },
    });
  }

  onCategoryAdded() {
    this.reloadCategories();
  }

  onCategoryEdited() {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categoriesSubject.next(categories);
        const updated = categories.find((c) => c.id === this.selectedCategoryId);
        if (updated) {
          this.selectedCategoryName = updated.name;
          this.selectedCategoryDescription = updated.description ?? null;
        }
      },
    });
  }

  onCategoryDeleted(id: string) {
    this.reloadCategories();
    if (this.selectedCategoryId === id) {
      this.onCategorySelected({ id: null, name: 'All Tasks' });
    }
  }

  private patchFilter(patch: Partial<TaskFilterModel>) {
    this.filterSubject.next({ ...this.filterSubject.value, ...patch });
  }

  private reload() {
    this.filterSubject.next(this.filterSubject.value);
  }

  private reloadCategories() {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categoriesSubject.next(categories),
    });
  }

  onPageSizeChange(pageSize: number) {
    const currentFilter = this.filterSubject.value;

    if (currentFilter.pageSize === pageSize) {
      return;
    }

    this.patchFilter({ pageSize, pageNumber: 1 });
  }
}
