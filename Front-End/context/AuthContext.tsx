"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";

// Tentukan tipe untuk nilai context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Buat context dengan nilai awal undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Definisikan tipe untuk props dari provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        Cookies.set("firebaseIdToken", token, {
          expires: 7,
          secure: true,
        });
      } else {
        setUser(null);
        Cookies.remove("firebaseIdToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const value = { user, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook kustom untuk menggunakan context dengan pengecekan tipe
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
