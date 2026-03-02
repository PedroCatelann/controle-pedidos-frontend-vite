"use client";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  nome: string;
  email: string;
};

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Dados enviados:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nome:</label>
        <input {...register("nome", { required: "Campo obrigatório" })} />
        {errors.nome && <p>{errors.nome.message}</p>}
      </div>

      <div>
        <label>Email:</label>
        <input {...register("email", { required: "Campo obrigatório" })} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
}
