import { colors } from "@/constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TAB_ICON_SIZE = 18;

type TabIconProps = {
  color: string;
  focused: boolean;
};

function HomeIcon({ color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? "home" : "home-outline"}
      size={TAB_ICON_SIZE}
      color={color}
    />
  );
}

function WalletIcon({ color, focused }: TabIconProps) {
  return (
    <MaterialCommunityIcons
      name={focused ? "cash-multiple" : "cash"}
      size={TAB_ICON_SIZE}
      color={color}
    />
  );
}

function QuizIcon({ color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? "book" : "book-outline"}
      size={TAB_ICON_SIZE}
      color={color}
    />
  );
}

function RankingIcon({ color, focused }: TabIconProps) {
  return (
    <MaterialCommunityIcons
      name={focused ? "trophy" : "trophy-outline"}
      size={TAB_ICON_SIZE}
      color={color}
    />
  );
}

function ProfileIcon({ color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? "person" : "person-outline"}
      size={TAB_ICON_SIZE}
      color={color}
    />
  );
}

export default function AdolescenteTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: colors.brand.purple,
        tabBarInactiveTintColor: "#98A2B3",
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "600",
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarStyle: {
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: "#E9EAF0",
          backgroundColor: colors.neutral.white,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          animation: "shift",
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="extrato"
        options={{
          title: "Extrato",
          animation: "shift",
          tabBarIcon: WalletIcon,
        }}
      />
      <Tabs.Screen
        name="quizzes"
        options={{
          title: "Quizzes",
          animation: "shift",
          tabBarIcon: QuizIcon,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",
          animation: "shift",
          tabBarIcon: RankingIcon,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          animation: "shift",
          tabBarIcon: ProfileIcon,
        }}
      />
      <Tabs.Screen
        name="missao/[missaoId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="missao/[missaoId]/concluir"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
