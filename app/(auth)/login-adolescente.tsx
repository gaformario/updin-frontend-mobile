import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { colors } from "@/constants/colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { loginAdolescenteStyles } from "@/styles/login-adolescente";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const HOME_ROUTE = "/home";

const loginAdolescenteSchema = z.object({
  login: z.string().min(1, "Informe seu usuário"),
  senha: z.string().min(1, "Informe a senha"),
});

type LoginAdolescenteFormData = z.infer<typeof loginAdolescenteSchema>;

export default function LoginAdolescenteScreen() {
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginAdolescenteFormData>({
    resolver: zodResolver(loginAdolescenteSchema),
    defaultValues: {
      login: "",
      senha: "",
    },
  });

  async function onSubmit(data: LoginAdolescenteFormData) {
    try {
      await signIn({
        login: data.login,
        senha: data.senha,
        tipo: "adolescente",
      });

      router.replace("/(protected)/adolescente/home");
    } catch {
      Alert.alert("Erro", "Não foi possível entrar.");
    }
  }

  return (
    <LinearGradient
      colors={colors.gradients.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={loginAdolescenteStyles.wrapper}>
        <View style={loginAdolescenteStyles.card}>
          <TouchableOpacity onPress={() => router.replace(HOME_ROUTE)}>
            <Text style={loginAdolescenteStyles.back}>←</Text>
          </TouchableOpacity>

          <View style={loginAdolescenteStyles.emoji}>
            <GradientIcon
              size={50}
              colors={colors.gradients.button}
              icon={<Entypo name="game-controller" size={50} color="#000" />}
            />
          </View>
          <Text style={loginAdolescenteStyles.title}>Área do Adolescente</Text>
          <Text style={loginAdolescenteStyles.subtitle}>
            Entre e comece a conquistar!
          </Text>

          <View style={loginAdolescenteStyles.badge}>
            <Text style={loginAdolescenteStyles.badgeText}>
              <Ionicons name="sparkles" color={colors.brand.yellow} size={16} />{" "}
              Complete missões e ganhe recompensas!
            </Text>
          </View>

          <Controller
            control={control}
            name="login"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Usuário"
                placeholder="seu.usuario"
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
            gradient={colors.gradients.button}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
