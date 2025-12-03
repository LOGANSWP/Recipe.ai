import express from "express";

import {
  getMyUser,
} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const userRouter = express.Router();

userRouter.get('/my/user', requireAuth(), getMyUser);

export default userRouter;
