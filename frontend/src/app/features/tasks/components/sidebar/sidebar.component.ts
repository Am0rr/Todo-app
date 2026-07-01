import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryResponse } from '../../../../core/models/category.model';
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
  @Output() categorySelected = new EventEmitter<{
    id: string | null;
    name: string;
    description?: string;
  }>();
  @Output() categoryAdded = new EventEmitter<void>();
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
  showEditCategoryModal = false;
  editingCategory: CategoryResponse | null = null;
  editCategory = { name: '', description: '' };

  private extractErrorMessage(err: any, fallback: string): string {
    const errors = err?.error?.errors;
    if (errors) {
      const firstKey = Object.keys(errors)[0];
      const firstMessage = firstKey ? errors[firstKey]?.[0] : undefined;
      if (firstMessage) return firstMessage;
    }
    return err?.error?.title ?? err?.error?.message ?? fallback;
  }

  onAddCategory() {
    const name = this.newCategory.name.trim();

    if (!name) {
      this.addCategoryError = 'Category name cannot be empty.';
      this.cdr.markForCheck();
      return;
    }

    this.addCategoryError = '';

    this.categoryService
      .create({
        name,
        description: this.newCategory.description.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.showAddCategoryModal = false;
          this.newCategory = { name: '', description: '' };
          this.categoryAdded.emit();
        },
        error: (err) => {
          this.addCategoryError = this.extractErrorMessage(err, 'Failed to create category.');
          this.cdr.markForCheck();
        },
      });
  }

  onEditCategory() {
    if (!this.editingCategory) return;

    const name = this.editCategory.name.trim();

    if (!name) {
      this.editCategoryError = 'Category name cannot be empty.';
      this.cdr.markForCheck();
      return;
    }

    this.editCategoryError = '';

    this.categoryService
      .update(this.editingCategory.id, {
        name,
        description: this.editCategory.description.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.closeEditCategoryModal();
          this.categoryEdited.emit();
        },
        error: (err) => {
          this.editCategoryError = this.extractErrorMessage(err, 'Failed to update category.');
          this.cdr.markForCheck();
        },
      });
  }

  onDeleteCategory(id: string) {
    this.deleteCategoryError = '';
    this.categoryService.delete(id).subscribe({
      next: () => this.categoryDeleted.emit(id),
      error: (err) => {
        alert(this.extractErrorMessage(err, 'Failed to delete category.'));
        this.cdr.markForCheck();
      },
    });
  }

  openEditCategoryModal(category: CategoryResponse) {
    this.editingCategory = category;
    this.editCategory = { name: category.name, description: category.description ?? '' };
    this.showEditCategoryModal = true;
    this.cdr.markForCheck();
  }

  closeEditCategoryModal() {
    this.showEditCategoryModal = false;
    this.editingCategory = null;
  }
}
