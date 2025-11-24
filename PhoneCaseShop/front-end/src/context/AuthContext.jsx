import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);