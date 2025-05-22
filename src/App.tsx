import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import OcorrenciasDashboard from "./pages/OcorrenciasDashboard";
import TratarOcorrencia from "./pages/TratarOcorrencia";
import CadastroClientes from "./pages/CadastroClientes";
import CadastroPrestadores from "./pages/CadastroPrestadores";
import Relatorios from "./pages/relatorios";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";

import DashboardLayout from "./components/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";

import {
  LayoutDashboard,
  UserCog,
  Briefcase,
  FileText,
  User,
  DollarSign,
  Clock
} from "lucide-react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sidebarButtons = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/" },
  { label: "Ocorrências", icon: <Clock size={18} />, href: "/ocorrencias" },
  { label: "Prestadores", icon: <UserCog size={18} />, href: "/cadastro-prestadores" },
  { label: "Financeiro", icon: <DollarSign size={18} />, href: "/financeiro" },
  { label: "Clientes", icon: <Briefcase size={18} />, href: "/cadastro-clientes" },
  { label: "Relatórios", icon: <FileText size={18} />, href: "/relatorios" },
  { label: "Usuários", icon: <User size={18} />, href: "/usuarios" }
];

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas com layout */}
          <Route
            path="/*"
            element={
              <RequireAuth>
                <DashboardLayout sidebarButtons={sidebarButtons}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cadastro-clientes" element={<CadastroClientes />} />
                    <Route path="/cadastro-prestadores" element={<CadastroPrestadores />} />
                    <Route path="/ocorrencias" element={<OcorrenciasDashboard />} />
                    <Route path="/tratar-ocorrencia/:id" element={<TratarOcorrencia />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                    <Route path="/usuarios" element={<UsersPage />} />
                  </Routes>
                </DashboardLayout>
              </RequireAuth>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
