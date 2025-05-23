// atualizarOcorrenciasDashboard.cjs - Script Node.js para corrigir OcorrenciasDashboard.tsx
const fs = require('fs');
const path = require('path');

const arquivo = path.resolve('C:/Users/yagog/segtrack-projeto-completo/frontend/src/pages/OcorrenciasDashboard.tsx');

fs.readFile(arquivo, 'utf-8', (err, conteudo) => {
  if (err) {
    console.error('❌ Erro ao ler o arquivo:', err);
    return;
  }
  console.log('📄 Arquivo lido com sucesso');

  let atualizado = conteudo;
  let alterado = false;

  // Corrigir import duplicado
  if (atualizado.includes("useEffect } from 'react';")) {
    atualizado = atualizado.replace("useEffect } from 'react';", '');
    alterado = true;
    console.log('🧹 Import duplicado de useEffect removido');
  }

  // Adiciona função atualizarOcorrencia se ausente
  if (!atualizado.includes('const atualizarOcorrencia =')) {
    const padrao = /const OcorrenciasPage: React.FC = \(\) => \{/;
    const func = `const OcorrenciasPage: React.FC = () => {\n\n  const atualizarOcorrencia = (atualizada: Ocorrencia) => {\n    setOcorrencias(prev =>\n      prev.map(o => (o.id === atualizada.id ? { ...o, ...atualizada } : o))\n    );\n  };\n`;
    atualizado = atualizado.replace(padrao, func);
    console.log('➕ Função atualizarOcorrencia adicionada');
    alterado = true;
  }

  // Corrige erro de sintaxe no emAndamento e finalizadas
  atualizado = atualizado.replace(
    /const emAndamento = \(Array\.isArray\(ocorrencias\) \? ocorrencias\.filter\(o => o\.status === 'Em andamento'\);/,
    `const emAndamento = Array.isArray(ocorrencias)
    ? ocorrencias.filter(o => o.status === 'Em andamento')
    : [];`
  );
  atualizado = atualizado.replace(
    /const finalizadas = \(Array\.isArray\(ocorrencias\) \? ocorrencias\.filter\(o =>[\s\S]+?\);/,
    `const finalizadas = Array.isArray(ocorrencias)
    ? ocorrencias.filter(o => o.status === 'encerrada' && o.encerradaEm &&
        (new Date().getTime() - new Date(o.encerradaEm).getTime()) / 3600000 <= 24)
    : [];`
  );
  alterado = true;
  console.log('🛠️ Corrigidas declarações de emAndamento e finalizadas');

  // Corrigir setOcorrencias passado diretamente para onUpdate
  const regexOnUpdate = /onUpdate=\{setOcorrencias\}/g;
  if (regexOnUpdate.test(atualizado)) {
    atualizado = atualizado.replace(regexOnUpdate,
      `onUpdate={(atualizada) =>
        setOcorrencias(prev =>
          prev.map(o => o.id === atualizada.id ? { ...o, ...atualizada } : o)
        )}`
    );
    console.log('🔁 Corrigido onUpdate={setOcorrencias}');
    alterado = true;
  }

  if (!alterado) {
    console.log('✅ Nenhuma modificação necessária.');
    return;
  }

  fs.writeFile(arquivo, atualizado, 'utf-8', (err) => {
    if (err) {
      console.error('❌ Erro ao salvar o arquivo:', err);
    } else {
      console.log('✅ Arquivo atualizado com sucesso!');
    }
  });
});
