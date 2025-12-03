import express from "express";
import {
  postRegister,
  postLogin,
  postLogout,
} from "../controllers/authController.js";
import {
  postRegisterCelebrate,

} from "../celebrate/authPattern.js";
import requireAuth from "../middleware/requireAuth.js";
import errorHandler from "../middleware/errorHandler.js";

const authRouter = express.Router();
authRouter.use(errorHandler);

authRouter.post("/register", postRegisterCelebrate, postRegister);
authRouter.post("/login", postLogin);
authRouter.post("/logout", requireAuth(), postLogout);

export default authRouter;
