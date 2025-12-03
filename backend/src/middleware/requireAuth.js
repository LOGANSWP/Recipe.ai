import admin from "../auth/firebase.js";
import { getUserCache, setUserCache } from "../auth/userCache.js";
import User from "../models/user.js";

// If the `roles` parameter is not specified, all user types are allowed access by default.
// Otherwise, the user must be of the specified types.
// The `roles` parameter can be selected from the `userType` enumeration value in the `User` table.
const requireAuth = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const { uid } = await admin.auth().verifyIdToken(token);

      let user = await getUserCache(uid);
      if (!user) {
        user = await User.findOne({ firebaseId: uid });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        setUserCache(uid, user);
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
};

export default requireAuth;
