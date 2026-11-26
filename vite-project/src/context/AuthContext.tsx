import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
interface AuthContextType {
 token: string | null;
 signIn: (token: string) => void;
 signOut: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
 const [token, setToken] = useState<string | null>(
 () => localStorage.getItem('token')
 );
 const signIn = (newToken: string) => {
 localStorage.setItem('token', newToken);
 setToken(newToken);
 };
 const signOut = () => {
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 setToken(null);
 };
 return <AuthContext.Provider value={{ token, signIn, signOut }}>
 {children}
 </AuthContext.Provider>;
}
export function useAuth() {
 const auth = useContext(AuthContext);
 if (!auth) throw new Error('Falta AuthProvider');
 return auth;
}
