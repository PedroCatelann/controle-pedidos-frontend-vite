import { Button as AntButton } from "antd";
import { ButtonEnum } from "@/services/models";
import { colors } from "@/styles/theme";

interface ButtonProps {
  operacao: ButtonEnum;
  type?: "button" | "submit" | "reset";
  handleCancelar?: (nomePage: string) => void;
  nomePage?: string;
  children: React.ReactNode;
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  operacao,
  type = "button",
  handleCancelar,
  nomePage,
  children,
}) => {
  if (operacao === ButtonEnum.EDITAR) {
    return (
      <AntButton
        size="small"
        htmlType={type}
        style={{ color: colors.primary.main, borderColor: colors.primary.main }}
      >
        {children}
      </AntButton>
    );
  }

  if (operacao === ButtonEnum.CRIAR) {
    return (
      <AntButton
        size="small"
        htmlType={type}
        style={{ color: colors.success.main, borderColor: colors.success.main }}
      >
        {children}
      </AntButton>
    );
  }

  if (operacao === ButtonEnum.CANCELAR) {
    return (
      <AntButton
        size="small"
        htmlType={type}
        style={{ color: colors.error.main, borderColor: colors.error.main }}
        onClick={() => handleCancelar?.(nomePage || "")}
      >
        {children}
      </AntButton>
    );
  }

  return null;
};
