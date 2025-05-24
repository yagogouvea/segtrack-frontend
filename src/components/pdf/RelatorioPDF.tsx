// Código ajustado com controle de quebra e layout aplicado corretamente
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
interface Foto {
  url: string;
  legenda?: string;
}
interface RelatorioDados {
  id?: string | number;
  cliente?: string;
  tipo?: string;
  data_acionamento?: string;
  placa1?: string;
  modelo1?: string;
  cor1?: string;
  placa2?: string;
  modelo2?: string;
  cor2?: string;
  placa3?: string;
  modelo3?: string;
  cor3?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  coordenadas?: string;
  inicio?: string;
  chegada?: string;
  termino?: string;
  km_inicial?: number;
  km_final?: number;
  km?: number;
  descricao?: string;
  fotos?: Foto[];
  os?: string;
  origem_bairro?: string;
  origem_cidade?: string;
  origem_estado?: string;
  condutor?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#555555',
    backgroundColor: '#FFFFFF',
    position: 'relative'
  },
  headerVisual: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 40,
    backgroundColor: '#0B2149'
  },
  headerBarSecondary: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#6c7a89'
  },
  footerVisual: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 30,
    backgroundColor: '#0B2149'
  },
  footerBarSecondary: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#6c7a89'
  },
  logo: {
    width: 200,
    marginBottom: 6,
    marginTop: 50,
    alignSelf: 'center'
  },
  tituloPrincipal: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 4,
    color: '#0B2149'
  },
  faixaAzul: {
    backgroundColor: '#0B2149',
    color: '#FFFFFF',
    padding: 4,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4
  },
  cardUnico: {
    border: '2pt solid #0B2149',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#f9fafc'
  },
  linhaCampo: {
    fontSize: 9,
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rotuloBotao: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 9,
    color: '#0B2149'
  },
  linhaSeparadora: {
    borderBottomWidth: 1,
    borderBottomColor: '#0B2149',
    marginVertical: 6,
    width: '100%'
  },
  secaoTitulo: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
    color: '#0B2149',
    textAlign: 'center'
  },
  descricaoBox: {
    border: '2pt solid #0B2149',
    borderRadius: 10,
    padding: 12,
    marginTop: 50,
    backgroundColor: '#f9fafc',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center'
  },
  descricaoTexto: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#333',
    textAlign: 'left'
  },
  galeriaLinha: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 40,
    breakInside: 'avoid'
  },
  cardImagem: {
    width: '45%',
    padding: 14,
    marginBottom: 10,
    border: '2pt solid #0B2149',
    borderRadius: 10,
    backgroundColor: '#f9fafc',
    alignItems: 'center',
    breakInside: 'avoid'
  },
  imagem: {
    width: '100%',
    height: 140,
    borderRadius: 5,
    objectFit: 'cover'
  },
  legenda: {
    fontSize: 8,
    color: '#333',
    backgroundColor: '#eaeaea',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    textAlign: 'center',
    marginTop: 6,
    border: '1pt solid #ccc',
    width: '100%'
  }
});

const limparHtml = (texto: string) => texto.replace(/<[^>]+>/g, '').trim();

