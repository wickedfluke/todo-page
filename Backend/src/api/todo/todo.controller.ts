import { NextFunction, Request, Response } from 'express';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { NotFoundError } from './../../errors/not-found';
import { CreateTodoDTO } from './todo.dto';
import { TodoModel } from './todo.model';
import { TypedRequest } from '../../utils/typed-request.interface';
import userService from '../user/user.service';
import { ValidationError } from '../../errors/validation';

const todoService = new TodoService(TodoModel);

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const includeCompleted = req.query.includeCompleted == 'true';
        const userId = req.user!.id
        const items = await todoService.listByUser(includeCompleted, userId!)
        res.json(items);
    } catch (err) {
        next(err);
    }
}

export const createTodo = async (req: TypedRequest<CreateTodoDTO>, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const todoDTO = new CreateTodoDTO();
        todoDTO.title = req.body.title;
        todoDTO.dueDate = req.body.dueDate;
        todoDTO.completed = req.body.completed;
        todoDTO.assignedTo = req.body.assignedTo;

        if (todoDTO.assignedTo) {
            const userExists = await userService.getUserById(todoDTO.assignedTo.toString());
            if (!userExists) {
                throw new ValidationError([])
            }
        }

        const newTodo: Todo = (todoDTO);
        const saved = await todoService.create(newTodo, user.id!)
        return res.status(201).json(saved);
    } catch (err) {
        next(err)
    }
};

export const markAsChecked = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updated = await todoService.markAsChecked(id);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

export const markAsNotChecked = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updated = await todoService.markAsNotChecked(id);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

export const assignToTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todoId = req.params.id;
        const assignedUserId = req.body.userId;


        const userExists = await userService.getUserById(assignedUserId);
        if (!userExists) {
            throw new ValidationError([])
        }


        const todoExists = await todoService.getTodoById(todoId);
        if (!todoExists) {
            throw new NotFoundError()
        }


        const createdByCurrentUser = await todoService.isTodoCreatedByCurrentUser(todoId, req.user?.id || "");
        if (!createdByCurrentUser) {
            throw new NotFoundError()
        }

        const assignedTodo = await todoService.assignUserToTodo(todoId, assignedUserId);
        return res.status(200).json(assignedTodo);
    } catch (error) {
        next(error);
    }
};