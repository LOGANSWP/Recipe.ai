import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import auth from "./firebase";
import { getMyUser } from "../api/userApi";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      const response = await getMyUser();
      setUserData(response.data);
    } catch (error) {
      // Silently handle error - don't show message to user
      // This can happen during registration flow
      console.error("Failed to fetch user data:", error);
      setUserData(null);
    }
  };

  // Update user data (called when profile is updated)
  const updateUserData = (newData) => {
    setUserData(newData);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoadingUser(true);
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        await fetchUserData();
      } else {
        setFirebaseUser(null);
        setUserData(null);
      }
      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      firebaseUser, 
      userData, 
      isLoadingUser,
      updateUserData,
      refreshUserData: fetchUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export {
  AuthProvider,
  useAuth,
};
