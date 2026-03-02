export interface Funcionario {
  id?: number;
  nome: string;
  roles: Role;
}

export interface FuncionarioResponse {
  nome?: string;
}

export enum Role {
  ADMIN = "ADMIN",
  ENTREGADOR = "ENTREGADOR",
  GERENTE = "GERENTE",
}

export enum TipoOperacao {
  CRIAR = "criar",
  EDITAR = "editar",
  VISUALIZAR = "visualizar",
}

export enum ButtonEnum {
  EDITAR = "EDITAR",
  CRIAR = "CRIAR",
  CANCELAR = "CANCELAR",
}

export interface Pedido {
  id: number;
  funcionario: Funcionario;
  funcionario_id?: number;
  telefone?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  observacao?: string;
  nomeCliente?: string;
  isEntregue: boolean;
  color?: string;
  dataHoraInclui?: string;
  dataHoraEntregue?: string;
  dataHoraPassouEntrega?: string;
  passouEntregador?: boolean;
}

export interface PedidoRequest {
  id?: number;
  funcionario?: Funcionario;
  funcionario_id?: number;
  telefone?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  observacao?: string;
  nomeCliente?: string;
}

export interface PedidoResponse {
  dataPedido?: Date;
  funcionario?: Funcionario;
  nomeCliente?: string;
}

export interface EntregaMaisDemoradaDTO {
  endereco: string;
  nomeCliente: string;
  data: string;
  tempoParaEntrega: number;
}

export interface MetricasFuncionarioPedido {
  pedidosPorDia: Record<string, number>;
  mediaMinutos: number;
  entregaMaisDemoradaDTO: EntregaMaisDemoradaDTO;
}
