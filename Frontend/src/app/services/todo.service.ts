import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../entities/todo.entity';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = '/api/todos';

  constructor(private http: HttpClient) { }

  getTodos(includeCompleted: boolean): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl, { params: { includeCompleted: includeCompleted.toString() } });
  }

  addTodo(newTodo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, newTodo);
  }

  markAsChecked(id: string): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/check`, {});
  }

  markAsNotChecked(id: string): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/uncheck`, {});
  }
  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  assignTodo(todoId: string, userId: string): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/${todoId}/assign`, { userId });
  }
}
