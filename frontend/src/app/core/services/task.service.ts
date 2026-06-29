import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  CreateTaskRequest,
  TaskFilterModel,
  TaskPagedResponse,
  TaskResponse,
  UpdateTaskRequest,
} from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  create(request: CreateTaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, request);
  }

  getById(id: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(this.apiUrl);
  }

  getPaged(model: TaskFilterModel): Observable<TaskPagedResponse> {
    return this.http.get<TaskPagedResponse>(`${this.apiUrl}/paged`, {
      params: {
        pageNumber: model.pageNumber,
        pageSize: model.pageSize,
        ...(model.searchTerm && { searchTerm: model.searchTerm }),
        ...(model.categoryId && { categoryId: model.categoryId }),
        ...(model.status && { status: model.status }),
      },
    });
  }

  update(id: string, request: UpdateTaskRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
