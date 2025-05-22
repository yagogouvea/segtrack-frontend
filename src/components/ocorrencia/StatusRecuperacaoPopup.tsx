import React, { useState } from 'react';
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Ocorrencia } from '@/types/ocorrencia';

interface Props {
  ocorrencia: Ocorrencia;
  onUpdate: (dados: Partial<Ocorrencia>) => void;
  onClose: () => void;
}

const StatusRecuperacaoPopup: React.FC<Props> = ({ ocorrencia, onUpdate, onClose }) => {
  const [status, setStatus] = useState<'Recuperado' | 'Não Recuperado' | 'Cancelado'>(
    (ocorrencia.resultado as any) || 'Recuperado'
  );

  const salvarStatus = () => {
    onUpdate({ resultado: status });
    onClose();
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Status de Recuperação</DialogTitle>
      </DialogHeader>

      <RadioGroup value={status} onValueChange={value => setStatus(value as any)}>
        {['Recuperado', 'Não Recuperado', 'Cancelado'].map(opcao => (
          <div key={opcao} className="flex items-center space-x-2">
            <RadioGroupItem value={opcao} id={opcao} />
            <Label htmlFor={opcao}>{opcao}</Label>
          </div>
        ))}
      </RadioGroup>

      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button variant="destructive">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={salvarStatus}>Salvar</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default StatusRecuperacaoPopup;
