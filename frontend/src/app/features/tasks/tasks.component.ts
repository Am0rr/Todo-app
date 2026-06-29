import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFilterModel, TaskItemStatus, TaskPagedResponse } from '../../core/models/task.model';
import { CategoryResponse } from '../../core/models/category.model';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { AsyncPipe } from '@angular/common';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
  shareReplay,
  Subject,
  switchMap,
} from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { LucideAngularModule, List, Folder, Plus } from 'lucide-angular';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, AsyncPipe, NavbarComponent, LucideAngularModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks$!: Observable<TaskPagedResponse>;
  categories$!: Observable<CategoryResponse[]>;
  readonly List = List;
  readonly Folder = Folder;
  readonly Plus = Plus;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
  ) {}

  private filterSubject = new BehaviorSubject<TaskFilterModel>({
    pageNumber: 1,
    pageSize: 10,
  });

  private searchSubject = new Subject<string | undefined>();

  showAddTaskModal = false;
  newTask = {
    title: '',
    description: '',
    categoryId: '',
    status: 'Todo' as TaskItemStatus,
  };

  showAddCategoryModal = false;
  newCategory = {
    name: '',
    description: '',
  };

  ngOnInit() {
    this.categories$ = this.categoryService.getAll().pipe(shareReplay(1));

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.filterSubject.next({
        ...this.filterSubject.value,
        searchTerm,
        pageNumber: 1,
      });
    });

    this.tasks$ = this.filterSubject.pipe(
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

  selectedCategoryId: string | null = null;
  selectedCategoryName: string = 'All Tasks';

  filterByCategory(categoryId: string | null, categoryName?: string) {
    this.selectedCategoryId = categoryId;
    this.selectedCategoryName = categoryName ?? 'All Tasks';
    this.filterSubject.next({
      ...this.filterSubject.value,
      categoryId: categoryId ?? undefined,
      pageNumber: 1,
    });
  }

  openAddTaskModal() {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal() {
    this.showAddTaskModal = false;
    this.newTask = { title: '', description: '', categoryId: '', status: 'Todo' };
  }

  addTask() {
    this.taskService
      .create({
        title: this.newTask.title,
        description: this.newTask.description || undefined,
        categoryId: this.newTask.categoryId || undefined,
        status: this.newTask.status,
      })
      .subscribe({
        next: () => {
          this.closeAddTaskModal();
          this.loadTasks();
        },
      });
  }

  openAddCategoryModal() {
    this.showAddCategoryModal = true;
  }

  closeAddCategoryModal() {
    this.showAddCategoryModal = false;
    this.newCategory = { name: '', description: '' };
  }

  addCategory() {
    this.categoryService
      .create({
        name: this.newCategory.name,
        description: this.newCategory.description || undefined,
      })
      .subscribe({
        next: () => {
          this.closeAddCategoryModal();
          this.categories$ = this.categoryService.getAll().pipe(shareReplay(1));
        },
      });
  }

  deleteCategory(id: string, event: Event) {
    event.stopPropagation();

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories$ = this.categoryService.getAll().pipe(shareReplay(1));
        if (this.selectedCategoryId === id) {
          this.filterByCategory(null);
        }
      },
    });
  }
}
