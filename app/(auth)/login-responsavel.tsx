import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { colors } from "@/constants/colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { loginResponsavelStyles } from "@/styles/login-responsavel";
import { getErrorMessage } from "@/utils/errors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const RESPONSAVEL_HOME = "/responsavel/selecionar-adolescente";
const HOME_ROUTE = "/home";

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

      router.replace(RESPONSAVEL_HOME as any);
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    }
  }

  return (
    <ScreenContainer backgroundColor={colors.brand.blue}>
      <View style={loginResponsavelStyles.wrapper}>
        <View style={loginResponsavelStyles.card}>
          <TouchableOpacity
            onPress={() => router.replace(HOME_ROUTE)}
            disabled={isSubmitting}
          >
            <Text style={loginResponsavelStyles.back}>←</Text>
          </TouchableOpacity>

          <View style={loginResponsavelStyles.emoji}>
            <MaterialCommunityIcons
              name="account-child-circle"
              color={colors.brand.blue}
              size={50}
            />
          </View>

          <Text style={loginResponsavelStyles.title}>Área do Responsável</Text>
          <Text style={loginResponsavelStyles.subtitle}>
            Acesse sua conta para gerenciar
          </Text>

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

          <TouchableOpacity
            style={loginResponsavelStyles.linkButton}
            disabled={isSubmitting}
          >
            <Text style={loginResponsavelStyles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginResponsavelStyles.linkButton}
            disabled={isSubmitting}
          >
            <Text style={loginResponsavelStyles.secondaryLink}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
