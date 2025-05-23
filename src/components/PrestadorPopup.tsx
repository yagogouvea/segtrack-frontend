import React, { useEffect, useState } from 'react';
import { Prestador } from '@/types/prestador';
import { X, Check } from 'lucide-react';
import api from '@/services/api'; // ⬅️ Adicione no topo

interface Props {
  onClose: () => void;
  onSave: () => void;
  prestadorEdicao: Prestador | null;
}

const tiposPix = ['CPF', 'CNPJ', 'E-mail', 'Telefone'];
const funcoesDisponiveis = ['Pronta Resposta', 'Apoio Armado', 'Antenista', 'Policial', 'Drone'];

const formatCPF = (value: string) => value
  .replace(/\D/g, '')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const formatPhone = (value: string) => value
  .replace(/\D/g, '')
  .replace(/(\d{2})(\d)/, '($1) $2')
  .replace(/(\d{5})(\d{4})$/, '$1-$2');

const formatMoney = (value: string) => {
  const clean = value.replace(/\D/g, '');
  const num = (parseInt(clean, 10) / 100).toFixed(2);
  return 'R$ ' + num.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatTime = (value: string) => {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length <= 2) return clean;
  return clean.slice(0, 2) + ':' + clean.slice(2);
};

const buscarSugestoesRegiao = async (query: string): Promise<string[]> => {
  if (query.length < 3) return [];
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
    const data = await response.json();
    return data.map((item: any) => item.display_name);
  } catch (error) {
    console.error('Erro ao buscar sugestão de região:', error);
    return [];
  }
};

const PrestadorPopup: React.FC<Props> = ({ onClose, onSave, prestadorEdicao }) => {
  const [form, setForm] = useState<Prestador>({
    nome: '', cpf: '', cod_nome: '', telefone: '', email: '',
    aprovado: false, funcoes: [], regioes: [],
    valor_acionamento: '', franquia_horas: '', franquia_km: '', valor_hora_adc: '', valor_km_adc: '',
    tipo_pix: '', chave_pix: '', cep: '', endereco: '', bairro: '', cidade: '', estado: ''
  });
  const [novaRegiao, setNovaRegiao] = useState('');
  const [sugestoesRegiao, setSugestoesRegiao] = useState<string[]>([]);

  useEffect(() => {
    if (prestadorEdicao) setForm(prestadorEdicao);
  }, [prestadorEdicao]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const resultados = await buscarSugestoesRegiao(novaRegiao);
      setSugestoesRegiao(resultados);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [novaRegiao]);

  const buscarEndereco = async (cep: string) => {
    if (cep.length < 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setForm({
        ...form,
        endereco: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      });
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const adicionarRegiao = (regiao: string) => {
    if (regiao.trim() && !form.regioes?.includes(regiao)) {
      setForm({ ...form, regioes: [...(form.regioes || []), regiao] });
      setNovaRegiao('');
      setSugestoesRegiao([]);
    }
  };

  const removerRegiao = (regiao: string) => {
    setForm({ ...form, regioes: form.regioes?.filter(r => r !== regiao) });
  };

 const salvar = async () => {
  try {
    if (prestadorEdicao) {
      await api.put(`/api/prestadores/${prestadorEdicao.id}`, form);
    } else {
      await api.post('/api/prestadores', form);
    }
    onSave();
  } catch (err) {
    console.error('❌ Erro ao salvar prestador:', err);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold mb-4">{prestadorEdicao ? 'Editar Prestador' : 'Novo Prestador'}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-lg font-semibold text-gray-700">Dados Pessoais</div>
          <input placeholder="Nome" className="border p-2 rounded" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          <input placeholder="CPF" className="border p-2 rounded" value={form.cpf} onChange={e => setForm({ ...form, cpf: formatCPF(e.target.value) })} />
          <input placeholder="Codinome" className="border p-2 rounded" value={form.cod_nome} onChange={e => setForm({ ...form, cod_nome: e.target.value })} />
          <input placeholder="Telefone" className="border p-2 rounded" value={form.telefone} onChange={e => setForm({ ...form, telefone: formatPhone(e.target.value) })} />
          <input placeholder="Email" className="border p-2 rounded" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="CEP" className="border p-2 rounded" value={form.cep} onChange={e => {
            const value = e.target.value.replace(/\D/g, '');
            setForm({ ...form, cep: value });
            buscarEndereco(value);
          }} />
          <input placeholder="Endereço" className="border p-2 rounded" value={form.endereco} disabled />
          <input placeholder="Bairro" className="border p-2 rounded" value={form.bairro} disabled />
          <input placeholder="Cidade" className="border p-2 rounded" value={form.cidade} disabled />
          <input placeholder="Estado" className="border p-2 rounded" value={form.estado} disabled />

          <div className="col-span-2 text-lg font-semibold text-gray-700 pt-2">Informações de Pix</div>
          <select value={form.tipo_pix} className="border p-2 rounded" onChange={e => setForm({ ...form, tipo_pix: e.target.value })}>
            <option value="">Tipo de Chave Pix</option>
            {tiposPix.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input placeholder="Chave Pix" className="border p-2 rounded" value={form.chave_pix} onChange={e => setForm({ ...form, chave_pix: e.target.value })} />

          <div className="col-span-2 text-lg font-semibold text-gray-700 pt-2">Valores e Franquias</div>
          <input placeholder="Valor Acionamento" className="border p-2 rounded" value={form.valor_acionamento} onChange={e => setForm({ ...form, valor_acionamento: formatMoney(e.target.value) })} />
          <input placeholder="Franquia de Horas" className="border p-2 rounded" value={form.franquia_horas} onChange={e => setForm({ ...form, franquia_horas: formatTime(e.target.value) })} />
          <input placeholder="Franquia de KM" className="border p-2 rounded" value={form.franquia_km} onChange={e => setForm({ ...form, franquia_km: e.target.value })} />
          <input placeholder="Valor Hora Adicional" className="border p-2 rounded" value={form.valor_hora_adc} onChange={e => setForm({ ...form, valor_hora_adc: formatMoney(e.target.value) })} />
          <input placeholder="Valor KM Adicional" className="border p-2 rounded" value={form.valor_km_adc} onChange={e => setForm({ ...form, valor_km_adc: formatMoney(e.target.value) })} />

          <div className="col-span-2">
            <label className="block font-medium mb-1">Funções</label>
            <div className="flex gap-4 flex-wrap">
              {funcoesDisponiveis.map(f => (
                <label key={f} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.funcoes?.includes(f)}
                    onChange={() => {
                      const atual = form.funcoes || [];
                      setForm({
                        ...form,
                        funcoes: atual.includes(f)
                          ? atual.filter(x => x !== f)
                          : [...atual, f]
                      });
                    }}
                  /> {f}
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Regiões de Atendimento</label>
            <div className="relative mb-2">
              <input
                value={novaRegiao}
                onChange={e => setNovaRegiao(e.target.value)}
                placeholder="Digite e selecione uma localização..."
                className="w-full text-base py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {sugestoesRegiao.length > 0 && (
                <ul className="absolute bg-white border mt-1 w-full max-h-60 overflow-auto z-10 shadow-lg rounded-md">
                  {sugestoesRegiao.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => adicionarRegiao(s)}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {form.regioes?.map(r => (
                <span key={r} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                  {r}
                  <button onClick={() => removerRegiao(r)} className="text-red-500 font-bold">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
            <X size={16} /> Cancelar
          </button>
          <button onClick={salvar} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Check size={16} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrestadorPopup;
