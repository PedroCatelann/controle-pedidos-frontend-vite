import { useAuth } from "@/context/AuthContext";
import { login } from "@/services/auth.service";
import { colors } from "@/styles/theme";
import { Button, Card, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { showAxiosError, showSuccess } from "@/utils/toast";
import styled from "styled-components";

type LoginForm = {
  username: string;
  password: string;
};

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: ${colors.neutral.backgroundSecondary};
  padding: 1rem;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  border: 1px solid ${colors.neutral.border};
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.1);

  .ant-card-head {
    border-bottom-color: ${colors.neutral.border};
  }
`;

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    try {
      const { accessToken, refreshToken, fullname } = await login(data);
      loginContext(accessToken, refreshToken, fullname);
      showSuccess("Login realizado com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showAxiosError(error);
    }
  };

  return (
    <LoginContainer>
      <LoginCard title={<h1 style={{ textAlign: "center", margin: 0 }}>Login</h1>}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="username"
            rules={{ required: "Nome de usuário é obrigatório" }}
            render={({ field }) => (
              <Form.Item
                label="Nome de usuário"
                validateStatus={errors.username ? "error" : ""}
                help={errors.username?.message}
              >
                <Input
                  id="username"
                  type="text"
                  {...field}
                />
              </Form.Item>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: "Senha é obrigatória" }}
            render={({ field }) => (
              <Form.Item
                label="Senha"
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Input.Password
                  id="password"
                  placeholder="********"
                  {...field}
                />
              </Form.Item>
            )}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block>
              Entrar
            </Button>
          </Form.Item>
        </form>
      </LoginCard>
    </LoginContainer>
  );
}
