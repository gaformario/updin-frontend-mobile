import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { signInRequest } from "@/features/auth/services/auth";
import type { AuthSession, LoginPayload } from "@/features/auth/types";

type AuthContextData = {
  session: AuthSession | null;
  loading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const STORAGE_KEY = "@updin:session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const storedSession = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedSession) {
        setSession(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error("Erro ao carregar sessao", error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(payload: LoginPayload) {
    const response = await signInRequest(payload);

    const authSession: AuthSession = {
      token: response.token,
      usuario: response.usuario,
      perfil: response.perfil,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authSession));
    setSession(authSession);
  }

  async function signOut() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  const value = useMemo(
    () => ({
      session,
      loading,
      signIn,
      signOut,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
