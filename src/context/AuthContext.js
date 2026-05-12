import { createContext, useContext, useState, useCallback } from 'react';
import { BASE_URL } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [filmmaker, setFilmmaker] = useState(() => {
    try {
      const stored = localStorage.getItem('filmmaker');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('filmmaker', JSON.stringify(data.filmmaker));
    setToken(data.access_token);
    setFilmmaker(data.filmmaker);
    return data.filmmaker;
  }, []);

  const register = useCallback(async (fields) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('filmmaker', JSON.stringify(data.filmmaker));
    setToken(data.access_token);
    setFilmmaker(data.filmmaker);
    return data.filmmaker;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('filmmaker');
    setToken(null);
    setFilmmaker(null);
  }, []);

  return (
    <AuthContext.Provider value={{ filmmaker, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
