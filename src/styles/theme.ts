/**
 * Paleta de cores do sistema - Controle de Pedidos
 * 
 * 🔵 Azul Água (Primária) - Botões principais, Header, Links
 * 🟠 Laranja Energia (Secundária) - Ações importantes, Destaques
 * 🟢 Verde Pet - Status entregue, Confirmações, Tags positivas
 * 🔴 Vermelho Controle - Erros, Cancelamentos, Alertas
 * ⚪ Neutros - Fundos, textos, bordas
 */

export const colors = {
  // Azul Água - Cor Primária
  primary: {
    main: "#1E88E5",
    hover: "#1565C0",
    light: "#d5dbe8",
  },

  // Laranja Energia - Secundária
  secondary: {
    main: "#F57C00",
    hover: "#EF6C00",
    light: "#FFF3E0",
  },

  // Verde Pet - Acolhimento
  success: {
    main: "#43A047",
    hover: "#2E7D32",
    light: "#E8F5E9",
  },

  // Vermelho Controle - Alertas
  error: {
    main: "#E53935",
    hover: "#C62828",
    light: "#FFEBEE",
  },

  // Neutros
  neutral: {
    white: "#FFFFFF",
    backgroundSecondary: "#F5F7FA",
    textPrimary: "#263238",
    textSecondary: "#607D8B",
    border: "#CFD8DC",
  },

  // Urgência (mapeamento para a store)
  urgency: {
    green: "#43A047",
    yellow: "#F57C00",
    red: "#E53935",
    default: "#607D8B",
  },
} as const;

type UrgencyKey = "green" | "yellow" | "red" | "default";

export const getUrgencyColor = (key: string | undefined): string => {
  if (!key || !(key in colors.urgency)) return colors.urgency.default;
  return colors.urgency[key as UrgencyKey];
};
