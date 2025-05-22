import React, { useState, useEffect } from 'react';
import { DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ocorrencia } from '../../types/ocorrencia';
import axios from 'axios';

interface Props {
  ocorrencia: Ocorrencia;
  onUpdate: (update: (prev: Ocorrencia[]) => Ocorrencia[]) => void;
  onClose: () => void;
}

// 🔧 Corrige o timezone e converte para o formato que o input espera
const toInputLocal = (isoDate: string | Date): string => {
  const d = new Date(isoDate);
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d.getTime() - tzOffset).toISOString();
  return localISO.slice(0, 16);
};

const HorariosPopup: React.FC<Props> = ({ ocorrencia, onUpdate }) => {
  const [inicio, setInicio] = useState('');
  const [chegada, setChegada] = useState('');
  const [termino, setTermino] = useState('');

  useEffect(() => {
    setInicio(ocorrencia.inicio ? toInputLocal(ocorrencia.inicio) : '');
    setChegada(ocorrencia.chegada ? toInputLocal(ocorrencia.chegada) : '');
    setTermino(ocorrencia.termino ? toInputLocal(ocorrencia.termino) : '');
  }, [ocorrencia]);

  const salvar = async () => {
    try {
      const payload: any = {};
      if (inicio) payload.inicio = inicio;
      if (chegada) payload.chegada = chegada;
      if (termino) payload.termino = termino;

      if (Object.keys(payload).length === 0) {
        alert('Preencha pelo menos um horário.');
        return;
      }

      const { data } = await axios.put(`/api/ocorrencias/${ocorrencia.id}`, payload);

      onUpdate(prev =>
        prev.map(o => (o.id === data.id ? data : o))
      );
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white shadow-lg w-full max-w-sm mx-auto my-auto border border-gray-200">
      <DialogTitle className="text-lg font-bold text-blue-700 text-center">Editar Horários</DialogTitle>
      <DialogDescription className="sr-only">
        Informe os horários de início, local e término da ocorrência.
      </DialogDescription>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Início</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-500"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Local</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-500"
            value={chegada}
            onChange={(e) => setChegada(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Término</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-500"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="destructive">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={salvar}>Salvar</Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default HorariosPopup;
