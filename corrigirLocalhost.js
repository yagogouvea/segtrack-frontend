import fs from 'fs';
import path from 'path';

const raiz = './src';
const EXTENSOES = ['.ts', '.tsx', '.js'];

const substituirLocalhost = (conteudo) => {
  return conteudo
    // Substitui fetch direto
    .replace(/fetch\(["'`]http:\/\/localhost:3001\/api\/([^"'`]+)["'`]/g,
             'api.get("/api/$1"')

    // Substitui axios direto (caso esteja hardcoded)
    .replace(/axios\.get\(["'`]http:\/\/localhost:3001\/api\/([^"'`]+)["'`]/g,
             'api.get("/api/$1"')
    .replace(/axios\.post\(["'`]http:\/\/localhost:3001\/api\/([^"'`]+)["'`]/g,
             'api.post("/api/$1"')
    .replace(/axios\.put\(["'`]http:\/\/localhost:3001\/api\/([^"'`]+)["'`]/g,
             'api.put("/api/$1"')

    // Substitui URLs absolutas para logo e imagens
    .replace(/["'`]http:\/\/localhost:3001\/uploads\/([^"'`]+)["'`]/g,
             '`${import.meta.env.VITE_API_BASE_URL}/uploads/$1`');
};

const percorrerArquivos = (diretorio) => {
  const arquivos = fs.readdirSync(diretorio);

  for (const arquivo of arquivos) {
    const caminho = path.join(diretorio, arquivo);
    const stat = fs.statSync(caminho);

    if (stat.isDirectory()) {
      percorrerArquivos(caminho);
    } else if (EXTENSOES.includes(path.extname(caminho))) {
      let conteudo = fs.readFileSync(caminho, 'utf-8');

      if (conteudo.includes('localhost:3001')) {
        const modificado = substituirLocalhost(conteudo);

        if (modificado !== conteudo) {
          console.log(`✅ Corrigido: ${caminho}`);
          fs.writeFileSync(caminho, modificado, 'utf-8');
        }
      }
    }
  }
};

console.log('🔍 Iniciando correção de chamadas http://localhost:3001...');
percorrerArquivos(raiz);
console.log('🚀 Finalizado!');
