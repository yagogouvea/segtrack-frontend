export type Ocorrencia = {
  id: number;

  // Dados principais
  cliente: string;
  tipo: string;
  status?: string;

  // Placas e dados do veículo
  placa1: string;
  placa2?: string;
  placa3?: string;
  modelo1?: string;
  cor1?: string;
  tipo_veiculo?: string;

  // Localização
  coordenadas?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  // Prestador e horários
  prestador?: string;
  inicio?: string;
  chegada?: string;
  termino?: string;

  // Quilometragem
  km?: number;
  km_inicial?: number;
  km_final?: number;

  // Despesas
  despesas?: number;
  despesas_detalhadas?: {
    tipo: string;
    valor: number;
  }[];

  // Detalhamento e conclusão
  descricao?: string;
  resultado?: string;
  encerradaEm?: string;
  data_acionamento?: string;

  // Fotos relacionadas
  fotos?: {
    id?: number;
    url: string;
    legenda?: string;
  }[];

  // Auxiliar visual
  tem_fotos?: boolean;

  // Campos adicionais
  os?: string;
  origem_bairro?: string;
  origem_cidade?: string;
  origem_estado?: string;
  cpf_condutor?: string;
  nome_condutor?: string;
  transportadora?: string;
  valor_carga?: number;
  notas_fiscais?: string;

  // Controle interno
  criado_em?: string;

  // Novo campo adicionado
  passagem_servico?: string;
};
