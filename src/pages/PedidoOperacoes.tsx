import { ButtonComponent } from "@/components/ButtonComponent";
import { withAuth } from "@/hoc/withAuth";
import {
  ButtonEnum,
  Pedido,
  PedidoRequest,
  TipoOperacao,
} from "@/services/models";
import { useRootStore } from "@/store";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { showSuccess, showAxiosError } from "@/utils/toast";
import { colors } from "@/styles/theme";
import styled from "styled-components";

type ParametrosRegistro = {
  operacao: string;
  id: string;
};

const FormCard = styled(Card)`
  max-width: 640px;
  margin: 2rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const PedidoCadastro: React.FC = observer(() => {
  const { pedidoStore } = useRootStore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const operacaoQuery = searchParams.get("operacao");
  const operacaoFinal = operacaoQuery || (id === "novo" ? TipoOperacao.CRIAR : TipoOperacao.VISUALIZAR);

  const parametros: ParametrosRegistro = {
    operacao: operacaoFinal,
    id: id || "",
  };

  const {
    handleSubmit,
    reset,
    control,
  } = useForm<Pedido & { funcionario_id: number }>();

  useEffect(() => {
    if (
      (operacaoFinal === TipoOperacao.EDITAR ||
        operacaoFinal === TipoOperacao.VISUALIZAR) &&
      parametros.id &&
      parametros.id !== "novo"
    ) {
      pedidoStore.getPedido(Number(parametros.id)).then((pedido) => {
        if (pedido) {
          reset({
            bairro: pedido.bairro ?? "",
            complemento: pedido.complemento ?? "",
            funcionario_id: Number(pedido.funcionario?.id),
            id: pedido.id,
            nomeCliente: pedido.nomeCliente ?? "",
            numero: pedido.numero ?? "",
            observacao: pedido.observacao ?? "",
            rua: pedido.rua ?? "",
            telefone: pedido.telefone ?? "",
            isEntregue: pedido.isEntregue,
          });
        }
      });
      
    }
  }, [operacaoFinal, parametros.id]);

  useEffect(() => {
    pedidoStore.listarFuncionarios().catch((error) => {
      showAxiosError(error);
    });
  }, []);

  const handleIncluir = (data: Pedido & { funcionario_id: number }) => {
    const pedido: PedidoRequest = {
      funcionario_id: data.funcionario_id,
      telefone: data.telefone,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      observacao: data.observacao,
      nomeCliente: data.nomeCliente,
    };

    pedidoStore
      .incluirPedido(pedido)
      .then(() => {
        showSuccess("Pedido cadastrado com sucesso!");
        navigate(`/dashboard/pedidos`);
      })
      .catch((error) => showAxiosError(error));
  };

  const handleEditar = (data: Pedido & { funcionario_id: number }) => {
    const pedido: PedidoRequest = {
      id: Number(parametros.id),
      funcionario_id: data.funcionario_id,
      telefone: data.telefone,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      observacao: data.observacao,
      nomeCliente: data.nomeCliente,
    };

    pedidoStore
      .editarPedido(pedido)
      .then(() => {
        showSuccess("Pedido atualizado com sucesso!");
        navigate(`/dashboard/pedidos`);
      })
      .catch((error) => showAxiosError(error));
  };

  const cancelarOperacao = (nomePage: string) => {
    navigate(`/dashboard/${nomePage}`);
  };

  const titulo = operacaoFinal === TipoOperacao.CRIAR
    ? "Novo Pedido"
    : operacaoFinal === TipoOperacao.EDITAR
      ? "Editar Pedido"
      : "Visualizar Pedido";

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem 1rem", minHeight: "calc(100vh - 120px)" }}>
      <FormCard title={titulo}>
        <form
          onSubmit={
            operacaoFinal === TipoOperacao.CRIAR
              ? handleSubmit(handleIncluir)
              : handleSubmit(handleEditar)
          }
        >
          <Row gutter={[16, 12]}>
            <Col xs={24} sm={24}>
              <Controller
                control={control}
                name="funcionario_id"
                rules={{ required: "O funcionário é obrigatório" }}
                render={({ field }) => (
                  <Form.Item
                    label="Funcionário que irá realizar a entrega"
                    htmlFor="funcionario"
                  >
                    <Select
                      id="funcionario"
                      disabled={parametros.operacao === "visualizar"}
                      size="middle"
                      placeholder="Selecione o funcionário"
                      options={pedidoStore.listaFuncionarios
                        .filter((f) => f.id != null && f.nome != null)
                        .map((func) => ({
                          label: func.nome,
                          value: func.id,
                        }))}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Form.Item>
                )}
              />
            </Col>

            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="nomeCliente"
                rules={{ required: "Nome do cliente é obrigatório" }}
                render={({ field }) => (
                  <Form.Item label="Nome do Cliente" htmlFor="nomeCliente">
                    <Input
                      id="nomeCliente"
                      disabled={parametros.operacao === "visualizar"}
                      size="middle"
                      placeholder="Nome completo"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="telefone"
                rules={{ required: "Telefone é obrigatório" }}
                render={({ field }) => (
                  <Form.Item label="Telefone" htmlFor="phone-input">
                    <Input
                      id="phone-input"
                      disabled={parametros.operacao === "visualizar"}
                      type="tel"
                      size="middle"
                      placeholder="(99) 99999-9999"
                      maxLength={15}
                      {...field}
                    />
                    <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: colors.neutral.textSecondary }}>
                      Ex.: (11) 98765-4321
                    </p>
                  </Form.Item>
                )}
              />
            </Col>

            <Col xs={24} sm={16}>
              <Controller
                control={control}
                name="rua"
                render={({ field }) => (
                  <Form.Item label="Rua" htmlFor="rua">
                    <Input
                      id="rua"
                      disabled={parametros.operacao === "visualizar"}
                      size="middle"
                      placeholder="Nome da rua"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Controller
                control={control}
                name="numero"
                render={({ field }) => (
                  <Form.Item label="Número" htmlFor="numero">
                    <Input
                      id="numero"
                      disabled={parametros.operacao === "visualizar"}
                      size="middle"
                      placeholder="Nº"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>

            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="bairro"
                render={({ field }) => (
                  <Form.Item label="Bairro" htmlFor="bairro">
                    <Input
                      id="bairro"
                      disabled={parametros.operacao === "visualizar"}
                      size="middle"
                      placeholder="Bairro"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="complemento"
                render={({ field }) => (
                  <Form.Item label="Complemento" htmlFor="complemento">
                    <Input
                      id="complemento"
                      disabled={parametros.operacao === "visualizar"}
                      size="middle"
                      placeholder="Apto, bloco, etc."
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>

            <Col xs={24}>
              <Controller
                control={control}
                name="observacao"
                render={({ field }) => (
                  <Form.Item label="Observação" htmlFor="observacao">
                    <Input
                      id="observacao"
                      disabled={parametros.operacao === "visualizar"}
                      size="middle"
                      placeholder="Informações adicionais"
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
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
              nomePage="pedidos"
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

export default withAuth(PedidoCadastro);
