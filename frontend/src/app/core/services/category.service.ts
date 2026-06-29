import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  create(request: CreateCategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, request);
  }

  getById(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.apiUrl);
  }

  update(id: string, request: UpdateCategoryRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
