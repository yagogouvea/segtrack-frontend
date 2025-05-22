import React, { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";


export default function ClienteForm() {
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
  });

  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/clientes", form);
      setMsg("Cliente cadastrado com sucesso!");
      setForm({ nome: "", cnpj: "", email: "", telefone: "" });
    } catch (err) {
      setMsg("Erro ao cadastrar cliente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
      <input type="text" placeholder="CNPJ" required value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
      <input type="email" placeholder="E-mail" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="text" placeholder="Telefone" required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
      <button type="submit">Cadastrar Cliente</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
