import { ButtonComponent } from "@/components/ButtonComponent";
import { createUser, CreateUserRequest } from "@/services/auth.service";
import { ButtonEnum } from "@/services/models";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { showSuccess, showAxiosError } from "@/utils/toast";
import styled from "styled-components";

const FormCard = styled(Card)`
  max-width: 480px;
  margin: 2rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export default function CriarUsuario() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserRequest>({
    defaultValues: { permission: "COMMON_USER" },
  });

  const onSubmit = (data: CreateUserRequest) => {
    createUser(data)
      .then(() => {
        showSuccess("Usuário cadastrado com sucesso!");
        navigate("/admin");
      })
      .catch((error) => showAxiosError(error));
  };

  const cancelarOperacao = (_nomePage: string) => {
    navigate("/admin");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem 1rem",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <FormCard title="Criar usuário">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 12]}>
            <Col xs={24}>
              <Controller
                control={control}
                name="username"
                rules={{ required: "O usuário é obrigatório" }}
                render={({ field }) => (
                  <Form.Item
                    layout="vertical"
                    label="Usuário"
                    htmlFor="username"
                    validateStatus={errors.username ? "error" : ""}
                    help={errors.username?.message}
                  >
                    <Input
                      id="username"
                      size="middle"
                      placeholder="Nome de usuário para login"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>
            <Col xs={24}>
              <Controller
                control={control}
                name="fullname"
                rules={{ required: "O nome completo é obrigatório" }}
                render={({ field }) => (
                  <Form.Item
                    layout="vertical"
                    label="Nome completo"
                    htmlFor="fullname"
                    validateStatus={errors.fullname ? "error" : ""}
                    help={errors.fullname?.message}
                  >
                    <Input
                      id="fullname"
                      size="middle"
                      placeholder="Nome completo do usuário"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>
            <Col xs={24}>
              <Controller
                control={control}
                name="permission"
                rules={{ required: "A permissão é obrigatória" }}
                render={({ field }) => (
                  <Form.Item
                    layout="vertical"
                    label="Permissão"
                    htmlFor="permission"
                    validateStatus={errors.permission ? "error" : ""}
                    help={errors.permission?.message}
                  >
                    <Select
                      id="permission"
                      size="middle"
                      placeholder="Selecione a permissão"
                      style={{ width: "100%" }}
                      options={[
                        { value: "MANAGER", label: "Gerente" },
                        { value: "COMMON_USER", label: "Usuário Comum" },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Form.Item>
                )}
              />
            </Col>
            <Col xs={24}>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "A senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter no mínimo 6 caracteres",
                  },
                }}
                render={({ field }) => (
                  <Form.Item
                    layout="vertical"
                    label="Senha"
                    htmlFor="password"
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password?.message}
                  >
                    <Input.Password
                      id="password"
                      size="middle"
                      placeholder="Senha de acesso"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <ButtonComponent type="submit" operacao={ButtonEnum.CRIAR}>
              Cadastrar
            </ButtonComponent>
            <ButtonComponent
              operacao={ButtonEnum.CANCELAR}
              handleCancelar={cancelarOperacao}
              nomePage=""
              type="button"
            >
              Cancelar
            </ButtonComponent>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
