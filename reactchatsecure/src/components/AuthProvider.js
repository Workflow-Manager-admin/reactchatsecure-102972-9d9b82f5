import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChange } from "../firebase";

// PUBLIC_INTERFACE
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** AuthProvider supplies current user via context. */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook for easy accesss to user/auth state. */
  return useContext(AuthContext);
}
