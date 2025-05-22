// src/types/cliente.ts

export interface Contrato {
  id?: number;
  cliente_id?: number;
  nome_interno: string;
  tipo: 'acionamento' | 'fixo';
  valor_acionamento?: number | null;
  franquia_horas?: number | null;
  franquia_km?: number | null;
  valor_hora_extra?: number | null;
  valor_km_extra?: number | null;
  valor_fixo?: number | null;
}

export interface Cliente {
  id?: number;
  nome: string;
  cnpj: string;
  contato1: string;
  contato2?: string;
  telefone1: string;
  telefone2?: string;
  email1: string;
  email2?: string;
  contratos: Contrato[];
}
