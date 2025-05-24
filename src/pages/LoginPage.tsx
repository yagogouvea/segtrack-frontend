import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const { token } = await loginRequest(email, password);
      login(token);
      navigate('/usuarios');
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/bg-login.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl w-96 max-w-md text-center backdrop-blur-sm">
        <img
          src="/uploads/Logo-segtrack.png"
          alt="Logo SEGTRACK"
          className="w-40 h-auto mx-auto mb-6 drop-shadow-lg"
        />
        <h2 className="text-xl font-bold mb-4 text-gray-800">Login SEGTRACK</h2>

        {erro && <p className="text-red-600 mb-4">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 shadow-md transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
