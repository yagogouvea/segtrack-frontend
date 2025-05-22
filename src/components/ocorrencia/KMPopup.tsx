import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Ocorrencia } from "@/types/ocorrencia";
import axios from 'axios';

interface Props {
  ocorrencia: Ocorrencia;
  onUpdate: (ocorrenciaAtualizada: Ocorrencia) => void;
  onClose: () => void;
}

const KMPopup: React.FC<Props> = ({ ocorrencia, onUpdate, onClose }) => {
  const [inicial, setInicial] = useState('');
  const [final, setFinal] = useState('');

  useEffect(() => {
    setInicial(ocorrencia.km_inicial != null ? String(ocorrencia.km_inicial) : '');
    setFinal(ocorrencia.km_final != null ? String(ocorrencia.km_final) : '');
  }, [ocorrencia.id]);

  const salvar = async () => {
    const kmInicial = parseFloat(inicial);
    const kmFinal = parseFloat(final);
    const kmTotal = kmFinal - kmInicial;

    if (isNaN(kmInicial) || isNaN(kmFinal) || kmTotal < 0) {
      alert('Valores de KM inválidos.');
      return;
    }

    try {
      const { data } = await axios.put(`/api/ocorrencias/${ocorrencia.id}`, {
        km: kmTotal,
        km_inicial: kmInicial,
        km_final: kmFinal
      });

      console.log("Resposta do PUT:", data);

      onUpdate(data); // ✅ envia o objeto Ocorrencia diretamente
      onClose(); // fecha o popup
    } catch (error) {
      console.error('Erro ao salvar KM:', error);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  return (
    <div className="p-4 w-80">
      <DialogTitle className="text-lg font-bold mb-4 text-blue-700">Editar KM</DialogTitle>
      <DialogDescription className="sr-only">
        Informe o KM inicial e final para calcular a distância total.
      </DialogDescription>
      <div className="space-y-3">
        <div>
          <label className="text-sm block">KM Inicial</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={inicial}
            onChange={e => setInicial(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm block">KM Final</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={final}
            onChange={e => setFinal(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="destructive">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={salvar}>Salvar</Button>
          </DialogClose>
        </div>
      </div>
    </div>
  );
};

export default KMPopup;
