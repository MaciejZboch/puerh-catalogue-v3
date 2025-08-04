import express from 'express';
const router = express.Router();
import catchAsync from '../utilities/catchAsync';
import { isLoggedIn, isAuthor, validateTea } from '../middleware';
import { editForm } from '../controllers/tea';

router.get("/:id", isLoggedIn, isAuthor, validateTea, catchAsync(editForm));

export default router;
