import { FuncionarioResponse, TipoOperacao } from "@/services/models";
import { useRootStore } from "@/store";
import {
  Collapse,
  Button,
  Input,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { showSuccess, showAxiosError } from "@/utils/toast";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-top: 2.5rem;
`;

const FuncionarioConsulta: React.FC = observer(() => {
  const navigate = useNavigate();
  const { funcionarioStore } = useRootStore();
  const [infoSearch, setInfoSearch] = useState<FuncionarioResponse | undefined>(undefined);

  const { control, handleSubmit } = useForm<FuncionarioResponse>();

  useEffect(() => {
    const savedSearch = funcionarioStore.infoToSearch;
    if (savedSearch) {
      listarFuncionarios(savedSearch);
    }
  }, [funcionarioStore.infoToSearch]);

  const listarFuncionarios = (data: FuncionarioResponse & { nome?: string }) => {
    funcionarioStore
      .listarFuncionarios(data)
      .then(() => setInfoSearch(data))
      .catch((error) => showAxiosError(error));
  };

  const handleNavigate = (operacao: TipoOperacao, id?: number) => {
    infoSearch && funcionarioStore.saveInfoToSearch(infoSearch);
    if (operacao === TipoOperacao.VISUALIZAR || operacao === TipoOperacao.EDITAR)
      navigate(`/admin/funcionario/operacoes/${id}?operacao=${operacao}`);
    else navigate(`/admin/funcionario/operacoes/novo`);
  };

  const excluirFunction = (id?: number) => {
    if (id == null) return;
    funcionarioStore
      .deleteFuncionario(id)
      .then(() => {
        showSuccess("Funcionário excluído com sucesso!");
        listarFuncionarios({ nome: "" });
      })
      .catch((error) => showAxiosError(error));
  };

  const columns: ColumnsType<any> = [
    { title: "Nome funcionário", dataIndex: "nome", key: "nome" },
    { title: "Role", dataIndex: "roles", key: "roles" },
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
      <Collapse
        items={[
          {
            key: "1",
            label: "Consulta de Funcionários",
            children: (
              <form onSubmit={handleSubmit(listarFuncionarios)}>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2rem",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>
                      Nome do Funcionário
                    </label>
                    <Controller
                      control={control}
                      name="nome"
                      render={({ field }) => (
                        <Input
                          size="small"
                          placeholder="Buscar por nome"
                          {...field}
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
                    Listar Funcionários
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
        dataSource={funcionarioStore.listaFuncionarios}
        rowKey="id"
        pagination={false}
      />
    </PageContainer>
  );
});

export default FuncionarioConsulta;
