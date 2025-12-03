import express from "express";
import {
  getUser,
} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const userRouter = express.Router();

userRouter.get('/user', requireAuth(), getUser);

export default userRouter;
