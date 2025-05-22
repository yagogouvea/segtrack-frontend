import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

interface LoginResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  return response.data;
}
