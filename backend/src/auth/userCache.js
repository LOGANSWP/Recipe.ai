import { USER_CACHE_TTL } from "../config";

const userCache = new Map();

const setUserCache = (userId, user) => {
  userCache.set(userId, { user, expires: Date.now() + USER_CACHE_TTL });
};

const getUserCache = async (userId) => {
  const cachedUser = userCache.get(userId);
  if (!cachedUser) {
    return null;
  }

  if (cachedUser.expires < Date.now()) {
    userCache.delete(userId);
    return null;
  }

  return cachedUser.user;
};

export {
  setUserCache,
  getUserCache,
};
