import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import type { Ocorrencia } from '@/types/ocorrencia';

import { DialogClose, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';

interface Props {
  ocorrencia: Ocorrencia;
  onUpdate: (ocorrenciaAtualizada: Ocorrencia) => void;
}

const DescricaoPopup: React.FC<Props> = ({ ocorrencia, onUpdate }) => {
  const [descricao, setDescricao] = useState(ocorrencia.descricao || '');
  const [descricaoInicial, setDescricaoInicial] = useState(ocorrencia.descricao || '');

  const salvar = async () => {
    try {
      const { data } = await axios.put(`/api/ocorrencias/${ocorrencia.id}`, { descricao });
      onUpdate(data);
      setDescricaoInicial(descricao);
    } catch (error) {
      console.error('Erro ao salvar descrição:', error);
    }
  };

  const cancelar = () => {
    setDescricao(descricaoInicial);
  };

  return (
    <div className="p-6 max-w-4xl w-full mx-auto bg-white rounded shadow-lg h-auto max-h-screen overflow-y-auto">
      <DialogTitle asChild>
        <h3 className="text-xl font-semibold mb-4">Descrição da Ocorrência</h3>
      </DialogTitle>
      <DialogDescription asChild>
        <p className="sr-only">Formulário para editar descrição da ocorrência</p>
      </DialogDescription>

      <textarea
        className="w-full max-w-full border rounded p-3 text-base h-64 max-h-[600px] resize-y overflow-auto"
        placeholder="Relate os detalhes da ocorrência..."
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <div className="mt-6 flex justify-end gap-3">
        <DialogClose asChild>
          <Button variant="destructive" onClick={cancelar}>Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={salvar}>Salvar</Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default DescricaoPopup;
