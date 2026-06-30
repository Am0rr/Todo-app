import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryResponse, CreateCategoryRequest } from '../../../../core/models/category.model';
import { LucideAngularModule, List, Folder, Pencil } from 'lucide-angular';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  host: { class: 'contents' },
})
export class SidebarComponent {
  @Input({ required: true }) categories!: CategoryResponse[];
  @Input() selectedCategoryId: string | null = null;

  @Output() categorySelected = new EventEmitter<{ id: string | null; name: string }>();
  @Output() categoryAdded = new EventEmitter<CreateCategoryRequest>();
  @Output() categoryDeleted = new EventEmitter<string>();
  @Output() categoryEdited = new EventEmitter<void>();

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  readonly List = List;
  readonly Folder = Folder;
  readonly Pencil = Pencil;

  showAddCategoryModal = false;
  newCategory = { name: '', description: '' };

  addCategoryError = '';
  editCategoryError = '';
  deleteCategoryError = '';

  onAddCategory() {
    this.addCategoryError = '';
    this.categoryService
      .create({
        name: this.newCategory.name,
        description: this.newCategory.description || undefined,
      })
      .subscribe({
        next: () => {
          this.showAddCategoryModal = false;
          this.newCategory = { name: '', description: '' };
          this.categoryAdded.emit();
        },
        error: (err) => {
          this.addCategoryError =
            err.error?.errors?.[0] ?? err.error?.message ?? 'Failed to create category.';
        },
      });
  }

  showEditCategoryModal = false;
  editingCategory: CategoryResponse | null = null;
  editCategory = { name: '', description: '' };

  openEditCategoryModal(category: CategoryResponse) {
    this.editingCategory = category;
    this.editCategory = { name: category.name, description: category.description ?? '' };
    this.showEditCategoryModal = true;
  }

  closeEditCategoryModal() {
    this.showEditCategoryModal = false;
    this.editingCategory = null;
  }

  onEditCategory() {
    if (!this.editingCategory) return;
    this.editCategoryError = '';

    this.categoryService
      .update(this.editingCategory.id, {
        name: this.editCategory.name,
        description: this.editCategory.description || undefined,
      })
      .subscribe({
        next: () => {
          this.closeEditCategoryModal();
          this.categoryEdited.emit();
        },
        error: (err) => {
          this.editCategoryError =
            err.error?.errors?.[0] ?? err.error?.message ?? 'Failed to update category.';
          this.cdr.markForCheck();
        },
      });
  }

  deleteCategory(id: string) {
    this.deleteCategoryError = '';
    this.categoryService.delete(id).subscribe({
      next: () => this.categoryDeleted.emit(id),
      error: (err) => {
        alert(err.error?.message ?? 'Failed to delete category.');
      },
    });
  }
}
