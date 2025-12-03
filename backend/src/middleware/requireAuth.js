import admin from "../auth/firebase";
import User from "../models/user";
import { getUserCache, setUserCache } from "../auth/userCache";

/*
If the `roles` parameter is not specified, all user types are allowed access by default.
Otherwise, the user must be of the specified types.
The `roles` parameter can be selected from the `userType` enumeration value in the `User` table.
*/
const requireAuth = async (roles = []) => {
  const chechAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    try {
      const { userId } = await admin.auth().verifyIdToken(token);

      let user = getUserCache(userId);
      if (!user) {
        user = await User.findOne({ _id: userId, isDeleted: false });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        setUserCache(userId, user);
      }
      req.user = user;

      if (roles.length > 0 && !roles.includes(user.userType)) {
        return res.status(403).json({ message: "No permission" });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };

  return chechAuth;
};

export default requireAuth;
