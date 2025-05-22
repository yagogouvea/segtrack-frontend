import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Ocorrencia } from '@/types/ocorrencia';

interface Props {
  ocorrencia: Ocorrencia;
  onUpdate: (ocorrenciaAtualizada: Ocorrencia) => void;
  onClose: () => void;
}


const EditarDadosPopup: React.FC<Props> = ({ ocorrencia, onUpdate }) => {
  const [cliente, setCliente] = useState(ocorrencia.cliente || '');
  const [tipo, setTipo] = useState(ocorrencia.tipo || '');
  const [tipoVeiculo, setTipoVeiculo] = useState(ocorrencia.tipo_veiculo || '');
  const [placas, setPlacas] = useState([
    ocorrencia.placa1 || '',
    ocorrencia.placa2 || '',
    ocorrencia.placa3 || ''
  ]);
  const [modelo1, setModelo1] = useState(ocorrencia.modelo1 || '');
  const [cor1, setCor1] = useState(ocorrencia.cor1 || '');
  const [coordenadas, setCoordenadas] = useState(ocorrencia.coordenadas || '');
  const [endereco, setEndereco] = useState(ocorrencia.endereco || '');
  const [bairro, setBairro] = useState(ocorrencia.bairro || '');
  const [cidade, setCidade] = useState(ocorrencia.cidade || '');
  const [estado, setEstado] = useState(ocorrencia.estado || '');

  // Campos adicionais
  const [os, setOs] = useState('');
  const [origemBairro, setOrigemBairro] = useState('');
  const [origemCidade, setOrigemCidade] = useState('');
  const [origemEstado, setOrigemEstado] = useState('');
  const [cpfCondutor, setCpfCondutor] = useState('');
  const [nomeCondutor, setNomeCondutor] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [valorCarga, setValorCarga] = useState(0);
  const [notasFiscais, setNotasFiscais] = useState('');

  useEffect(() => {
  setOs(ocorrencia.os || '');
  setOrigemBairro(ocorrencia.origem_bairro || '');
  setOrigemCidade(ocorrencia.origem_cidade || '');
  setOrigemEstado(ocorrencia.origem_estado || '');
  setCpfCondutor(ocorrencia.cpf_condutor || '');
  setNomeCondutor(ocorrencia.nome_condutor || '');
  setTransportadora(ocorrencia.transportadora || '');
  setValorCarga(ocorrencia.valor_carga ?? 0); // ✅ Corrigido aqui
  setNotasFiscais(ocorrencia.notas_fiscais || '');
}, [ocorrencia]);


  const tiposOcorrencia = [
    'Acidente', 'Furto', 'Perda de Sinal', 'Preservação', 'Suspeita', 'Roubo', 'Apropriação',
    'Acompanhamento', 'Sindicância', 'Parada Indevida', 'Botão de Pânico', 'Verificação',
    'Problema Mecânico', 'Iscagem', 'Blitz', 'Pernoite Seguro', 'Constatação',
    'Violação Equipamento', 'Regulação'
  ];

  const salvar = async () => {
    if (!cliente || !tipo || !placas[0]) {
      alert('Preencha ao menos cliente, tipo e placa principal.');
      return;
    }

    try {
      const atualizada = {
        cliente,
        tipo,
        tipo_veiculo: tipoVeiculo,
        placa1: placas[0],
        placa2: placas[1],
        placa3: placas[2],
        modelo1,
        cor1,
        coordenadas,
        endereco,
        bairro,
        cidade,
        estado,
        os,
        origem_bairro: origemBairro,
        origem_cidade: origemCidade,
        origem_estado: origemEstado,
        cpf_condutor: cpfCondutor,
        nome_condutor: nomeCondutor,
        transportadora,
        valor_carga: valorCarga,
        notas_fiscais: notasFiscais
      };

      const { data } = await axios.put(`/api/ocorrencias/${ocorrencia.id}`, atualizada);
      onUpdate({ ...ocorrencia, ...data });
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      alert('Erro ao atualizar dados. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <DialogTitle className="text-lg font-bold">Editar Dados da Ocorrência</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Atualize os dados gerais lançados na abertura da ocorrência.
      </DialogDescription>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Cliente</Label>
          <Input value={cliente} onChange={e => setCliente(e.target.value)} />
        </div>

        <div>
          <Label>Tipo</Label>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {tiposOcorrencia.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tipo de Veículo</Label>
          <Select value={tipoVeiculo} onValueChange={setTipoVeiculo}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {['Carro', 'Moto', 'Caminhão', 'Isca'].map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {[0, 1, 2].map(i => (
          <div key={i} className="col-span-3 grid grid-cols-3 gap-4">
            <div>
              <Label>Placa {i + 1}</Label>
              <Input
                value={placas[i]}
                onChange={(e) => {
                  const novas = [...placas];
                  novas[i] = e.target.value;
                  setPlacas(novas);
                }}
              />
            </div>
            {i === 0 && (
              <>
                <div><Label>Modelo</Label><Input value={modelo1} onChange={(e) => setModelo1(e.target.value)} /></div>
                <div><Label>Cor</Label><Input value={cor1} onChange={(e) => setCor1(e.target.value)} /></div>
              </>
            )}
          </div>
        ))}

        <div className="col-span-3">
          <Label>Coordenadas</Label>
          <Input value={coordenadas} onChange={e => setCoordenadas(e.target.value)} />
        </div>

        <div><Label>Endereço</Label><Input value={endereco} onChange={e => setEndereco(e.target.value)} /></div>
        <div><Label>Bairro</Label><Input value={bairro} onChange={e => setBairro(e.target.value)} /></div>
        <div><Label>Cidade</Label><Input value={cidade} onChange={e => setCidade(e.target.value)} /></div>
        <div><Label>Estado</Label><Input value={estado} onChange={e => setEstado(e.target.value)} /></div>

        {/* Campos extras para ITURAN */}
        {cliente.toUpperCase().includes('ITURAN') && (
          <>
            <div><Label>OS</Label><Input value={os} onChange={e => setOs(e.target.value)} /></div>
            <div><Label>Bairro (Origem)</Label><Input value={origemBairro} onChange={e => setOrigemBairro(e.target.value)} /></div>
            <div><Label>Cidade (Origem)</Label><Input value={origemCidade} onChange={e => setOrigemCidade(e.target.value)} /></div>
            <div><Label>Estado (Origem)</Label><Input value={origemEstado} onChange={e => setOrigemEstado(e.target.value)} /></div>
          </>
        )}

        {/* Campos extras para MARFRIG */}
        {cliente.toUpperCase().includes('MARFRIG') && (
          <>
            <div><Label>CPF do Condutor</Label><Input value={cpfCondutor} onChange={e => setCpfCondutor(e.target.value)} /></div>
            <div><Label>Nome do Condutor</Label><Input value={nomeCondutor} onChange={e => setNomeCondutor(e.target.value)} /></div>
            <div><Label>Transportadora</Label><Input value={transportadora} onChange={e => setTransportadora(e.target.value)} /></div>
            <div><Label>Valor da Carga (R$)</Label><Input type="number" value={valorCarga} onChange={e => setValorCarga(parseFloat(e.target.value))} /></div>
            <div className="col-span-3"><Label>Notas Fiscais</Label><Input value={notasFiscais} onChange={e => setNotasFiscais(e.target.value)} /></div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={salvar} className="bg-blue-600 text-white hover:bg-blue-700">
            Salvar
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default EditarDadosPopup;
