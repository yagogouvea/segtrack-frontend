import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const arquivos = [
  'src/components/ClientePopup.tsx',
  'src/pages/LoginPage.tsx',
  'src/pages/relatorios/index.tsx',
];

for (const relPath of arquivos) {
  const fullPath = path.join(__dirname, relPath);
  console.log('🔍 Verificando:', fullPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`❌ Arquivo não encontrado: ${relPath}`);
    continue;
  }

  let conteudo = fs.readFileSync(fullPath, 'utf-8');
  let alterado = false;

  if (
    relPath.includes('ClientePopup.tsx') &&
    !conteudo.includes("import api from '@/services/api'")
  ) {
    conteudo = `import api from '@/services/api';\n` + conteudo;
    alterado = true;
  }

  if (conteudo.includes('$(')) {
    conteudo = conteudo.replace(/\$\([^)]*\)/g, '');
    alterado = true;
  }

  conteudo = conteudo.replace(/src=\{(true|false)\}/g, 'src=""');
  conteudo = conteudo.replace(/<>[\s]*<\/>/g, '');
  conteudo = conteudo.replace(/\btrue\b\s*<\/[a-zA-Z]+>/g, '</div>');
  conteudo = conteudo.replace(/\{[^{}]*:.*\}\(\)/g, '');

  if (alterado) {
    fs.writeFileSync(fullPath, conteudo, 'utf-8');
    console.log(`✅ Corrigido: ${relPath}`);
  } else {
    console.log(`ℹ️ Sem mudanças em: ${relPath}`);
  }
}

console.log('🚀 Script de correção ESM concluído.');
