import React, { useState, 
useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, MapPin, User, DollarSign, Image, FileText, Edit } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import HorariosPopup from '@/components/ocorrencia/HorariosPopup';
import KMPopup from '@/components/ocorrencia/KMPopup';
import PrestadorPopup from '@/components/ocorrencia/PrestadorPopup';
import FotosPopup from '@/components/ocorrencia/FotosPopup';
import DescricaoPopup from '@/components/ocorrencia/DescricaoPopup';
import EditarDadosPopup from '@/components/ocorrencia/EditarDadosPopup';
import DespesasPopup from '@/components/ocorrencia/DespesasPopup';
import AdicionarOcorrenciaPopup from '@/components/ocorrencia/AdicionarOcorrenciaPopup';
import StatusRecuperacaoPopup from '@/components/ocorrencia/StatusRecuperacaoPopup';


import { Ocorrencia } from "@/types/ocorrencia";

const OcorrenciasPage: React.FC = () => {

  const atualizarOcorrencia = (atualizada: Ocorrencia) => {
    setOcorrencias(prev =>
      prev.map(o => (o.id === atualizada.id ? { ...o, ...atualizada } : o))
    );
  };

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [dialogAberto, setDialogAberto] = useState<{ id: number; tipo: string } | null>(null);
  const [novoDialogAberto, setNovoDialogAberto] = useState<boolean>(false);

  useEffect(() => {
    const carregarOcorrencias = async () => {
      try {
        const res = await axios.get('/api/ocorrencias');
        const data = res.data;

        if (Array.isArray(data)) {
          setOcorrencias(data);
        } else {
          console.warn('⚠️ API não retornou um array de ocorrências:', data);
          setOcorrencias([]);
        }
      } catch (err) {
        console.error('❌ Erro ao carregar ocorrências:', err);
        setOcorrencias([]);
      }
    };

    carregarOcorrencias();
  }, []);



useEffect(() => {
  if (dialogAberto?.tipo === 'editar') {
    const selecionada = ocorrencias.find(o => o.id === dialogAberto.id);
    console.log('🔍 Ocorrência para edição:', selecionada);
  }
}, [dialogAberto, ocorrencias]);


const formatarDataHora = (isoString?: string | null): string => {
  if (!isoString) return '';
  const data = new Date(isoString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};


 const finalizarOcorrencia = async (id: number) => {
  try {
    const resposta = await fetch(`/api/ocorrencias/${id}/encerrar`, {
      method: 'POST',
    });

    if (!resposta.ok) {
      throw new Error('Erro ao encerrar ocorrência');
    }

    const encerrada = await resposta.json();

    setOcorrencias(prev =>
      prev.map(o =>
        o.id === id ? encerrada : o
      )
    );
  } catch (erro) {
    console.error('Erro ao encerrar ocorrência:', erro);
    alert('Falha ao encerrar ocorrência.');
  }
};

  const emAndamento = Array.isArray(ocorrencias)
    ? ocorrencias.filter(o => o.status === 'Em andamento')
    : [];
const finalizadas = Array.isArray(ocorrencias)
    ? ocorrencias.filter(o => o.status === 'encerrada' && o.encerradaEm &&
        (new Date().getTime() - new Date(o.encerradaEm).getTime()) / 3600000 <= 24)
    : [];


  const renderEtapas = (oc: Ocorrencia) => {
    const isCompleto = {
      horarios: !!(oc.inicio && oc.chegada && oc.termino),
      km: oc.km != null,
      prestador: !!oc.prestador,
      despesas: !!(oc.despesas && oc.despesas > 0),
      fotos: !!(oc.fotos && oc.fotos.length > 0),
      descricao: !!(oc.descricao && oc.descricao.length > 10),
      recuperacao: !!oc.resultado
    };

    const estilo = (completo: boolean) =>
      `relative rounded p-1 ${completo ? 'bg-green-500' : 'bg-gray-200'}`;

    const iconeCheck = (
      <Check className="absolute -top-2 -right-2 bg-white text-green-600 rounded-full w-4 h-4" />
    );

    return (
      <div className="flex gap-2 text-blue-600">
        <div className={estilo(isCompleto.horarios)}>
          {isCompleto.horarios && iconeCheck}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" title="Editar Horários">
                <Clock size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <HorariosPopup ocorrencia={oc} onUpdate={setOcorrencias} onClose={() => setDialogAberto(null)} />
            </DialogContent>
          </Dialog>
        </div>
       <div className={estilo(isCompleto.km)}>
  {isCompleto.km && iconeCheck}
  <Dialog
    open={dialogAberto?.id === oc.id && dialogAberto.tipo === 'km'}
    onOpenChange={(open) => {
      if (!open) setDialogAberto(null);
      else setDialogAberto({ id: oc.id, tipo: 'km' });
    }}
  >
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" title="Editar KM">
        <MapPin size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <KMPopup
  key={oc.id}
  ocorrencia={ocorrencias.find(o => o.id === oc.id)!}
  onUpdate={(atualizada) =>
    setOcorrencias(prev =>
      prev.map(o => (o.id === atualizada.id ? { ...o, ...atualizada } : o))
    )
  }
  onClose={() => setDialogAberto(null)}
/>

    </DialogContent>
  </Dialog>
</div>

        <div className={estilo(isCompleto.prestador)}>
          {isCompleto.prestador && iconeCheck}
         <div className={estilo(isCompleto.prestador)}>
  {isCompleto.prestador && iconeCheck}
  <Dialog
    open={dialogAberto?.id === oc.id && dialogAberto.tipo === 'prestador'}
    onOpenChange={(open) => {
      if (!open) setDialogAberto(null);
      else setDialogAberto({ id: oc.id, tipo: 'prestador' });
    }}
  >
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        title="Selecionar Prestador"
        onClick={() => setDialogAberto({ id: oc.id, tipo: 'prestador' })}
      >
        <User size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <PrestadorPopup
        ocorrencia={oc}
        onUpdate={(atualizada) =>
          setOcorrencias(prev =>
            prev.map(o => (o.id === atualizada.id ? atualizada : o))
          )
        }
        onClose={() => setDialogAberto(null)}
      />
    </DialogContent>
  </Dialog>
</div>

        </div>
        <div className={estilo(isCompleto.despesas)}>
  {isCompleto.despesas && iconeCheck}
  <Dialog
open={dialogAberto?.id === oc.id && dialogAberto.tipo === 'despesas'}
onOpenChange={(open) => {
  if (!open) setDialogAberto(null);
  else setDialogAberto({ id: oc.id, tipo: 'despesas' });
}}

>
  <DialogTrigger asChild>
    <Button
      variant="ghost"
      size="sm"
      title="Despesas"
      onClick={() => setDialogAberto({ id: oc.id, tipo: 'despesas' })}
    >
      <DollarSign size={16} />
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DespesasPopup
      ocorrencia={oc}
      onUpdate={(atualizada) =>
        setOcorrencias(prev =>
          prev.map(o => (o.id === atualizada.id ? atualizada : o))
        )
      }
      onClose={() => setDialogAberto(null)}
    />
  </DialogContent>
</Dialog>
</div>

      <div className={estilo(!!oc.tem_fotos)}>
  {oc.tem_fotos && iconeCheck}
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" title="Fotos">
        <Image size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent className="fotos-popup">
      <FotosPopup
        ocorrencia={oc}
        onUpdate={(atualizada) =>
          setOcorrencias(prev =>
            prev.map(o => o.id === atualizada.id ? { ...o, ...atualizada } : o)
          )
        }
        onClose={() => setDialogAberto(null)}
      />
    </DialogContent>
  </Dialog>
</div>

<div className={estilo(isCompleto.descricao)}>
  {isCompleto.descricao && iconeCheck}
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" title="Descrição">
        <FileText size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DescricaoPopup
        ocorrencia={oc}
        onUpdate={(atualizada) =>
          setOcorrencias(prev =>
            prev.map(o => o.id === atualizada.id ? { ...o, ...atualizada } : o)
          )
        }
      />
    </DialogContent>
  </Dialog>
</div>

<Dialog>
  <DialogTrigger asChild>
    <Button variant="ghost" size="sm" title="Editar Dados">
      <Edit size={16} />
    </Button>
  </DialogTrigger>
  <DialogContent>
    <EditarDadosPopup
      ocorrencia={oc}
      onUpdate={(atualizada) =>
        setOcorrencias(prev =>
          prev.map(o => o.id === atualizada.id ? { ...o, ...atualizada } : o)
        )
      }
      onClose={() => setDialogAberto(null)}
    />
  </DialogContent>
</Dialog>

<div className={estilo(isCompleto.recuperacao)}>
  {isCompleto.recuperacao && iconeCheck}
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" title="Status de Recuperação">
        <Check size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <StatusRecuperacaoPopup
        ocorrencia={oc}
        onUpdate={async (dados: Partial<Ocorrencia>) => {
          try {
            await axios.put(`/api/ocorrencias/${oc.id}`, dados);
            setOcorrencias(prev =>
              prev.map(o => (o.id === oc.id ? { ...o, ...dados } : o))
            );
          } catch (error) {
            console.error('Erro ao atualizar status de recuperação:', error);
          }
        }}
        onClose={() => setDialogAberto(null)}
      />
    </DialogContent>
  </Dialog>
</div>


      </div>
    );
  };

  const renderTabela = (lista: Ocorrencia[], mostrarAcoes = false) => (
    <table className="w-full text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2">ID</th>
          <th className="p-2">Placa</th>
          <th className="p-2">Cliente</th>
          <th className="p-2">Tipo</th>
          <th className="p-2">Prestador</th>
          <th className="p-2">Horários</th>
          <th className="p-2">KM Total</th>
          <th className="p-2">Despesas</th>
          <th className="p-2">Etapas</th>
          {mostrarAcoes && <th className="p-2">Ações</th>}
        </tr>
      </thead>
      <tbody>
        {lista.map(o => (
          <tr key={o.id} className="border-t">
            <td className="p-2">{o.id}</td>
            <td className="p-2">{o.placa1}</td>
            <td className="p-2">{o.cliente}</td>
            <td className="p-2">{o.tipo}</td>
            <td className="p-2">{o.prestador || '–'}</td>
        <td className="p-2">
  {o.inicio && <div>Início: {formatarDataHora(o.inicio)}</div>}
  {o.chegada && <div>Local: {formatarDataHora(o.chegada)}</div>}
  {o.termino && <div>Término: {formatarDataHora(o.termino)}</div>}
  {!o.inicio && !o.chegada && !o.termino && '–'}
</td>

            <td className="p-2">{o.km != null ? `${o.km} km` : '–'}</td>
            <td className="p-2">R$ {o.despesas?.toFixed(2) ?? '0,00'}</td>
            <td className="p-2">{renderEtapas(o)}</td>
            {mostrarAcoes && (
              <td className="p-2">
                <Button onClick={() => finalizarOcorrencia(o.id)}>Encerrar</Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-end">
        <Dialog open={novoDialogAberto} onOpenChange={setNovoDialogAberto}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              + Nova Ocorrência
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AdicionarOcorrenciaPopup
              onSave={() => {
                axios.get('/api/ocorrencias')
                  .then(res => setOcorrencias(res.data))
                  .catch(err => console.error('Erro ao atualizar lista de ocorrências', err));
                setNovoDialogAberto(false);
              }}
              onClose={() => setNovoDialogAberto(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Ocorrências em Andamento</h2>
          {renderTabela(emAndamento, true)}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Ocorrências Finalizadas (últimas 24h)</h2>
          {renderTabela(finalizadas)}
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasPage;
