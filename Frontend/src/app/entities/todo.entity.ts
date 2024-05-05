import { User } from "./user.entity";

export interface Todo {
    id?: string;
    title: string;
    dueDate?: string;
    completed: boolean;
    expired?: boolean;
    assignedTo?: User | null;
    createdBy?: User;
}
