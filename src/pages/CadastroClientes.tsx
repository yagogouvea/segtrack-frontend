import React, { useEffect, useState } from "react";
import ClientePopup from "@/components/ClientePopup";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
}

const CadastroClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [popupAberto, setPopupAberto] = useState(false);
  const [clienteEdicao, setClienteEdicao] = useState<Cliente | null>(null);

  const carregarClientes = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/clientes");
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleEditar = (cliente: Cliente) => {
    setClienteEdicao(cliente);
    setPopupAberto(true);
  };

  const handleExcluir = async (id: number) => {
    if (!confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await fetch(`http://localhost:3001/api/clientes/${id}`, {
        method: "DELETE",
      });
      carregarClientes();
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Cadastro de Clientes</h1>
        <Button onClick={() => {
          setClienteEdicao(null);
          setPopupAberto(true);
        }}>
          + Novo Cliente
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">CNPJ</th>
              <th className="p-2 text-left">Telefone</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-t">
                <td className="p-2">{cliente.nome}</td>
                <td className="p-2">{cliente.cnpj}</td>
                <td className="p-2">{cliente.telefone}</td>
                <td className="p-2">{cliente.email}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <Button size="sm" variant="ghost" onClick={() => handleEditar(cliente)}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleExcluir(cliente.id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupAberto && (
        <ClientePopup
          onClose={() => setPopupAberto(false)}
          onSave={() => {
            carregarClientes();
            setPopupAberto(false);
          }}
          clienteEdicao={clienteEdicao}
        />
      )}
    </div>
  );
};

export default CadastroClientes;