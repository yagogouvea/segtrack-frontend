import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { Ocorrencia } from "@/types/ocorrencia";
import axios from 'axios';

interface Props {
  ocorrencia: Ocorrencia;
  onUpdate: (ocorrenciaAtualizada: Ocorrencia) => void;
  onClose: () => void;
}

const tipos = ['Pedágio', 'Alimentação', 'Uber', 'Outros'];

const DespesasPopup: React.FC<Props> = ({ ocorrencia, onUpdate, onClose }) => {
  const [despesas, setDespesas] = useState<{ tipo: string; valor: string }[]>([]);

  useEffect(() => {
    if (ocorrencia.despesas_detalhadas && Array.isArray(ocorrencia.despesas_detalhadas)) {
      const detalhadas = ocorrencia.despesas_detalhadas.map((d: any) => ({
        tipo: d.tipo,
        valor: d.valor.toFixed(2).replace('.', ',')
      }));
      setDespesas(detalhadas);
    } else if (ocorrencia.despesas && ocorrencia.despesas > 0) {
      setDespesas([{ tipo: 'Outros', valor: ocorrencia.despesas.toFixed(2).replace('.', ',') }]);
    }
  }, [ocorrencia]);

  const formatarMoeda = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');
  const numero = parseFloat(numeros) / 100;
  return numero.toFixed(2).replace('.', ','); // ✅ Corrigido para "11,42"
};


  const adicionarDespesa = () => {
    setDespesas([...despesas, { tipo: '', valor: '' }]);
  };

  const atualizarCampo = (index: number, campo: 'tipo' | 'valor', valor: string) => {
    const novas = [...despesas];
    if (campo === 'valor') {
      novas[index][campo] = formatarMoeda(valor);
    } else {
      novas[index][campo] = valor;
    }
    setDespesas(novas);
  };

  const formatarParaNumero = (valor: string) =>
    parseFloat(valor.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')) || 0;

  const salvar = async () => {
    try {
      const total = despesas.reduce((acc, d) => acc + formatarParaNumero(d.valor), 0);
      const despesasDetalhadas = despesas.map(d => ({
        tipo: d.tipo,
        valor: formatarParaNumero(d.valor)
      }));

      const { data } = await axios.put(`/api/ocorrencias/${ocorrencia.id}`, {
        despesas: total,
        despesas_detalhadas: despesasDetalhadas
      });

      onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar despesas:', error);
      alert('Erro ao salvar despesas. Tente novamente.');
    }
  };

  return (
    <div className="p-4 space-y-4 w-full max-w-lg">
      <DialogTitle asChild>
        <h3 className="text-lg font-semibold">Despesas da Ocorrência</h3>
      </DialogTitle>
      <DialogDescription asChild>
        <p className="sr-only">Formulário para editar despesas vinculadas à ocorrência</p>
      </DialogDescription>

      {despesas.map((despesa, index) => (
        <div key={index} className="flex items-center gap-3">
          <select
            value={despesa.tipo}
            onChange={(e) => atualizarCampo(index, 'tipo', e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Tipo</option>
            {tipos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <Input
            type="text"
            placeholder="R$ 0,00"
            value={despesa.valor}
            onChange={(e) => atualizarCampo(index, 'valor', e.target.value)}
            className="w-32"
            inputMode="numeric"
          />
        </div>
      ))}

      <Button onClick={adicionarDespesa}>+ Adicionar nova despesa</Button>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="destructive" onClick={onClose}>Cancelar</Button>
        <Button onClick={salvar} disabled={despesas.length === 0}>Salvar</Button>
      </div>
    </div>
  );
};

export default DespesasPopup;
