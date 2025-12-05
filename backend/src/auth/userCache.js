import { USER_CACHE_TTL } from "../config.js";

const userCache = new Map();

const setUserCache = (userId, user) => {
  userCache.set(userId, { user, expires: Date.now() + USER_CACHE_TTL });
};

const getUserCache = (userId) => {
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

const clearUserCache = (userId) => {
  userCache.delete(userId);
};

export {
  setUserCache,
  getUserCache,
  clearUserCache,
};
