import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserRequest, UserResponse } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private readonly apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) {}

    getById(id: string): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
    }

    getByEmail(email: string): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.apiUrl}/email?email=${email}`);
    }

    getAll(): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(this.apiUrl);
    }

    update(id: string, request: UpdateUserRequest): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}`, request);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}