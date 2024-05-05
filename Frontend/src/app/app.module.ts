import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TodoComponent } from './components/todo/todo.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoPageComponent } from './pages/todo-page/todo-page.component';
import { LoginComponent } from './pages/login/login.component';
import { NavUserComponent } from './components/nav-user/nav-user.component';
import { IfAuthenticatedDirective } from './directives/if-authenticated.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './utils/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        TodoComponent,
        TodoListComponent,
        TodoPageComponent,
        LoginComponent,
        NavUserComponent,
        IfAuthenticatedDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }