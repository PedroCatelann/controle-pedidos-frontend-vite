import { CounterStore } from "./CounterStore";
import { FuncionarioStore } from "./FuncionarioStore";
import { PedidoStore } from "./PedidosStore";

export class RootStore {
  funcionarioStore = new FuncionarioStore();
  counterStore = new CounterStore();
  pedidoStore = new PedidoStore();
}
