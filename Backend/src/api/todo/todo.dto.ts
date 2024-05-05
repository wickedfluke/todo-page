import { IsString, IsOptional, IsDateString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTodoDTO {
    @IsString()
    title: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    completed: boolean

    @IsMongoId()
    @IsOptional()
    assignedTo?: Types.ObjectId;
}
