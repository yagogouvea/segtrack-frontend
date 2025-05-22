import React, { useEffect, useState } from 'react';
import { Prestador } from '@/types/prestador';
import PrestadorPopup from '../components/PrestadorPopup';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';

const CadastroPrestadores: React.FC = () => {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [popupAberto, setPopupAberto] = useState(false);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<Prestador | null>(null);
  const [search, setSearch] = useState('');

  const carregarPrestadores = async () => {
    try {
      const resposta = await fetch('http://localhost:3001/api/prestadores');
      const dados = await resposta.json();
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
      await fetch(`http://localhost:3001/api/prestadores/${id}`, { method: 'DELETE' });
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
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Prestadores</h1>
        <div className="flex gap-2">
          <button
            onClick={exportarExcel}
            className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
          >
            Exportar Excel
          </button>
          <button
            onClick={() => alert('Funcionalidade futura de aprovações')}
            className="bg-yellow-200 px-4 py-2 rounded text-sm hover:bg-yellow-300"
          >
            Aprovações Pendentes
          </button>
          <button
            onClick={() => {
              setPrestadorSelecionado(null);
              setPopupAberto(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            + Cadastrar Prestador
          </button>
        </div>
      </div>

      <Input
        placeholder="Pesquisar por nome, CPF, codinome, função ou região"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="overflow-auto rounded-md border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">CPF</th>
              <th className="px-4 py-2">Codinome</th>
              <th className="px-4 py-2">Telefone</th>
              <th className="px-4 py-2">Funções</th>
              <th className="px-4 py-2">Regiões</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {prestadoresFiltrados.map(prestador => (
              <tr key={prestador.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium whitespace-nowrap">{prestador.nome}</td>
                <td className="px-4 py-2 whitespace-nowrap">{prestador.cpf}</td>
                <td className="px-4 py-2 whitespace-nowrap">{prestador.cod_nome}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <a
                    href={formatarTelefoneParaWhatsApp(prestador.telefone ?? '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {prestador.telefone}
                  </a>
                </td>
                <td className="px-4 py-2">{prestador.funcoes?.map((f: any) => typeof f === 'string' ? f : f.funcao).join(', ')}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc ml-4">
                    {prestador.regioes?.slice(0, 3).map((r: any) => (
                      <li key={typeof r === 'string' ? r : r.id}>{formatarRegiao(typeof r === 'string' ? r : r.regiao)}</li>
                    ))}
                    {prestador.regioes && prestador.regioes.length > 3 && (
                      <li>+{prestador.regioes.length - 3} mais</li>
                    )}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  {prestador.aprovado ? (
                    <span className="text-green-600 font-semibold">Aprovado</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pendente</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEditar(prestador)}
                    className="text-sm px-3 py-1 bg-yellow-400 rounded"
                  >Editar</button>
                  <button
                    onClick={() => handleExcluir(prestador.id!)}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded"
                  >Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
