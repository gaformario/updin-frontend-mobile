import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { colors } from "@/constants/colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const loginResponsavelSchema = z.object({
  login: z.string().min(1, "Informe e-mail ou CPF"),
  senha: z.string().min(1, "Informe a senha"),
});

type LoginResponsavelFormData = z.infer<typeof loginResponsavelSchema>;

export default function LoginResponsavelScreen() {
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginResponsavelFormData>({
    resolver: zodResolver(loginResponsavelSchema),
    defaultValues: {
      login: "",
      senha: "",
    },
  });

  async function onSubmit(data: LoginResponsavelFormData) {
    try {
      await signIn({
        login: data.login,
        senha: data.senha,
        tipo: "responsavel",
      });

      router.replace("/(protected)/responsavel/home");
    } catch {
      Alert.alert("Erro", "Não foi possível entrar.");
    }
  }

  return (
    <ScreenContainer backgroundColor={colors.brand.blue}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>

          <View style={styles.emoji}>
            <MaterialCommunityIcons
              name="account-child-circle"
              color={colors.brand.blue}
              size={50}
            />
          </View>
          <Text style={styles.title}>Área do Responsável</Text>
          <Text style={styles.subtitle}>Acesse sua conta para gerenciar</Text>

          <Controller
            control={control}
            name="login"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Email ou CPF"
                placeholder="seu@email.com"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                error={errors.login?.message}
                icon={
                  <Feather name="user" size={18} color={colors.neutral.muted} />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Senha"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.senha?.message}
                icon={
                  <Feather name="lock" size={18} color={colors.neutral.muted} />
                }
              />
            )}
          />

          <AppButton
            title="Entrar"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.secondaryLink}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.neutral.card,
    borderRadius: 28,
    padding: 24,
  },
  back: {
    fontSize: 28,
    color: colors.neutral.muted,
    marginBottom: 12,
  },
  emoji: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: colors.neutral.text,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: colors.neutral.muted,
    marginBottom: 24,
  },
  linkButton: {
    marginTop: 12,
  },
  link: {
    textAlign: "center",
    color: colors.brand.blue,
    fontWeight: "600",
  },
  secondaryLink: {
    textAlign: "center",
    color: colors.neutral.muted,
    fontWeight: "500",
  },
});
