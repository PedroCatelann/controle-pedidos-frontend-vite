import CustomSpinner from "@/components/CustomSpinner";
import { withAuth } from "@/hoc/withAuth";
import { PedidoResponse, TipoOperacao } from "@/services/models";
import { useRootStore } from "@/store";
import {
  formatDate,
  formatDateForDelivery,
} from "@/utils/utils";
import {
  Collapse,
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { showSuccess, showAxiosError, showError } from "@/utils/toast";
import { getUrgencyColor } from "@/styles/theme";
import styled from "styled-components";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const PageContainer = styled.div`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-top: 2.5rem;
`;

const PedidoConsulta: React.FC = observer(() => {
  const navigate = useNavigate();
  const { pedidoStore } = useRootStore();
  const [checkedPedidos, setCheckedPedidos] = useState<Record<number, boolean>>({});

  const { handleSubmit, control, getValues, reset } =
    useForm<PedidoResponse>({
      defaultValues: {
        nomeCliente: "",
        funcionario: undefined,
        dataPedido: new Date(),
      },
    });

  useEffect(() => {
    pedidoStore.listarFuncionarios().catch((error) => {
      showAxiosError(error);
    });
  }, []);

  useEffect(() => {
    const savedSearch = pedidoStore.infoToSearch;
    if (savedSearch) {
      listarPedidos(savedSearch);
      reset({
        nomeCliente: savedSearch.nomeCliente,
        funcionario: savedSearch.funcionario,
        dataPedido: savedSearch.dataPedido,
      });
    }
  }, [pedidoStore.infoToSearch]);

  const listarPedidos = (data: PedidoResponse) => {
    pedidoStore
      .listarPedidos(data)
      .then(() => pedidoStore.saveInfoToSearch(data))
      .catch((error) => showAxiosError(error));
  };

  const passouPedidoEntrega = (id: number, hasPassed: boolean) => {
    const values = getValues();
    pedidoStore
      .passouPedidoEntrega(id, hasPassed, {
        dataPedido: values.dataPedido,
        funcionario: values.funcionario,
        nomeCliente: values.nomeCliente,
      })
      .then(() => {
        showSuccess(formatDateForDelivery(new Date()));
        listarPedidos(values);
      })
      .catch((error) => showAxiosError(error));
  };

  const alterarStatusPedido = (
    id: number,
    isEntregue: boolean,
    isPassouEntrega?: boolean
  ) => {
    if (!isPassouEntrega) {
      showError(
        "O pedido deve ser passado para o entregador antes de ser marcado como entregue."
      );
      return;
    }
    pedidoStore
      .alterarStatusPedido(id, isEntregue)
      .then(() => {
        setCheckedPedidos((prev) => ({ ...prev, [id]: isEntregue }));
        showSuccess("Pedido marcado como entregue!");
        listarPedidos(
          pedidoStore.infoToSearch || {
            nomeCliente: "",
            funcionario: undefined,
            dataPedido: new Date(),
          }
        );
      })
      .catch((error) => showAxiosError(error));
  };

  const handleNavigate = (operacao: TipoOperacao, id?: number) => {
    if (operacao === TipoOperacao.VISUALIZAR || operacao === TipoOperacao.EDITAR)
      navigate(`/dashboard/pedidos/operacoes/${id}?operacao=${operacao}`);
    else navigate(`/dashboard/pedidos/operacoes/novo`);
  };

  const excluirFunction = (id?: number) => {
    if (id == null) return;
    pedidoStore
      .deletePedido(id)
      .then(() => {
        showSuccess("Pedido excluído com sucesso!");
        listarPedidos({});
      })
      .catch((error) => showAxiosError(error));
  };

  const columns: ColumnsType<any> = [
    { title: "Nome Cliente", dataIndex: "nomeCliente", key: "nomeCliente" },
    { title: "Rua", dataIndex: "rua", key: "rua" },
    { title: "Número", dataIndex: "numero", key: "numero" },
    { title: "Bairro", dataIndex: "bairro", key: "bairro" },
    {
      title: "Entregador",
      dataIndex: ["funcionario", "nome"],
      key: "funcionario",
    },
    { title: "Observação", dataIndex: "observacao", key: "observacao" },
    {
      title: "Data do Pedido",
      key: "dataHoraInclui",
      render: (_, record) => (
        <strong>{formatDate(record.dataHoraInclui)}</strong>
      ),
    },
    {
      title: "Passou para entrega",
      key: "passouEntregador",
      render: (_, record) => (
        <Checkbox
          checked={record.passouEntregador}
          onChange={(e) => passouPedidoEntrega(record.id, e.target.checked)}
          disabled={record.passouEntregador}
        />
      ),
    },
    {
      title: "Entregue?",
      key: "entregue",
      render: (_, record) => (
        <Checkbox
          checked={checkedPedidos[record.id] || false}
          onChange={(e) =>
            alterarStatusPedido(
              record.id,
              e.target.checked,
              record.passouEntregador
            )
          }
        />
      ),
    },
    {
      title: "Urgência",
      key: "color",
      render: (_, record) => (
        <div
          style={{
            width: 16,
            height: 16,
            backgroundColor: getUrgencyColor(record.color),
            margin: "0 auto",
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      title: "Consultar",
      key: "consultar",
      render: (_, record) => (
        <button
          onClick={() => handleNavigate(TipoOperacao.VISUALIZAR, record.id)}
          style={{ cursor: "pointer", background: "none", border: "none" }}
        >
          <FaSearch />
        </button>
      ),
    },
    {
      title: "Editar",
      key: "editar",
      render: (_, record) => (
        <button
          onClick={() => handleNavigate(TipoOperacao.EDITAR, record.id)}
          style={{ cursor: "pointer", background: "none", border: "none" }}
        >
          <MdEdit />
        </button>
      ),
    },
    {
      title: "Deletar",
      key: "deletar",
      render: (_, record) => (
        <button
          onClick={() => excluirFunction(record.id)}
          style={{ cursor: "pointer", background: "none", border: "none" }}
        >
          <MdDelete />
        </button>
      ),
    },
  ];

  return (
    <PageContainer>
      <CustomSpinner isLoading={pedidoStore.isLoading} />
      <Collapse        
        items={[
          {
            key: "1",
            label: "Consulta de Pedidos",
            children: (
              <form onSubmit={handleSubmit(listarPedidos)}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 220, maxWidth: 400 }}>
                    <label>Nome do Cliente</label>
                    <Controller
                      control={control}
                      name="nomeCliente"
                      render={({ field }) => (
                        <Input
                          size="small"
                          style={{ marginTop: 4, width: "100%" }}
                          placeholder="Buscar por nome"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 220, maxWidth: 400 }}>
                    <label>Funcionário alocado</label>
                    <Controller
                      control={control}
                      name="funcionario"
                      render={({ field }) => (
                        <Select
                          size="small"
                          style={{ width: "100%", marginTop: 4 }}
                          placeholder="Selecione"
                          allowClear
                          options={pedidoStore.listaFuncionarios
                            .filter((f) => f.id != null && f.nome != null)
                            .map((func) => ({
                              label: func.nome,
                              value: func.id,
                            }))}
                          value={field.value?.id ?? ""}
                          onChange={(v) =>
                            field.onChange(
                              v
                                ? {
                                    id: v,
                                    nome: pedidoStore.listaFuncionarios.find(
                                      (f) => f.id === v
                                    )?.nome || "",
                                    roles: "ENTREGADOR",
                                  }
                                : ""
                            )
                          }
                        />
                      )}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 220, maxWidth: 400 }}>
                    <label>Data do pedido</label>
                    <Controller
                      control={control}
                      name="dataPedido"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? dayjs(value) : null}
                          onChange={(d) => onChange(d?.toDate())}
                          style={{ width: "100%", marginTop: 4 }}
                          size="small"
                        />
                      )}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <Button onClick={() => handleNavigate(TipoOperacao.CRIAR)}>
                    Novo
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Listar Pedidos
                  </Button>
                </div>
              </form>
            ),
          },
        ]}
        defaultActiveKey={["1"]}
      />
      <Table
        columns={columns}
        dataSource={pedidoStore.listaPedidos}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1200 }}
      />
    </PageContainer>
  );
});

export default withAuth(PedidoConsulta);
