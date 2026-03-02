"use client";
import { observer } from "mobx-react-lite";
import { useRootStore } from "@/store/index";
import { UserForm } from "./UseForm";

const Teste = observer(() => {
  const { counterStore } = useRootStore();

  return (
    <main style={{ padding: 20 }}>
      <h1>Contador: </h1>
      <button onClick={() => counterStore.increment()}>+</button>
      <button onClick={() => counterStore.decrement()}>-</button>

      <hr />
      <UserForm />
    </main>
  );
});

export default Teste;
