import api from '@/services/api';
import { pdf } from '@react-pdf/renderer';
import RelatorioPDF from './RelatorioPDF';

export const gerarRelatorioPDF = async (ocorrenciaId: string, setGerando: (v: boolean) => void) => {
  if (!ocorrenciaId) return alert('Informe o ID da ocorrência');

  try {
    setGerando(true);

    const resDados = await api.get("/api/ocorrencias/${ocorrenciaId}");
    const dados = await resDados.json();

    if (!resDados.ok) throw new Error('Erro ao buscar dados da ocorrência');

    const blob = await pdf(<RelatorioPDF dados={dados} />).toBlob();

    const formData = new FormData();
    formData.append('arquivo', blob, `relatorio-${ocorrenciaId}.pdf`);
    formData.append('ocorrenciaId', dados.id);
    formData.append('cliente', dados.cliente);
    formData.append('tipo', dados.tipo);
    formData.append('dataAcionamento', dados.data_acionamento);

    const upload = await api.post(`http://localhost:3001/api/relatorios/upload`);

    if (!upload.ok) throw new Error('Erro ao enviar relatório');

    alert('Relatório gerado e salvo com sucesso!');
  } catch (error) {
    console.error(error);
    alert('Falha ao gerar ou enviar relatório.');
  } finally {
    setGerando(false);
  }
};
