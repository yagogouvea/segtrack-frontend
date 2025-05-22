import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  active: boolean;
  password?: string; // opcional, usado apenas na criação
}

const API_URL = 'http://localhost:3001/api/users';

// Lista todos os usuários
export async function getUsers(): Promise<User[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get<User[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Cria um novo usuário
export async function createUser(user: Partial<User>): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.post(API_URL, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Atualiza um usuário existente
export async function updateUser(id: string, user: Partial<User>): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.put(`${API_URL}/${id}`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Exclui um usuário pelo ID
export async function deleteUser(id: string): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
