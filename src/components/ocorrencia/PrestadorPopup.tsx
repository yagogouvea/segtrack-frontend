import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { Ocorrencia } from '@/pages/OcorrenciasDashboard';
import axios from 'axios';

interface Prestador {
  id: number;
  nome: string;
  cod_nome: string | null;
}

interface Props {
  ocorrencia: Ocorrencia;
  onUpdate: (ocorrenciaAtualizada: Ocorrencia) => void;
  onClose: () => void;
}

const PrestadorPopup: React.FC<Props> = ({ ocorrencia, onUpdate, onClose }) => {
  const [selecionado, setSelecionado] = useState(ocorrencia.prestador || '');
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetch('/api/prestadores/popup')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrestadores(data);
        } else {
          console.error('Formato inesperado de prestadores:', data);
          setPrestadores([]);
        }
      })
      .catch(err => console.error('Erro ao carregar prestadores:', err));
  }, []);

  useEffect(() => {
    setSelecionado(ocorrencia.prestador || '');
  }, [ocorrencia.id]);

  const salvar = async () => {
    try {
      const { data } = await axios.put(`/api/ocorrencias/${ocorrencia.id}`, {
        prestador: selecionado,
      });
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar prestador:', error);
      alert('Erro ao salvar prestador. Tente novamente.');
    }
  };

  const normalize = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const filtrados =
    filtro.trim().length >= 2
      ? prestadores.filter(p =>
          normalize(`${p.nome} ${p.cod_nome ?? ''}`).includes(normalize(filtro))
        )
      : [];

  return (
    <div className="p-4 max-h-[90vh] overflow-y-auto">
      <DialogTitle asChild>
        <h3 className="text-lg font-semibold mb-4">Selecionar Prestador</h3>
      </DialogTitle>
      <DialogDescription asChild>
        <p className="sr-only">Escolha um prestador para vincular à ocorrência</p>
      </DialogDescription>

      <Input
        placeholder="Buscar por nome ou codinome..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="mb-3"
      />

      <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
        {filtrados.map(p => (
          <label key={p.id} className="block text-sm cursor-pointer">
            <input
              type="radio"
              name="prestador"
              value={p.nome}
              checked={selecionado === p.nome}
              onChange={() => setSelecionado(p.nome)}
              className="mr-2"
            />
            {p.nome} {p.cod_nome && `(${p.cod_nome})`}
          </label>
        ))}
        {filtro.length >= 2 && filtrados.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum prestador encontrado.</p>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="destructive" onClick={onClose}>Cancelar</Button>
        <Button onClick={salvar} disabled={!selecionado}>Salvar</Button>
      </div>
    </div>
  );
};

export default PrestadorPopup;
