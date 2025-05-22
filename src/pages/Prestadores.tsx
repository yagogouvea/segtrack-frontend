import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { User } from "lucide-react";

const Prestadores = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User size={20} /> Prestadores de Serviço
        </h1>
        <p className="text-gray-500 mt-2">Lista de prestadores cadastrados</p>
      </div>
    </DashboardLayout>
  );
};

export default Prestadores;
