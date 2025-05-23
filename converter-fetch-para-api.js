// converter-fetch-para-api.js
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('./src');
const exts = ['.ts', '.tsx'];

function readFilesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = [...files, ...readFilesRecursively(fullPath)];
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function transformContent(content) {
  const fetchRegex = /fetch\((['"])(http:\/\/localhost:3001|\/api)(.*?)\1(,\s*\{[^}]*\})?\)/g;
  let modified = content;
  let replaced = false;

  modified = modified.replace(fetchRegex, (match, quote, base, endpoint, options) => {
    let method = 'get';
    if (options && /method:\s*['"](POST|PUT|DELETE)['"]/i.test(options)) {
      method = options.match(/method:\s*['"](POST|PUT|DELETE)['"]/i)[1].toLowerCase();
    }
    replaced = true;
    return `api.${method}(\`${base}${endpoint}\`)`;
  });

  if (replaced && !/from ['"]@\/services\/api['"]/.test(modified)) {
    modified = `import api from '@/services/api';\n` + modified;
  }

  return replaced ? modified : null;
}

const files = readFilesRecursively(rootDir);
let totalModified = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const transformed = transformContent(content);
  if (transformed) {
    fs.writeFileSync(file, transformed, 'utf8');
    console.log(`✅ Atualizado: ${file}`);
    totalModified++;
  }
});

console.log(`\n🔧 Total de arquivos modificados: ${totalModified}`);
