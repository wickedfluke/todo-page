import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { TodoPageComponent } from './pages/todo-page/todo-page.component';
import { TodoComponent } from './components/todo/todo.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/todos',
        pathMatch: 'full'
    },
    {
        path: 'login',
        canActivate: [LoginGuard],
        component: LoginComponent
    },
    {
        path: 'todos',
        canActivate: [authGuard],
        component: TodoPageComponent,
        children: [
            {
                path: '',
                component: TodoComponent,
                runGuardsAndResolvers: 'paramsOrQueryParamsChange'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
