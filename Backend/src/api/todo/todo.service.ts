import { Todo } from './todo.entity';
import { TodoModel } from './todo.model';
import { NotFoundError } from '../../errors/not-found';
import { CreateTodoDTO } from './todo.dto';
import { Types } from 'mongoose';

export class TodoService {
    constructor(private todoModel: typeof TodoModel) { }

    async listByUser(includeCompleted: boolean, userId: string) {
        let query: any = { $or: [{ createdBy: userId }, { assignedTo: userId }] };
        if (!includeCompleted) {
            query.completed = false;
        }
        const items = await TodoModel.find(query).sort({ dueDate: 1 }).populate('createdBy assignedTo');

        const sortedItems = items.sort((a, b) => {

            const dateA = a.dueDate ? new Date(a.dueDate) : null;
            const dateB = b.dueDate ? new Date(b.dueDate) : null;

            if (!dateA && dateB) {
                return 1;
            } else if (dateA && !dateB) {
                return -1;
            } else if (dateA && dateB) {
                return dateA.getTime() - dateB.getTime();
            } else {
                return 0;
            }
        });

        return sortedItems;
    }

    async create(todoDTO: CreateTodoDTO, userId: string): Promise<Todo> {
        const createdBy = new Types.ObjectId(userId);
        const newTodo: Todo = {
            ...todoDTO,
            createdBy: createdBy
        }
        const createdTodo = new this.todoModel(newTodo);
        return (await createdTodo.save()).populate('createdBy assignedTo');

    }

    async markAsChecked(id: string): Promise<Todo | null> {
        const updatedTodo = await this.todoModel.findByIdAndUpdate(id, { completed: true }, { new: true }).exec();
        if (!updatedTodo) {
            throw new NotFoundError();
        }
        return updatedTodo;
    }

    async markAsNotChecked(id: string): Promise<Todo | null> {
        const updatedTodo = await this.todoModel.findByIdAndUpdate(id, { completed: false }, { new: true }).exec();
        if (!updatedTodo) {
            throw new NotFoundError();
        }
        return updatedTodo;
    }

    async getTodoById(todoId: string) {
        return TodoModel.findById(todoId);

    };

    async isTodoCreatedByCurrentUser(todoId: string, userId: string) {
        const todo = await TodoModel.findById(todoId);
        return todo && todo.createdBy?.toString() == userId;
    };

    async isTodoAssignedToCurrentUser(todoId: string, userId: string) {
        const todo = await TodoModel.findById(todoId);
        return todo && todo.assignedTo?.toString() == userId;
    };

    async assignUserToTodo(todoId: string, assignedUserId: string) {
        const todo = await TodoModel.findById(todoId);
        if (!todo) {
            throw new NotFoundError()
        }

        const assignedUserObjectId = new Types.ObjectId(assignedUserId);
        todo.assignedTo = assignedUserObjectId;
        todo.save();

        return todo.populate('createdBy assignedTo');
    };

}
