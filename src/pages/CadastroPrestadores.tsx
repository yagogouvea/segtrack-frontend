import React, { useEffect, useState } from 'react';
import { Prestador } from '@/types/prestador';
import PrestadorPopup from '../components/PrestadorPopup';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';
import api from '@/services/api'; // ✅ usa a instância global

const CadastroPrestadores: React.FC = () => {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [popupAberto, setPopupAberto] = useState(false);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<Prestador | null>(null);
  const [search, setSearch] = useState('');

  const carregarPrestadores = async () => {
    try {
      const resposta = await api.get('/api/prestadores'); // ✅ corrigido
      const dados = resposta.data;
      if (!Array.isArray(dados)) {
        setPrestadores([]);
        return;
      }
      setPrestadores(dados);
    } catch (erro) {
      console.error('❌ Erro ao buscar prestadores:', erro);
    }
  };

  useEffect(() => {
    carregarPrestadores();
  }, []);

  const handleEditar = (prestador: Prestador) => {
    const funcoes = prestador.funcoes?.map((f: any) => typeof f === 'string' ? f : f.funcao);
    const regioes = prestador.regioes?.map((r: any) => typeof r === 'string' ? r : r.regiao);
    setPrestadorSelecionado({ ...prestador, funcoes, regioes });
    setPopupAberto(true);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este prestador?')) return;
    try {
      await api.delete(`/api/prestadores/${id}`); // ✅ corrigido
      carregarPrestadores();
    } catch (erro) {
      console.error('❌ Erro ao excluir prestador:', erro);
    }
  };

  const formatarRegiao = (regiao: string = '') => {
    const partes = regiao.split(',').map(p => p.trim());
    if (partes.length >= 2) {
      const cidade = partes[partes.length - 3] || '';
      const estado = partes[partes.length - 1]?.split(' ')[0] || '';
      const bairro = partes[0];
      return `${bairro}, ${cidade}/${estado}`;
    }
    return regiao;
  };

  const formatarTelefoneParaWhatsApp = (telefone: string = '') => {
    const digits = telefone.replace(/\D/g, '');
    return `https://wa.me/55${digits}`;
  };

  const exportarExcel = () => {
    const dados = prestadoresFiltrados.map(p => ({
      Nome: p.nome,
      CPF: p.cpf,
      Codinome: p.cod_nome,
      Telefone: p.telefone,
      Funcoes: p.funcoes?.map((f: any) => typeof f === 'string' ? f : f.funcao).join(', '),
      Regioes: p.regioes?.map((r: any) => formatarRegiao(typeof r === 'string' ? r : r.regiao)).join(', '),
      Status: p.aprovado ? 'Aprovado' : 'Pendente'
    }));
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Prestadores');
    XLSX.writeFile(wb, 'prestadores.xlsx');
  };

  const prestadoresFiltrados = prestadores.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.toLowerCase().includes(search.toLowerCase()) ||
    (p.cod_nome?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    (p.telefone?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    (p.funcoes?.some((f: any) => {
      const funcaoString = typeof f === 'string' ? f : f.funcao;
      return funcaoString.toLowerCase().includes(search.toLowerCase());
    }) ?? false) ||
    (p.regioes?.some((r: any) => {
      const regiaoString = typeof r === 'string' ? r : r.regiao;
      return regiaoString.toLowerCase().includes(search.toLowerCase());
    }) ?? false)
  );

  return (
    <div className="p-4 space-y-4">
      {/* ... resto permanece igual ... */}
      {popupAberto && (
        <PrestadorPopup
          onClose={() => setPopupAberto(false)}
          onSave={() => {
            carregarPrestadores();
            setPopupAberto(false);
          }}
          prestadorEdicao={prestadorSelecionado}
        />
      )}
    </div>
  );
};

export default CadastroPrestadores;
