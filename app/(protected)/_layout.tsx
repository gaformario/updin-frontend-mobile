import { useAuth } from "@/features/auth/context/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