const RelatorioPDF = ({ dados }: { dados: RelatorioDados }) => {
  const {
    id, cliente, tipo, data_acionamento, placa1, modelo1, cor1, placa2, modelo2, cor2,
    placa3, modelo3, cor3, endereco, cidade, estado, coordenadas, inicio, chegada,
    termino, km_inicial, km_final, km, descricao, fotos = [], os,
    origem_bairro, origem_cidade, origem_estado, condutor
  } = dados;

  const tempoTotal = inicio && termino ? new Date(termino).getTime() - new Date(inicio).getTime() : null;
  const tempoHoras = tempoTotal ? String(Math.floor(tempoTotal / 3600000)).padStart(2, '0') : '00';
  const tempoMinutos = tempoTotal ? String(Math.floor((tempoTotal % 3600000) / 60000)).padStart(2, '0') : '00';

  return (
    <Document>
       <Page size="A4" style={styles.page} wrap>
      <View style={styles.headerVisual} />
      <View style={styles.headerBarSecondary} />
      <Image style={styles.logo} src={`${import.meta.env.VITE_API_BASE_URL}/uploads/logo-segtrack.png`} />
      <Text style={styles.tituloPrincipal}>RELATÓRIO DE PRESTAÇÃO DE SERVIÇOS</Text>
      <Text style={styles.faixaAzul}>RELATÓRIO DE ACIONAMENTO</Text>
      <Text style={styles.secaoTitulo}>DADOS DA OCORRÊNCIA</Text>

        <View style={styles.cardUnico}>
          {id && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Ocorrência Nº:</Text> {id}</Text>}
          <View style={styles.linhaSeparadora} />
          {cliente && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Cliente:</Text> {cliente}</Text>}
          {cliente === 'BRK' && condutor && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Dados do Condutor:</Text> {condutor}</Text>}
          {tipo && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Tipo de Ocorrência:</Text> {tipo}</Text>}
         {data_acionamento && (
  <Text style={styles.linhaCampo}>
    <Text style={styles.rotuloBotao}>Data de Acionamento:</Text> {new Date(data_acionamento).toLocaleDateString()}
  </Text>
)}

          <View style={styles.linhaSeparadora} />
          {os && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Número OS:</Text> {os}</Text>}
          {(origem_bairro || origem_cidade || origem_estado) && (
            <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Local de Origem:</Text> {origem_bairro} - {origem_cidade} - {origem_estado}</Text>
          )}
          {(cliente === 'Aitura' || cliente === 'Marfrig') && <View style={styles.linhaSeparadora} />}
          {placa1 && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Dados do Veículo 1:</Text> {placa1} {modelo1} {cor1}</Text>}
          {placa2 && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Dados do Veículo 2:</Text> {placa2} {modelo2} {cor2}</Text>}
          {placa3 && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Dados do Veículo 3:</Text> {placa3} {modelo3} {cor3}</Text>}
          {endereco && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Local por Extenso:</Text> {endereco}, {cidade} - {estado}</Text>}
          {coordenadas && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Coordenadas:</Text> {coordenadas}</Text>}
          {coordenadas && <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Ver no Google Maps:</Text> <Link src={`https://maps.google.com/?q=${coordenadas}`}>{`https://maps.google.com/?q=${coordenadas}`}</Link></Text>}
          <View style={styles.linhaSeparadora} />
          <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Horário Inicial:</Text> {inicio ? new Date(inicio).toLocaleString() : '-'}</Text>
          <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Horário Chegada:</Text> {chegada ? new Date(chegada).toLocaleString() : '-'}</Text>
          <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Horário Final:</Text> {termino ? new Date(termino).toLocaleString() : '-'}</Text>
         <Text style={styles.linhaCampo}>
  <Text style={styles.rotuloBotao}>Tempo Total:</Text> {tempoHoras}h{tempoMinutos}min
</Text>

          <Text style={styles.linhaCampo}><Text style={styles.rotuloBotao}>Odômetro:</Text> Início: {km_inicial ?? '-'} | Final: {km_final ?? '-'} | Total: {km ?? (km_final !== undefined && km_inicial !== undefined ? km_final - km_inicial : '-')} km
</Text>
        </View>
        <View style={styles.footerVisual} />
        <View style={styles.footerBarSecondary} />
      </Page>

      {(descricao || fotos.length > 0) && (
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.headerVisual} />
          <View style={styles.headerBarSecondary} />

          {descricao && (
            <View style={styles.descricaoBox}>
              <Text style={styles.secaoTitulo}>DESCRIÇÃO DA OCORRÊNCIA:</Text>
              <Text style={styles.descricaoTexto}>{descricao}</Text>
            </View>
          )}

          {fotos.length > 0 && (
            <>
              <Text style={styles.secaoTitulo}>LAUDO FOTOGRÁFICO</Text>
              {[...Array(Math.ceil(fotos.length / 2))].map((_, rowIndex) => (
                <View key={rowIndex} style={styles.galeriaLinha} wrap={false}>
                  {fotos.slice(rowIndex * 2, rowIndex * 2 + 2).map((f, i) => (
                    <View key={i} style={styles.cardImagem} wrap={false}>
                      <Image src={f.url.startsWith('http') ? f.url : `http://localhost:3001${f.url}`} style={styles.imagem} />
                      {f.legenda && <Text style={styles.legenda}>{limparHtml(f.legenda)}</Text>}
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}

          <View style={styles.footerVisual} />
          <View style={styles.footerBarSecondary} />
        </Page>
      )}
    </Document>
  );
};

export default RelatorioPDF;
