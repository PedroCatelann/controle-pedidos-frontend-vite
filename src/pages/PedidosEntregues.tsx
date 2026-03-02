import CustomSpinner from "@/components/CustomSpinner";
import { withAuth } from "@/hoc/withAuth";
import { PedidoResponse } from "@/services/models";
import { useRootStore } from "@/store";
import { formatDate } from "@/utils/utils";
import {
  Collapse,
  Button,
  DatePicker,
  Input,
  Select,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { showAxiosError } from "@/utils/toast";
import styled from "styled-components";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const PageContainer = styled.div`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-top: 2.5rem;
`;

const PedidoConsulta: React.FC = observer(() => {
  const { pedidoStore } = useRootStore();

  const { handleSubmit, control, reset } =
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
      .listarPedidosEntregues(data)
      .then(() => pedidoStore.saveInfoToSearch(data))
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
      title: "Data/Hora do Pedido",
      key: "dataHoraInclui",
      render: (_, record) => (
        <strong>{formatDate(record.dataHoraInclui)}</strong>
      ),
    },
    {
      title: "Data/Hora da Entrega",
      key: "dataHoraEntregue",
      render: (_, record) => (
        <strong>{formatDate(record.dataHoraEntregue)}</strong>
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
            label: "Consulta de Pedidos Entregues",
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
                          value={field.value?.id ?? undefined}
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
                                : undefined
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
        dataSource={pedidoStore.listaPedidosEntregues}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </PageContainer>
  );
});

export default withAuth(PedidoConsulta);
