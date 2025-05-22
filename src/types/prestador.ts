export interface Prestador {
  id?: number;
  nome: string;
  cpf: string;
  cod_nome?: string;
  telefone?: string;
  email?: string;
  aprovado?: boolean;
  funcoes?: string[];
  regioes?: string[];
  tipo_pix?: string;
  chave_pix?: string;
  valor_acionamento?: string;
  franquia_horas?: string;
  franquia_km?: string;
  valor_hora_adc?: string;
  valor_km_adc?: string;
  cep?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}
