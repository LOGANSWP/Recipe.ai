import express from "express";

import {
  postRegister,
  postLogin,
  postLogout,
} from "../controllers/authController.js";
import {
  postRegisterCelebrate,
  postLoginCelebrate,
} from "../celebrate/authPattern.js";
import requireAuth from "../middleware/requireAuth.js";

const authRouter = express.Router();

authRouter.post("/register", postRegisterCelebrate, postRegister);
authRouter.post("/login", postLoginCelebrate, postLogin);
authRouter.post("/logout", requireAuth(), postLogout);

export default authRouter;
