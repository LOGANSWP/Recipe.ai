import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import api from "./index";
import auth from "../auth/firebase";

const register = async (name, email, password) => {
  try {
    const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);

    const registerData = {
      id: firebaseUser.user.uid,
      name,
      email,
    };
    await api.post(`/api/auth/register`, registerData);
  } catch (err) {
    console.error(err);
  }
};

const login = async (email, password) => {
  try {
    const firebaseUser = await signInWithEmailAndPassword(auth, email, password);

    const loginData = { id: firebaseUser.user.uid };
    await api.post(`/api/auth/login`, loginData);
  } catch (err) {
    console.error(err);
  }
};

const logout = async () => {
  try {
    signOut(auth);

    await api.post(`/api/auth/logout`);
  } catch (err) {
    console.error(err);
  }
};

const getIdToken = async () => {
  return auth.currentUser ? await auth.currentUser.getIdToken() : null;
};

export {
  register,
  login,
  logout,
  getIdToken,
};
