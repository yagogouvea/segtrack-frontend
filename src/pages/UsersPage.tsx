import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import { User, getUsers, deleteUser } from "../services/userService";
import { toast } from "react-toastify";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await getUsers();
    setUsers(response);
  };

  const handleDelete = async (userId: string) => {
    const confirm = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirm) return;

    try {
      await deleteUser(userId);
      toast.success("Usuário excluído com sucesso!");
      loadUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gerenciamento de Usuários</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setSelectedUser(null);
          setShowForm(true);
        }}
      >
        + Novo Usuário
      </button>

      <UserList
        users={users}
        onEdit={(user: User) => {
          setSelectedUser(user);
          setShowForm(true);
        }}
        onDelete={handleDelete} // ✅ envia a função para o UserList
      />

      {showForm && (
        <UserForm
          user={selectedUser}
          onClose={() => setShowForm(false)}
          onSave={loadUsers}
        />
      )}
    </div>
  );
}
