import { User } from './../../entities/user.entity';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../../entities/todo.entity';
import { TodoService } from '../../services/todo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.css']
})
export class TodoPageComponent implements OnInit {
  todos: Todo[] = [];
  users: User[] = [];
  includeCompleted: boolean = false;
  newTodo: Todo = { title: '', dueDate: undefined, completed: false, assignedTo: null };
  formSubmittedSuccessfully: boolean = false;
  currentUser: any;
  
  constructor(private todoService: TodoService, private modalService: NgbModal, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTodos();
    this.loadUsers();
    this.authService.currentUser$.subscribe(user => this.currentUser = user)
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users.filter(user => user.id !== this.currentUser?.id);
      },
      error => {
        console.error('Error during loading users:', error);
      }
    );
  }

  loadTodos(): void {
    this.todoService.getTodos(this.includeCompleted).subscribe(
      (todos: Todo[]) => {
        this.todos = todos;
      },
      (error) => {
        console.error('Error during todos loading:', error);
      }
    );
  }

  toggleIncludeCompleted(event: any): void {
    this.includeCompleted = event.target.checked;
    this.loadTodos();
  }

  openAddTodoModal(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(`Modal closed with result: ${result}`);

    }, (reason) => {
      console.log(`Modal dismissed with reason: ${reason}`);
    });
  }

  onSubmit(): void {
    if (this.newTodo.title) {
      this.formSubmittedSuccessfully = true; 
      this.todoService.addTodo(this.newTodo).subscribe(
        (todo: Todo) => {
          console.log('New todo added successfully:', todo);

          this.modalService.dismissAll();
          this.loadTodos();

          this.newTodo = { title: '', dueDate: undefined, completed: false, assignedTo: null };
        },
        (error) => {
          console.error('Error during todo posting:', error);
        }
      );
    } else {
      console.error('todo title is required!');
      this.formSubmittedSuccessfully = false;
    }
  }
}
