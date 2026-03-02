import { ButtonComponent } from "@/components/ButtonComponent";
import { withAuth } from "@/hoc/withAuth";
import {
  ButtonEnum,
  Pedido,
  PedidoRequest,
  TipoOperacao,
} from "@/services/models";
import { useRootStore } from "@/store";
import { Card, Form, Input, Select } from "antd";
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
  max-width: 400px;
  margin: 2.5rem auto;
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

  const { register, handleSubmit, reset, control } = useForm<
    Pedido & { funcionario_id?: number }
  >();

  useEffect(() => {
    if (
      operacaoFinal === TipoOperacao.EDITAR ||
      operacaoFinal === TipoOperacao.VISUALIZAR
    ) {
      if (parametros.id && parametros.id !== "novo") {
        pedidoStore.getPedido(Number(parametros.id)).then(() => {
          reset({
            bairro: pedidoStore.pedidoAtual?.bairro,
            complemento: pedidoStore.pedidoAtual?.complemento,
            funcionario_id: pedidoStore.pedidoAtual?.funcionario.id,
            id: pedidoStore.pedidoAtual?.id,
            nomeCliente: pedidoStore.pedidoAtual?.nomeCliente,
            numero: pedidoStore.pedidoAtual?.numero,
            observacao: pedidoStore.pedidoAtual?.observacao,
            rua: pedidoStore.pedidoAtual?.rua,
            telefone: pedidoStore.pedidoAtual?.telefone,
            isEntregue: pedidoStore.pedidoAtual?.isEntregue,
          });
        });
      }
    }
  }, [operacaoFinal, parametros.id]);

  useEffect(() => {
    pedidoStore.listarFuncionarios().catch(() => {});
  }, []);

  const handleIncluir = (data: Pedido & { funcionario_id?: number }) => {
    const pedido: PedidoRequest = {
      telefone: data.telefone,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      observacao: data.observacao,
      nomeCliente: data.nomeCliente,
    };
    if (data.funcionario_id != null) {
      pedido.funcionario_id = data.funcionario_id;
    }

    pedidoStore.incluirPedido(pedido).then(() => {
      showSuccess("Pedido cadastrado com sucesso!");
      navigate(`/dashboard/pedidos`);
    }).catch(showAxiosError);
  };

  const handleEditar = (data: Pedido & { funcionario_id?: number }) => {
    const pedido: PedidoRequest = {
      id: Number(parametros.id),
      telefone: data.telefone,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      observacao: data.observacao,
      nomeCliente: data.nomeCliente,
    };
    if (data.funcionario_id != null) {
      pedido.funcionario_id = data.funcionario_id;
    }

    pedidoStore.editarPedido(pedido).then(() => {
      showSuccess("Pedido atualizado com sucesso!");
      navigate(`/dashboard/pedidos`);
    }).catch(showAxiosError);
  };

  const cancelarOperacao = (nomePage: string) => {
    navigate(`/dashboard/${nomePage}`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2.5rem", marginBottom: "2.5rem" }}>
      <FormCard title="Adicionar novo pedido!">
        <form
          onSubmit={
            operacaoFinal === TipoOperacao.CRIAR
              ? handleSubmit(handleIncluir)
              : handleSubmit(handleEditar)
          }
        >
          <Controller
            control={control}
            name="funcionario_id"
            rules={{ required: "O funcionário é obrigatório" }}
            render={({ field }) => (
              <Form.Item label="Funcionário que irá realizar a entrega">
                <Select
                  disabled={parametros.operacao === "visualizar"}
                  size="small"
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

          <Form.Item label="Telefone">
            <Input
              disabled={parametros.operacao === "visualizar"}
              type="tel"
              placeholder="(99) 99999-9999"
              maxLength={15}
              {...register("telefone", { required: true })}
            />
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: colors.neutral.textSecondary }}>
              Exemplo: (11) 98765-4321
            </p>
          </Form.Item>

          <Form.Item label="Bairro">
            <Input disabled={parametros.operacao === "visualizar"} size="small" {...register("bairro")} />
          </Form.Item>
          <Form.Item label="Rua">
            <Input disabled={parametros.operacao === "visualizar"} size="small" {...register("rua")} />
          </Form.Item>
          <Form.Item label="Número">
            <Input disabled={parametros.operacao === "visualizar"} size="small" {...register("numero")} />
          </Form.Item>
          <Form.Item label="Complemento">
            <Input disabled={parametros.operacao === "visualizar"} size="small" {...register("complemento")} />
          </Form.Item>
          <Form.Item label="Observação">
            <Input disabled={parametros.operacao === "visualizar"} size="small" {...register("observacao")} />
          </Form.Item>
          <Form.Item label="Nome do Cliente">
            <Input disabled={parametros.operacao === "visualizar"} size="small" {...register("nomeCliente")} />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem" }}>
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
