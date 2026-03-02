import { apiBackEnd } from "@/services/api";
import { Funcionario, MetricasFuncionarioPedido } from "@/services/models";
import {
  Button,
  Card,
  Select,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomSpinner from "@/components/CustomSpinner";
import { colors } from "@/styles/theme";
import { withAuth } from "@/hoc/withAuth";
import { showError, showAxiosError } from "@/utils/toast";
import styled from "styled-components";

interface MetricasFormData {
  idFuncionario: number;
  ano: number;
  mes: number;
}

const PageContainer = styled.div`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-top: 2.5rem;
`;

const MetricasPage: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [metricas, setMetricas] = useState<MetricasFuncionarioPedido | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFuncionarios, setIsLoadingFuncionarios] = useState(false);

  const { handleSubmit, control } = useForm<MetricasFormData>({
    defaultValues: {
      idFuncionario: 0,
      ano: new Date().getFullYear(),
      mes: new Date().getMonth() + 1,
    },
  });

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    setIsLoadingFuncionarios(true);
    try {
      const response = await apiBackEnd.get("/funcionarios/listar", {
        params: { nome: "" },
      });
      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    } finally {
      setIsLoadingFuncionarios(false);
    }
  };

  const buscarMetricas = async (data: MetricasFormData) => {
    if (!data.idFuncionario) {
      showError("Por favor, selecione um funcionário");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiBackEnd.get("/metricas/funcionario-pedido", {
        params: {
          idFuncionario: data.idFuncionario,
          ano: data.ano,
          mes: data.mes,
        },
      });
      setMetricas(response.data);
    } catch (error) {
      showAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const dadosGrafico = metricas
    ? Object.entries(metricas.pedidosPorDia).map(([data, quantidade]) => ({
        data: new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        quantidade,
      }))
    : [];

  const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const meses = [
    { valor: 1, nome: "Janeiro" },
    { valor: 2, nome: "Fevereiro" },
    { valor: 3, nome: "Março" },
    { valor: 4, nome: "Abril" },
    { valor: 5, nome: "Maio" },
    { valor: 6, nome: "Junho" },
    { valor: 7, nome: "Julho" },
    { valor: 8, nome: "Agosto" },
    { valor: 9, nome: "Setembro" },
    { valor: 10, nome: "Outubro" },
    { valor: 11, nome: "Novembro" },
    { valor: 12, nome: "Dezembro" },
  ];

  return (
    <PageContainer>
      <CustomSpinner isLoading={isLoading || isLoadingFuncionarios} />

      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Métricas de Entregas
      </h1>

      <Card style={{ marginBottom: "1.5rem" }}>
        <form onSubmit={handleSubmit(buscarMetricas)}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <Controller
              control={control}
              name="idFuncionario"
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Funcionário</label>
                  <Select
                    id="idFuncionario"
                    style={{ width: "100%" }}
                    placeholder="Selecione um funcionário"
                    disabled={isLoadingFuncionarios}
                    options={[
                      { value: 0, label: "Selecione um funcionário" },
                      ...funcionarios.map((func) => ({
                        label: func.nome,
                        value: func.id,
                      })),
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="ano"
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Ano</label>
                  <Select
                    id="ano"
                    style={{ width: "100%" }}
                    options={anos.map((ano) => ({ label: String(ano), value: ano }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="mes"
              render={({ field }) => (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Mês</label>
                  <Select
                    id="mes"
                    style={{ width: "100%" }}
                    options={meses.map((mes) => ({
                      label: mes.nome,
                      value: mes.valor,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>

          <Button type="primary" htmlType="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spin size="small" style={{ marginRight: 8 }} />
                Buscando...
              </>
            ) : (
              "Buscar Métricas"
            )}
          </Button>
        </form>
      </Card>

      {metricas && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
              Pedidos por Dia
            </h2>
            {dadosGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="quantidade"
                    fill={colors.primary.main}
                    name="Quantidade de Pedidos"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: colors.neutral.textSecondary, textAlign: "center", padding: "2rem" }}>
                Nenhum dado disponível para o período selecionado.
              </p>
            )}
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            <Card>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Média de Tempo de Entrega
              </h3>
              <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: colors.primary.main }}>
                {metricas.mediaMinutos.toFixed(2)}
              </p>
              <p style={{ color: colors.neutral.textSecondary, marginTop: "0.25rem" }}>minutos</p>
            </Card>

            <Card>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>
                Entrega Mais Demorada
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <p style={{ fontSize: "0.875rem", color: colors.neutral.textSecondary }}>Cliente:</p>
                  <p style={{ fontWeight: 500 }}>{metricas.entregaMaisDemoradaDTO.nomeCliente}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: colors.neutral.textSecondary }}>Endereço:</p>
                  <p style={{ fontWeight: 500 }}>{metricas.entregaMaisDemoradaDTO.endereco}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: colors.neutral.textSecondary }}>Data:</p>
                  <p style={{ fontWeight: 500 }}>
                    {new Date(metricas.entregaMaisDemoradaDTO.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: colors.neutral.textSecondary }}>Tempo:</p>
                  <p style={{ fontWeight: "bold", color: colors.error.main, fontSize: "1.25rem" }}>
                    {metricas.entregaMaisDemoradaDTO.tempoParaEntrega.toFixed(2)} minutos
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default withAuth(MetricasPage);
