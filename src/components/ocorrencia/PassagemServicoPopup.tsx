import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogTitle } from '@/components/ui/dialog';
import { Ocorrencia } from '@/types/ocorrencia';
import axios from 'axios';

import { CopyCheck } from 'lucide-react';

type Props = {
  ocorrencia: Ocorrencia;
  onUpdate: (dados: Partial<Ocorrencia>) => void;
  onClose: () => void;
};

const formatarData = (data?: string) =>
  data ? new Date(data).toLocaleDateString('pt-BR') : '-';

const formatarDataHora = (data?: string) =>
  data ? new Date(data).toLocaleString('pt-BR') : '-';

const definirMacro = (estado?: string, cidade?: string): string => {
  if (!estado) return '';
  if (estado !== 'SP') return 'OUTROS ESTADOS';
  if (cidade?.toUpperCase().includes('SÃO PAULO')) return 'CAPITAL';
  if (
    [
      'SANTO ANDRÉ', 'SÃO BERNARDO', 'SÃO CAETANO', 'DIADEMA', 'MAUÁ',
      'GUARULHOS', 'OSASCO', 'TABOÃO DA SERRA', 'CARAPICUÍBA',
      'EMBU DAS ARTES', 'ITAPEVI', 'COTIA', 'BARUERI'
    ].some(c => cidade?.toUpperCase().includes(c))
  ) return 'GRANDE SP';
  return 'INTERIOR';
};

const gerarTextoPassagem = (o: Ocorrencia, telefone?: string) => {
  const desp1 = o.despesas_detalhadas?.[0];
  const desp2 = o.despesas_detalhadas?.[1];
  const isIturan = o.cliente.toLowerCase().includes('ituran');
  const statusRecuperacao = o.resultado && o.resultado.trim() !== '' ? o.resultado : 'Não informado';

  return `🚨 *PASSAGEM DE SERVIÇO* 🚨

📆 *DATA:* ${formatarData(o.data_acionamento)}
🏢 *CLIENTE:* ${o.cliente}
📊 *STATUS:* ${statusRecuperacao}

🚗 *VEÍCULO*
• *Placa:* ${o.placa1}
• *Tipo:* ${o.tipo}
${isIturan && o.os ? `• *OS:* ${o.os}` : ''}
• *Modelo:* ${o.modelo1 ?? ''}
• *Cor:* ${o.cor1 ?? ''}

🕐 *HORÁRIOS*
• *Início:* ${formatarDataHora(o.inicio)}
• *Chegada:* ${formatarDataHora(o.chegada)}
• *Término:* ${formatarDataHora(o.termino)}

👥 *APOIO*
• *Nome:* ${o.prestador ?? ''}
• *Telefone:* ${telefone ?? ''}

🌍 *LOCALIZAÇÃO*
• *Macro:* ${definirMacro(o.origem_estado, o.origem_cidade)}
• *Origem:* ${isIturan ? `${o.origem_bairro ?? ''}, ${o.origem_cidade ?? ''}, ${o.origem_estado ?? ''}` : '---'}
• *Destino:* ${o.bairro ?? ''}, ${o.cidade ?? ''}, ${o.estado ?? ''}

📏 *QUILOMETRAGEM*
• *Inicial:* ${o.km_inicial ?? ''}
• *Final:* ${o.km_final ?? ''}
• *Total:* ${o.km ?? ''} km

💸 *DESPESAS*
${desp1 ? `• Despesa 1: R$ ${desp1.valor?.toFixed(2)} (${desp1.tipo})` : ''}
${desp2 ? `• Despesa 2: R$ ${desp2.valor?.toFixed(2)} (${desp2.tipo})` : ''}`.trim();
};

const PassagemServicoPopup = ({ ocorrencia, onUpdate, onClose }: Props) => {
  const [texto, setTexto] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      console.log('📦 Ocorrência recebida no PassagemServicoPopup:', ocorrencia);
      let telefone = '';
      try {
        if (ocorrencia.prestador) {
          const res = await axios.get(`/api/prestadores/buscar-por-nome/${encodeURIComponent(ocorrencia.prestador)}`);
          telefone = res.data?.telefone || '';
        }
      } catch (err) {
        console.warn('Prestador não encontrado ou erro de conexão:', err);
      }
      const textoGerado = gerarTextoPassagem(ocorrencia, telefone);
      setTexto(textoGerado);

      try {
        await navigator.clipboard.writeText(textoGerado);
        console.log('📋 Texto copiado para a área de transferência');
      } catch (err) {
        console.error('❌ Falha ao copiar automaticamente', err);
      }
    };
    carregarDados();
  }, [ocorrencia]);

  return (
    <div className="space-y-4">
      <DialogTitle>Passagem de Serviço</DialogTitle>
      <Textarea
        value={texto}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTexto(e.target.value)}
        className="min-h-[300px]"
      />
      <div className="text-right">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(texto);
            onUpdate({ passagem_servico: texto, resultado: ocorrencia.resultado });
            onClose();
          }}
        >
          <CopyCheck className="mr-2 h-4 w-4" /> Copiar
        </Button>
      </div>
    </div>
  );
};

export default PassagemServicoPopup;
