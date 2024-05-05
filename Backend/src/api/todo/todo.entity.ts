import { Types } from "mongoose";

export interface Todo {
    id?: string;
    title: string;
    dueDate?: string;
    completed: boolean;
    createdBy?: Types.ObjectId;
    assignedTo?: Types.ObjectId;
}
