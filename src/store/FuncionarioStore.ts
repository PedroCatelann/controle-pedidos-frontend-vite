import { apiBackEnd } from "@/services/api";
import { Funcionario, FuncionarioResponse } from "@/services/models";
import { AxiosError } from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

export class FuncionarioStore {
  private currentFuncionario: Funcionario | null = null;
  private _listaFuncionarios: Funcionario[] = [];
  private saveInfoSearch: FuncionarioResponse | null = null;
  isLoading: boolean = false;

  public responseData = {
    typeRequest: "",
    statusRequest: 0,
  };

  constructor() {
    // 3. Torna todas as propriedades e métodos na classe
    // observáveis e actions automaticamente (exceto o constructor).
    makeAutoObservable(this, {
      isLoading: observable,
      incluirFuncionario: action,
      clean: action,
    });
  }

  clean() {
    this.currentFuncionario = null;
    this.isLoading = false;
    this.responseData = {
      typeRequest: "",
      statusRequest: 0,
    };
  }

  async incluirFuncionario(funcionario: Funcionario) {
    this.isLoading = true;
    try {
      await apiBackEnd.post("/funcionarios", funcionario);
    } catch (err) {
      const error = err as AxiosError<any>;
      runInAction(() => {
        this.isLoading = false;
      });
      throw error;
    }
  }

  async editarFuncionario(_id: number, funcionario: Funcionario) {
    this.isLoading = true;
    try {
      await apiBackEnd.put(`/funcionarios`, funcionario);
    } catch (err) {
      const error = err as AxiosError<any>;
      runInAction(() => {
        this.isLoading = false;
      });
      throw error;
    }
  }

  async getFuncionario(id: number): Promise<Funcionario | null> {
    this.isLoading = true;

    try {
      const response = await apiBackEnd.get(`/funcionarios/${id}`);
      const funcionario = response.data as Funcionario;
      this.currentFuncionario = funcionario;
      runInAction(() => {
        this.isLoading = false;
      });
      return funcionario;
    } catch (err) {    
      const error = err as AxiosError<any>;
      runInAction(() => {
        this.isLoading = false;
      });
      throw error;
    }
  }

  async deleteFuncionario(id: number) {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      await apiBackEnd.delete(`/funcionarios/${id}`);
    } catch (err) {
      const error = err as AxiosError<any>;
      runInAction(() => {
        this.isLoading = false;
      });
      throw error;
    }
  }

  async listarFuncionarios(func: FuncionarioResponse) {
    runInAction(() => {
      this.isLoading = true;
    });

    console.log("func", func);

    try {
      const response = await apiBackEnd.get("/funcionarios/listar", {
        params: {
          nome: func.nome ?? "",
        },
      });
      this._listaFuncionarios = response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      runInAction(() => {
        this.isLoading = false;
      });
      throw error;
    }
  }

  saveInfoToSearch(func: FuncionarioResponse) {
    this.saveInfoSearch = func;
  }

  get listaFuncionarios() {
    return this._listaFuncionarios;
  }

  get funcionarioAtual() {
    return this.currentFuncionario;
  }

  get infoToSearch() {
    return this.saveInfoSearch;
  }
}

export const funcionarioStore = new FuncionarioStore();
