import React, { useEffect, useState } from 'react';
import api from '@/services/api';
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
import axios from 'axios';


const tiposOcorrencia = [
  'Acidente', 'Furto', 'Perda de Sinal', 'Preservação', 'Suspeita', 'Roubo', 'Apropriação',
  'Acompanhamento', 'Sindicância', 'Parada Indevida', 'Botão de Pânico', 'Verificação',
  'Problema Mecânico', 'Iscagem', 'Blitz', 'Pernoite Seguro', 'Constatação',
  'Violação Equipamento', 'Regulação'
];

type ClienteResumo = { id: string; nome: string };

function useDebounce<T>(value: T, delay = 700): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PopupNovaOcorrencia = ({
  onClose,
  onSave
}: {
  onClose: () => void;
  onSave: (data: {
    placa1: string;
    cliente: string;
    tipo: string;
  }) => void;
}) => {
  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [placas, setPlacas] = useState(['', '', '']);
  const [modelos, setModelos] = useState(['', '', '']);
  const [cores, setCores] = useState(['', '', '']);
  const [coordenadas, setCoordenadas] = useState('');
  const [enderecoInfo, setEnderecoInfo] = useState({ endereco: '', bairro: '', cidade: '', estado: '' });

  const [os, setOs] = useState('');
  const [origemBairro, setOrigemBairro] = useState('');
  const [origemCidade, setOrigemCidade] = useState('');
  const [origemEstado, setOrigemEstado] = useState('');
  const [cpfCondutor, setCpfCondutor] = useState('');
  const [nomeCondutor, setNomeCondutor] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [valorCarga, setValorCarga] = useState('');
  const [notasFiscais, setNotasFiscais] = useState('');

  const debouncedPlacas = [
    useDebounce(placas[0], 700),
    useDebounce(placas[1], 700),
    useDebounce(placas[2], 700)
  ];

  const debouncedCoordenadas = useDebounce(coordenadas, 1000);

  useEffect(() => {
  api.get('/api/clientes/resumo')

    .then(res => setClientes(res.data))
    .catch(err => console.error('Erro ao buscar clientes:', err));
}, []);
useEffect(() => {
  debouncedPlacas.forEach((placa, i) => {
    const placaFormatada = placa.toUpperCase();
    const placaValida = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    if (placaValida.test(placaFormatada)) {
      api.get(`/api/veiculos/${placaFormatada}`)
        .then(res => {
          const novaModelos = [...modelos];
          const novaCores = [...cores];
          novaModelos[i] = res.data.modelo;
          novaCores[i] = res.data.cor;
          setModelos(novaModelos);
          setCores(novaCores);
        })
        .catch(err => console.error('Erro ao buscar dados da placa', err));
    }
  });
}, [debouncedPlacas[0], debouncedPlacas[1], debouncedPlacas[2]]);

  useEffect(() => {
    const coords = debouncedCoordenadas.split(',').map(p => p.trim());
    if (coords.length === 2) {
      const [lat, lng] = coords;
      axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => {
          const address = res.data.address || {};
          setEnderecoInfo({
            endereco: `${address.road || ''}${address.house_number ? ', ' + address.house_number : ''}`,
            bairro: address.suburb || address.neighbourhood || '',
            cidade: address.city || address.town || address.village || '',
            estado: address.state || ''
          });
        })
        .catch(err => console.error('Erro ao buscar endereço via coordenadas', err));
    }
  }, [debouncedCoordenadas]);

  const handlePlacaChange = (value: string, index: number) => {
    const novasPlacas = [...placas];
    novasPlacas[index] = value;
    setPlacas(novasPlacas);
  };

  const handleSave = async () => {
    if (!clienteSelecionado || !tipoOcorrencia || !placas[0]) {
      alert('Preencha cliente, tipo e a placa principal');
      return;
    }

    const novaOcorrencia: any = {
      placa1: placas[0],
      placa2: placas[1] || undefined,
      placa3: placas[2] || undefined,
      modelo1: modelos[0] || undefined,
      cor1: cores[0] || undefined,
      cliente: clienteSelecionado,
      tipo: tipoOcorrencia,
      tipo_veiculo: tipoVeiculo || undefined,
      coordenadas,
      endereco: enderecoInfo.endereco,
      bairro: enderecoInfo.bairro,
      cidade: enderecoInfo.cidade,
      estado: enderecoInfo.estado,
      data_acionamento: new Date().toISOString()
    };

    if (clienteSelecionado.includes('ITURAN')) {
      novaOcorrencia.os = os;
      novaOcorrencia.origem_bairro = origemBairro;
      novaOcorrencia.origem_cidade = origemCidade;
      novaOcorrencia.origem_estado = origemEstado;
    }

    if (clienteSelecionado.includes('MARFRIG')) {
      novaOcorrencia.cpf_condutor = cpfCondutor;
      novaOcorrencia.nome_condutor = nomeCondutor;
      novaOcorrencia.transportadora = transportadora;
      novaOcorrencia.valor_carga = parseFloat(valorCarga) || 0;
      novaOcorrencia.notas_fiscais = notasFiscais;
    }

    try {
 await api.post('/api/ocorrencias', novaOcorrencia);



  console.log('Ocorrência salva com sucesso');
} catch (err) {
  console.error('Erro ao salvar ocorrência:', err);
  alert('Erro ao salvar ocorrência. Tente novamente.');
  return;
}

onSave({
  placa1: placas[0],
  cliente: clienteSelecionado,
  tipo: tipoOcorrencia
});

    onClose();
  };

  const renderCamposEspecificos = () => {
    if (clienteSelecionado.includes('ITURAN')) {
      return (
        <div className="grid grid-cols-3 gap-2">
          <div><Label>OS</Label><Input value={os} onChange={e => setOs(e.target.value)} /></div>
          <div><Label>Bairro (Origem do Prestador)</Label><Input value={origemBairro} onChange={e => setOrigemBairro(e.target.value)} /></div>
          <div><Label>Cidade (Origem do Prestador)</Label><Input value={origemCidade} onChange={e => setOrigemCidade(e.target.value)} /></div>
          <div><Label>Estado (Origem do Prestador)</Label><Input value={origemEstado} onChange={e => setOrigemEstado(e.target.value)} /></div>
        </div>
      );
    }
    if (clienteSelecionado.includes('MARFRIG')) {
      return (
        <div className="grid grid-cols-2 gap-2">
          <div><Label>CPF do Condutor</Label><Input value={cpfCondutor} onChange={e => setCpfCondutor(e.target.value)} /></div>
          <div><Label>Nome do Condutor</Label><Input value={nomeCondutor} onChange={e => setNomeCondutor(e.target.value)} /></div>
          <div><Label>Transportadora</Label><Input value={transportadora} onChange={e => setTransportadora(e.target.value)} /></div>
          <div><Label>Valor da Carga (R$)</Label><Input type="number" value={valorCarga} onChange={e => setValorCarga(e.target.value)} /></div>
          <div className="col-span-2"><Label>Notas Fiscais</Label><Input value={notasFiscais} onChange={e => setNotasFiscais(e.target.value)} placeholder="Separe por vírgulas" /></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <DialogTitle className="text-lg font-bold">Adicionar Nova Ocorrência</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Preencha os dados da ocorrência conforme o perfil do cliente.
      </DialogDescription>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Cliente</Label>
          <Select onValueChange={setClienteSelecionado}>
            <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
            <SelectContent>
              {clientes.map((c: ClienteResumo) => (
                <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tipo de Ocorrência</Label>
          <Select onValueChange={setTipoOcorrencia}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {tiposOcorrencia.map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Data do Acionamento</Label>
          <Input type="date" />
        </div>

        <div>
          <Label>Tipo de Veículo</Label>
          <Select onValueChange={setTipoVeiculo}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {['Carro', 'Moto', 'Caminhão', 'Isca'].map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {tipoVeiculo === 'Isca' ? (
          <div className="col-span-2">
            <Label>Isca (ID)</Label>
            <Input placeholder="ID da Isca" />
          </div>
        ) : (
          [0, 1, 2].map(i => (
            <div key={i} className="grid grid-cols-3 gap-4 col-span-3">
              <div>
                <Label>Placa {i + 1}</Label>
                <Input onChange={(e) => handlePlacaChange(e.target.value, i)} className="w-full" />
              </div>
              <div><Label>Modelo</Label><Input value={modelos[i]} readOnly className="w-full" /></div>
              <div><Label>Cor</Label><Input value={cores[i]} readOnly className="w-full" /></div>
            </div>
          ))
        )}

        <div className="col-span-3">
          <Label>Coordenadas</Label>
          <Input
            placeholder="Ex: -23.465875, -46.758688"
            value={coordenadas}
            onChange={(e) => setCoordenadas(e.target.value)}
          />
        </div>

        <div><Label>Endereço</Label><Input value={enderecoInfo.endereco} readOnly /></div>
        <div><Label>Bairro</Label><Input value={enderecoInfo.bairro} readOnly /></div>
        <div><Label>Cidade</Label><Input value={enderecoInfo.cidade} readOnly /></div>
        <div><Label>Estado</Label><Input value={enderecoInfo.estado} readOnly /></div>
      </div>

      {renderCamposEspecificos()}

      <div className="flex justify-end gap-2 mt-4">
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">Salvar</Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default PopupNovaOcorrencia;