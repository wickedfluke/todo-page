import express from 'express';
import { list, createTodo, markAsChecked, markAsNotChecked, assignToTodo } from './todo.controller';
import { CreateTodoDTO } from './todo.dto';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';
import { checkTodoOwnership } from '../../utils/ownership-middleware';

const router = express.Router();
router.use(isAuthenticated)
router.get('/', list);
router.post('/', validate(CreateTodoDTO), createTodo);
router.post('/:id/assign', assignToTodo)
router.patch('/:id/check', checkTodoOwnership, markAsChecked);
router.patch('/:id/uncheck', checkTodoOwnership, markAsNotChecked);

export default router;