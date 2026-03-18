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
import type { AdolescenteResumo } from "@/types/painel-financeiro";

type AuthContextData = {
  session: AuthSession | null;
  loading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  selectAdolescente: (adolescente: AdolescenteResumo) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const STORAGE_KEY = "@updin:session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadSession();
  }, []);

  async function loadSession() {
    try {
      const storedSession = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedSession) {
        const parsedSession = JSON.parse(storedSession) as Partial<AuthSession>;

        setSession({
          ...parsedSession,
          adolescenteSelecionado: parsedSession.adolescenteSelecionado ?? null,
        } as AuthSession);
      }
    } catch (error) {
      console.error("Erro ao carregar sessao", error);
    } finally {
      setLoading(false);
    }
  }

  async function persistSession(nextSession: AuthSession) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }

  async function signIn(payload: LoginPayload) {
    const response = await signInRequest(payload);

    const authSession: AuthSession = {
      token: response.token,
      usuario: response.usuario,
      perfil: response.perfil,
      adolescenteSelecionado: null,
    };

    await persistSession(authSession);
  }

  async function selectAdolescente(adolescente: AdolescenteResumo) {
    if (!session) {
      return;
    }

    const updatedSession: AuthSession = {
      ...session,
      adolescenteSelecionado: adolescente,
    };

    await persistSession(updatedSession);
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
      selectAdolescente,
      signOut,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
