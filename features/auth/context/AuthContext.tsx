import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  restoreSession,
  signInRequest,
} from "@/features/auth/services/auth";
import type { AuthSession, LoginPayload } from "@/features/auth/types";
import {
  setApiAuthToken,
  subscribeToUnauthorized,
} from "@/services/api-client";
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

  const clearSession = useCallback(async () => {
    setApiAuthToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const persistSession = useCallback(async (nextSession: AuthSession) => {
    setApiAuthToken(nextSession.token);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const storedSession = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedSession) {
        const parsedSession = JSON.parse(storedSession) as AuthSession;
        const restoredSession = await restoreSession(parsedSession);

        await persistSession(restoredSession);
      }
    } catch {
      await clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession, persistSession]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    const unsubscribe = subscribeToUnauthorized(() => {
      void clearSession();
    });

    return unsubscribe;
  }, [clearSession]);

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      const authSession = await signInRequest(payload);
      await persistSession(authSession);
    },
    [persistSession],
  );

  const selectAdolescente = useCallback(
    async (adolescente: AdolescenteResumo) => {
      if (!session) {
        return;
      }

      const updatedSession: AuthSession = {
        ...session,
        adolescenteSelecionado: adolescente,
      };

      await persistSession(updatedSession);
    },
    [persistSession, session],
  );

  const signOut = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      session,
      loading,
      signIn,
      selectAdolescente,
      signOut,
    }),
    [loading, selectAdolescente, session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}