import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import PermissionSelector from "./PermissionSelector";
import { User, createUser, updateUser } from "../services/userService";
import { PERMISSIONS, ROLE_PERMISSIONS } from "../constants/permissions";
import { toast } from "react-toastify";

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
  onSave: () => void;
}

export default function UserForm({ user, onClose, onSave }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User & { password?: string }>>({
    name: "",
    email: "",
    role: "operador",
    permissions: [],
    active: true,
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "operador",
        permissions: user.permissions || [],
        active: user.active !== false,
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" && "checked" in target ? target.checked : value,
      };

      if (name === "role" && value in ROLE_PERMISSIONS) {
        updated.permissions = ROLE_PERMISSIONS[value as keyof typeof ROLE_PERMISSIONS];
      }

      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (user?.id) {
        await updateUser(user.id, formData);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await createUser(formData);
        toast.success("Usuário criado com sucesso!");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Erro ao salvar usuário. Verifique os dados.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">{user ? "Editar Usuário" : "Novo Usuário"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            className="w-full border p-2 rounded"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
          {!user?.id && (
            <input
              type="password"
              name="password"
              placeholder="Senha"
              className="w-full border p-2 rounded"
              value={formData.password || ""}
              onChange={handleChange}
              required
            />
          )}
          <select
            name="role"
            className="w-full border p-2 rounded"
            value={formData.role || ""}
            onChange={handleChange}
          >
            <option value="admin">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="operador">Operador</option>
          </select>

          <PermissionSelector
            selected={formData.permissions || []}
            onChange={(permissions: string[]) =>
              setFormData((prev) => ({ ...prev, permissions }))
            }
            availablePermissions={PERMISSIONS}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active ?? true}
              onChange={handleChange}
            />
            Usuário ativo
          </label>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
