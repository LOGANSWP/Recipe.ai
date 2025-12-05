import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { message } from "antd";

import api from "./index";
import auth from "../auth/firebase";

const register = async (name, email, password) => {
  let firebaseUser = null;
  try {
    firebaseUser = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    message.error("Register fail");
    throw err;
  }

  const registerData = {
    id: firebaseUser.user.uid,
    name,
    email,
  };
  
  try {
    // IMPORTANT: Sign out IMMEDIATELY to prevent AuthContext from fetching non-existent user
    // This prevents the race condition where Firebase auth state changes before backend creates user
    await signOut(auth);
    
    // Now register user in backend (after sign out)
    await api.post(`/auth/register`, registerData);
    
    // Wait a bit for the sign out to propagate through Firebase
    // This ensures the auth state is fully cleared
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (err) {
    // If registration fails, ensure user is signed out
    try {
      await signOut(auth);
    } catch (signOutErr) {
      console.error("Failed to sign out after error:", signOutErr);
    }
    throw err;
  }
};

const login = async (email, password) => {
  let firebaseUser = null;
  try {
    firebaseUser = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    message.error("Login fail: Username or password incorrect");
    throw err;
  }

  const loginData = { id: firebaseUser.user.uid };
  await api.post(`/auth/login`, loginData);
};

const logout = async () => {
  try {
    signOut(auth);
  } catch (err) {
    message.error("Logout fail");
    throw err;
  }

  await api.post(`/auth/logout`);
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
