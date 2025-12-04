import express from "express";

import {
  getMyUser,
  updateMyProfile,
} from '../controllers/userController.js';
import { putMyProfileCelebrate } from '../celebrate/userPattern.js';
import requireAuth from '../middleware/requireAuth.js';

const userRouter = express.Router();

userRouter.get('/my/user', requireAuth(), getMyUser);
userRouter.put('/my/profile', requireAuth(), putMyProfileCelebrate, updateMyProfile);

export default userRouter;
