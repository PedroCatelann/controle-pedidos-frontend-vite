import { ButtonComponent } from "@/components/ButtonComponent";
import { ROLES } from "@/services/constants";
import { ButtonEnum, Funcionario, Role, TipoOperacao } from "@/services/models";
import { useRootStore } from "@/store";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { showSuccess, showAxiosError } from "@/utils/toast";
import styled from "styled-components";

type FormValues = {
  nome: string;
  roles: Role;
};

type ParametrosRegistro = {
  operacao: string;
  id: string;
};

const FormCard = styled(Card)`
  max-width: 480px;
  margin: 2rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const FuncionarioOperacoes: React.FC = observer(() => {
  const navigate = useNavigate();
  const { funcionarioStore } = useRootStore();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const operacaoQuery = searchParams.get("operacao");
  const operacaoFinal =
    operacaoQuery || (id === "novo" ? TipoOperacao.CRIAR : TipoOperacao.VISUALIZAR);

  const parametros: ParametrosRegistro = {
    operacao: operacaoFinal,
    id: id || "",
  };

  let titulo = "";
  switch (parametros.operacao) {
    case TipoOperacao.CRIAR:
      titulo = "Nova Entrada";
      break;
    case TipoOperacao.EDITAR:
      titulo = `Editando Registro #${parametros.id}`;
      break;
    case TipoOperacao.VISUALIZAR:
      titulo = `Visualizando Registro #${parametros.id}`;
      break;
    default:
      titulo = "Ação Desconhecida";
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (operacaoFinal === TipoOperacao.CRIAR || id === "novo") {
      reset({ nome: "", roles: Role.ENTREGADOR });
      return;
    }
    if (id && !isNaN(Number(id))) {
      funcionarioStore.getFuncionario(Number(id)).then((funcionario) => {
        if (funcionario) {
          reset({
            nome: funcionario.nome || "",
            roles: (funcionario.roles || Role.ENTREGADOR) as Role,
          });
        }
      });
    }
  }, [operacaoFinal, id]);

  const incluirFuncionario = (data: FormValues) => {
    const dataFunc: Funcionario = {
      nome: data.nome,
      roles: data.roles,
    };
    funcionarioStore
      .incluirFuncionario(dataFunc)
      .then(() => {
        showSuccess("Funcionário cadastrado com sucesso!");
        navigate(`/admin/funcionario`);
      })
      .catch((error) => showAxiosError(error));
  };

  const cancelarOperacao = (nomePage: string) => {
    navigate(`/admin/${nomePage}`);
  };

  const editarFuncionario = (data: FormValues) => {
    const dataFunc: Funcionario = {
      id: id ? Number(id) : undefined,
      nome: data.nome,
      roles: data.roles,
    };
    if (!id) return;
    funcionarioStore
      .editarFuncionario(Number(id), dataFunc)
      .then(() => {
        showSuccess("Funcionário atualizado com sucesso!");
        navigate(`/admin/funcionario`);
      })
      .catch((error) => showAxiosError(error));
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
      <FormCard title={titulo}>
        <form
          onSubmit={
            operacaoFinal === TipoOperacao.CRIAR
              ? handleSubmit(incluirFuncionario)
              : handleSubmit(editarFuncionario)
          }
        >
          <Row gutter={[16, 12]}>
            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="nome"
                rules={{ required: "O nome é obrigatório" }}
                render={({ field }) => (
                  <Form.Item
                    label="Nome"
                    htmlFor="nome"
                    validateStatus={errors.nome ? "error" : ""}
                    help={errors.nome?.message}
                  >
                    <Input
                      id="nome"
                      size="middle"
                      readOnly={parametros.operacao === "visualizar"}
                      placeholder="Nome completo do funcionário"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>

            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="roles"
                rules={{ required: "A permissão é obrigatória" }}
                render={({ field }) => (
                  <Form.Item
                    label="Permissão"
                    htmlFor="roles"
                    validateStatus={errors.roles ? "error" : ""}
                    help={errors.roles?.message}
                  >
                    <Select
                      id="roles"
                      size="middle"
                      disabled={parametros.operacao === "visualizar"}
                      style={{ width: "100%" }}
                      placeholder="Selecione a permissão"
                      options={ROLES.map((option) => ({
                        label: option.label,
                        value: option.value,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
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
            {operacaoFinal === TipoOperacao.EDITAR && (
              <ButtonComponent type="submit" operacao={ButtonEnum.EDITAR}>
                Editar
              </ButtonComponent>
            )}
            {operacaoFinal === TipoOperacao.CRIAR && (
              <ButtonComponent type="submit" operacao={ButtonEnum.CRIAR}>
                Cadastrar
              </ButtonComponent>
            )}
            <ButtonComponent
              operacao={ButtonEnum.CANCELAR}
              handleCancelar={cancelarOperacao}
              nomePage="funcionario"
              type="button"
            >
              Cancelar
            </ButtonComponent>
          </div>
        </form>
      </FormCard>
    </div>
  );
});

export default FuncionarioOperacoes;
