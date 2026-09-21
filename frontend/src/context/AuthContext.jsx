import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fieldwatch_user');
    return saved ? JSON.parse(saved) : { id: 'agronomist_01', name: 'Dr. Anita Sharma', role: 'agronomist' };
  });

  const login = (role = 'agronomist', name = 'Dr. Anita Sharma') => {
    const userObj = { id: `${role}_${Date.now()}`, name, role };
    setUser(userObj);
    localStorage.setItem('fieldwatch_user', JSON.stringify(userObj));
    return { success: true, user: userObj };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fieldwatch_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
