// Helper utility that lets you add or update poems without manually escaping newlines.
// Usage: node scripts/add-poem.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const poemsJsonPath = path.join(__dirname, '..', 'data', 'poems.json');

function loadPoems() {
  if (!fs.existsSync(poemsJsonPath)) {
    return { poems: [] };
  }

  const content = fs.readFileSync(poemsJsonPath, 'utf8');
  try {
    const data = JSON.parse(content);
    if (!data || !Array.isArray(data.poems)) {
      throw new Error('Poems file is missing the "poems" array.');
    }
    return data;
  } catch (err) {
    throw new Error(`Unable to parse poems data: ${err.message}`);
  }
}

function savePoems(data) {
  fs.writeFileSync(poemsJsonPath, JSON.stringify({ poems: data.poems }, null, 2));
}

function parseTags(input) {
  if (!input.trim()) return [];
  return input
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

async function prompt(question, rl) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer.trim()));
  });
}

async function promptMultiline(question, rl) {
  console.log(question);
  console.log('Paste your poem text. When you are finished, enter a single line containing only "."');

  const lines = [];
  return new Promise(resolve => {
    rl.removeAllListeners('line');
    rl.prompt();
    rl.on('line', line => {
      if (line === '.') {
        rl.removeAllListeners('line');
        resolve({
          text: lines.join('\n'),
          wasEmpty: lines.length === 0
        });
        return;
      }
      lines.push(line);
      rl.prompt();
    });
  });
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.setPrompt('> ');
  try {
    const data = loadPoems();
    const slug = await prompt('Slug (e.g. a-new-poem): ', rl);
    if (!slug) {
      throw new Error('Slug is required.');
    }

    const existingIndex = data.poems.findIndex(poem => poem.slug === slug);
    let poem = existingIndex >= 0 ? data.poems[existingIndex] : {};

    const title = await prompt(`Title${poem.title ? ` [${poem.title}]` : ''}: `, rl) || poem.title;
    if (!title) {
      throw new Error('Title is required.');
    }

    const releaseDate = await prompt(`Release date (YYYY-MM-DD)${poem.releaseDate ? ` [${poem.releaseDate}]` : ''}: `, rl) || poem.releaseDate || '';
    const audioSlug = await prompt(`Audio slug${poem.audioSlug ? ` [${poem.audioSlug}]` : ''}: `, rl) || poem.audioSlug || slug;
    const tagsInput = await prompt(`Tags, comma separated${Array.isArray(poem.tags) && poem.tags.length ? ` [${poem.tags.join(', ')}]` : ''}: `, rl);
    const tags = tagsInput ? parseTags(tagsInput) : poem.tags || [];

    const instructions = poem.content ?
      'Enter new poem content, or just type "." on a blank line to keep the existing text.' :
      'Enter poem content:';

    const contentPrompt = instructions;
    const { text: newContent, wasEmpty } = await promptMultiline(contentPrompt, rl);
    const finalContent = wasEmpty && poem.content ? poem.content : newContent;

    const updatedPoem = {
      ...poem,
      slug,
      title,
      releaseDate: releaseDate || null,
      audioSlug,
      tags,
      content: finalContent
    };

    if (existingIndex >= 0) {
      data.poems.splice(existingIndex, 1, updatedPoem);
      console.log(`Updated existing poem with slug "${slug}".`);
    } else {
      data.poems.push(updatedPoem);
      console.log(`Added new poem with slug "${slug}".`);
    }

    savePoems(data);
    console.log(`Saved to ${path.relative(process.cwd(), poemsJsonPath)}.`);
    console.log(`View it at poetry/poem.html?slug=${slug}`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();
