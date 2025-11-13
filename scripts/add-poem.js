// Simplified helper to add or update poems.
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

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumerics
    .trim()
    .replace(/\s+/g, '-'); // replace spaces with dashes
}

async function prompt(question, rl) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer.trim()));
  });
}

async function promptMultiline(question, rl) {
  console.log(question);
  console.log('Paste your poem text. When finished, enter a single line containing only "."');

  const lines = [];
  return new Promise(resolve => {
    rl.removeAllListeners('line');
    rl.prompt();
    rl.on('line', line => {
      if (line === '.') {
        rl.removeAllListeners('line');
        resolve(lines.join('\n'));
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

    const title = await prompt('Title: ', rl);
    if (!title) throw new Error('Title is required.');

    const slug = slugify(title);
    const audioSlug = slug;
    const releaseDate = new Date().toISOString().split('T')[0];

    const tagsInput = await prompt('Tags (comma separated): ', rl);
    const tags = parseTags(tagsInput);

    const content = await promptMultiline('Enter poem content:', rl);
    if (!content.trim()) throw new Error('Poem content cannot be empty.');

    const existingIndex = data.poems.findIndex(poem => poem.slug === slug);
    const updatedPoem = {
      slug,
      title,
      releaseDate,
      audioSlug,
      tags,
      content
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

