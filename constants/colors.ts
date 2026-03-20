const backgroundGradient = ["#8B3DFF", "#E6007A", "#FF5A5F"] as const;
const buttonGradient = ["#8B3DFF", "#E6007A"] as const;

export const colors = {
  neutral: {
    white: "#FFFFFF",
    background: "#e9ebee",
    card: "#F8F9FC",
    border: "#D0D5DD",
    text: "#101828",
    muted: "#667085",
    placeholder: "#98A2B3",
    danger: "#D92D20",
  },

  brand: {
    blue: "#2F6BFF",
    home: "#4f0372b4",
    blueDark: "#1D4ED8",
    purple: "#9333EA",
    pink: "#E6007A",
    yellow: "#FACC15",
    gradientStart: "#8B3DFF",
    gradientMiddle: "#E6007A",
    gradientEnd: "#FF5A5F",
  },

  gradients: {
    background: backgroundGradient,
    button: buttonGradient,
  },
};
