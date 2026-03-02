import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Pedidos from "@/pages/Pedidos";
import PedidosEntregues from "@/pages/PedidosEntregues";
import PedidoOperacoes from "@/pages/PedidoOperacoes";
import PedidoEntregueOperacoes from "@/pages/PedidoEntregueOperacoes";
import Metricas from "@/pages/Metricas";
import Admin from "@/pages/Admin";
import Funcionarios from "@/pages/Funcionarios";
import FuncionarioOperacoes from "@/pages/FuncionarioOperacoes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/pedidos"
        element={
          <DashboardLayout>
            <Pedidos />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/pedidos/operacoes/:id"
        element={
          <DashboardLayout>
            <PedidoOperacoes />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/pedidos-entregues"
        element={
          <DashboardLayout>
            <PedidosEntregues />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/pedidos-entregues/operacoes/:id"
        element={
          <DashboardLayout>
            <PedidoEntregueOperacoes />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/metricas"
        element={
          <DashboardLayout>
            <Metricas />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Admin />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/funcionario"
        element={
          <AdminLayout>
            <Funcionarios />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/funcionario/operacoes/:id"
        element={
          <AdminLayout>
            <FuncionarioOperacoes />
          </AdminLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
