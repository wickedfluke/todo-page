import { AuthService } from '../../services/auth.service';
import { UserService } from './../../services/user.service';
import { User } from '../../entities/user.entity';
import { Component, Input } from '@angular/core';
import { Todo } from '../../entities/todo.entity';
import { TodoService } from '../../services/todo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  @Input() todo!: Todo;
  userList: any[] = [];
  users: User[] = [];
  showUserListFlag: boolean = false;
  selectedUserId: string = ''
  currentUser: any

  constructor(private todoService: TodoService, private userService: UserService, private modalService: NgbModal, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user)
    this.listuserid()
    if(this.todo.assignedTo !== null){
      this.listuserassgined()
    }
}
  listuserid(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users.filter(user => user.id !== this.currentUser?.id)
  })}

  listuserassgined(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users.filter(user => user.id !== this.currentUser?.id && user.id !== this.todo.assignedTo!.id)})
  }

  toggleCompletion(): void {

    if (!this.todo || !this.todo.id) {
      console.error('Todo ID not defined');
      return;
    }
    if (this.todo.completed) {
      this.markAsNotChecked();
    } else {
      this.markAsChecked();
    }
  }

  markAsChecked(): void {
    if (!this.todo || !this.todo.id) {
      console.error('Todo ID not defined');
      return;
    }
    this.todoService.markAsChecked(this.todo.id).subscribe(
      (updatedTodo: Todo) => {
        this.todo.completed = true;
      },
      (error) => {
        console.error('Error during the operation:', error);
      }
    );
  }

  markAsNotChecked(): void {
    if (!this.todo || !this.todo.id) {
      console.error('Todo ID not defined');
      return;
    }
    this.todoService.markAsNotChecked(this.todo.id).subscribe(
      (updatedTodo: Todo) => {
        this.todo.completed = false;
      },
      (error) => {
        console.error('Error during the operation:', error);
      }
    );
  }

  assignTodoToUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      console.error('User not found');
      return;
    }

    this.todoService.assignTodo(this.todo.id!, userId).subscribe(
      () => {
        this.todo.assignedTo = user;
        this.showUserListFlag = false;
        this.listuserassgined()
      },
      (error) => {
        console.error('Error assigning todo:', error);
      }
    );
  }

  openAssignTodoModal(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(`Modal closed with result: ${result}`);

    }, (reason) => {
      console.log(`Modal dismissed with reason: ${reason}`);
    });
  }

  onSubmit(): void {

    if (!this.selectedUserId) {
      console.error('User not selected');
      return;
    }

    this.modalService.dismissAll();

    if (this.selectedUserId === 'none') {
      this.todo.assignedTo = null;
      this.selectedUserId = '';
      this.listuserid()
      return; 
    }

    this.todoService.assignTodo(this.todo.id!, this.selectedUserId).subscribe(
      (todo: Todo) => {
        console.log('Todo assigned successfully:', todo);

        this.assignTodoToUser(this.selectedUserId);

        this.selectedUserId = '';
      },
      (error) => {
        console.error('Error assigning todo:', error);
      }
    );
  }
  isTodoCreatedByCurrentUser(): boolean {
    return this.currentUser && this.todo.createdBy && this.todo.createdBy.id === this.currentUser.id;
  }
}