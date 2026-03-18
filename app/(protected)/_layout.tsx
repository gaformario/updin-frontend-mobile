import { useAuth } from "@/features/auth/context/AuthContext";
import { Redirect, Stack, usePathname } from "expo-router";

const RESPONSAVEL_HOME = "/responsavel/selecionar-adolescente";
const ADOLESCENTE_HOME = "/adolescente/home";

export default function ProtectedLayout() {
  const { session, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/home" />;
  }

  const isResponsavelRoute = pathname.startsWith("/responsavel");
  const isAdolescenteRoute = pathname.startsWith("/adolescente");

  if (session.usuario.tipo === "responsavel" && !isResponsavelRoute) {
    return <Redirect href={RESPONSAVEL_HOME as any} />;
  }

  if (
    session.usuario.tipo === "adolescente" &&
    (isResponsavelRoute || !isAdolescenteRoute)
  ) {
    return <Redirect href={ADOLESCENTE_HOME} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
