import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/not-found';
import { TodoService } from '../api/todo/todo.service';
import { TodoModel } from '../api/todo/todo.model';

export const checkTodoOwnership = async (req: Request, res: Response, next: NextFunction) => {
    const todoService = new TodoService(TodoModel);
    try {
        const { id } = req.params;
        if (!id) {
            throw new NotFoundError();
        }

        const createdByCurrentUser = await todoService.isTodoCreatedByCurrentUser(id, req.user?.id || "");
        const assignedToCurrentUser = await todoService.isTodoAssignedToCurrentUser(id, req.user?.id || "");
        if (!createdByCurrentUser && !assignedToCurrentUser) {
            throw new NotFoundError();
        }

        next();
    } catch (err) {
        next(err);
    }
};
