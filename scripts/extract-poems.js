// Utility script that converts existing generated poem pages into data/poems.json.
// It preserves release dates and tags when run multiple times.
const fs = require('fs');
const path = require('path');

const poemsDir = path.join(__dirname, '..', 'poetry');
const outputPath = path.join(__dirname, '..', 'data', 'poems.json');

const templateFilesToSkip = new Set([
  'poetry-landing.html',
  'template.txt'
]);

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const existingPath = fs.existsSync(outputPath) ? outputPath : null;
const existingData = existingPath ? JSON.parse(fs.readFileSync(existingPath, 'utf8')) : { poems: [] };
const existingBySlug = new Map((existingData.poems || []).map(poem => [poem.slug, poem]));

const files = fs.readdirSync(poemsDir).filter(file => file.endsWith('.html') && !templateFilesToSkip.has(file));

const poems = files.map(file => {
  const fullPath = path.join(poemsDir, file);
  const html = fs.readFileSync(fullPath, 'utf8');

  const titleMatch = html.match(/<h1 class="poem-title">([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(file, '.html');

  const audioMatch = html.match(/playPoemAudio\('([^']+)'\)/);
  const audioSlug = audioMatch ? audioMatch[1] : path.basename(file, '.html');

  const preMatch = html.match(/<pre>\s*([\s\S]*?)\s*<\/pre>/);
  const rawContent = preMatch ? preMatch[1] : '';
  const content = decodeHtmlEntities(rawContent.replace(/\r\n/g, '\n'));

  const slug = path.basename(file, '.html');
  const existing = existingBySlug.get(slug);

  return {
    title,
    slug,
    audioSlug,
    releaseDate: existing ? existing.releaseDate : null,
    tags: existing ? existing.tags : [],
    content
  };
});

if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify({ poems }, null, 2));
console.log(`Extracted ${poems.length} poems to ${path.relative(process.cwd(), outputPath)}`);
