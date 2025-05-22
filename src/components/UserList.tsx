import React from "react";
import { User } from "../services/userService";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void; // ✅ adicionada
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border">Nome</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Perfil</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border capitalize">{user.role}</td>
              <td className="px-4 py-2 border">{user.active ? "Ativo" : "Inativo"}</td>
              <td className="px-4 py-2 border">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
