import express from 'express';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';
import { me } from './user.controller';
import { list } from './user.controller';

const router = express.Router();

router.use(isAuthenticated)
router.get('/', list)
router.get('/me', me);

export default router;