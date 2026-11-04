import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const origin = 'https://asankov.dev';
const articleDirectory = join(root, 'public/articles');
const posts = readdirSync(articleDirectory).filter((file) => file.endsWith('.md')).map((file) => {
  const source = readFileSync(join(articleDirectory, file), 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  assert.ok(match, `${file} must have YAML frontmatter`);
  return { slug: file.slice(0, -3), data: load(match[1]), body: match[2] };
}).sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, name) => {
    if (name.startsWith('#')) {
      const number = name[1].toLowerCase() === 'x'
        ? Number.parseInt(name.slice(2), 16) : Number.parseInt(name.slice(1), 10);
      return Number.isFinite(number) && number <= 0x10ffff ? String.fromCodePoint(number) : entity;
    }
    return named[name.toLowerCase()];
  });
}

function normalize(value) {
  return decodeEntities(value).replace(/\s+/g, ' ').trim();
}

function proseText(value) {
  // Typographic punctuation produced by Markdown preserves the source wording.
  return value.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replaceAll('…', '...');
}

function textContent(html) {
  return normalize(html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, ''));
}

function markdownText(markdown) {
  return normalize(markdown.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<((?:https?:\/\/|mailto:)[^>]+)>/g, '$1')
    .replace(/<[^>]*>/g, '').replace(/`+/g, '')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(?<!\w)([*_])(.+?)\1(?!\w)/g, '$2'));
}

function tags(html) {
  // Ignore JavaScript/CSS bodies, where strings can resemble HTML tags.
  const markup = html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(script|style)\b[^>]*>)[\s\S]*?<\/\2>/gi, '$1');
  return [...markup.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map((match) => {
    const attributes = {};
    for (const attribute of match[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attributes[attribute[1].toLowerCase()] = decodeEntities(attribute[2] ?? attribute[3] ?? attribute[4] ?? '');
    }
    return { name: match[1].toLowerCase(), attributes };
  });
}

function pageFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const file = resolve(dist, `.${decoded}`);
  assert.ok(file === dist || file.startsWith(`${dist}${sep}`), `Path escapes build output: ${pathname}`);
  if (existsSync(file) && statSync(file).isFile()) return file;
  return join(file, 'index.html');
}

function readPage(pathname) {
  const file = pageFile(pathname);
  assert.ok(existsSync(file), `Missing generated page ${pathname}; run npm run build first`);
  return readFileSync(file, 'utf8');
}

function mainContent(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  assert.ok(match, 'The generated page must contain a main landmark');
  return match[1];
}

function meta(html, name) {
  return tags(html).find((tag) => tag.name === 'meta'
    && (tag.attributes.name === name || tag.attributes.property === name))?.attributes.content;
}

function canonical(html) {
  return tags(html).find((tag) => tag.name === 'link'
    && tag.attributes.rel?.split(/\s+/).includes('canonical'))?.attributes.href;
}

function title(html) {
  return textContent(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
}

function htmlFiles(directory) {
  assert.ok(existsSync(directory), 'Build output is missing; run npm run build first');
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

test('the home page contains every article, newest first, before JavaScript runs', () => {
  const html = readPage('/');
  const content = textContent(mainContent(html));
  const articleLinks = tags(mainContent(html)).filter((tag) => tag.name === 'a'
    && /^\/post\/[^/]+\/$/.test(tag.attributes.href ?? '')).map((tag) => tag.attributes.href);
  assert.deepEqual(articleLinks, posts.map((post) => `/post/${post.slug}/`));
  for (const post of posts) {
    assert.ok(content.includes(normalize(post.data.title)), `Missing article title: ${post.slug}`);
    assert.ok(content.includes(normalize(post.data.description)), `Missing article excerpt: ${post.slug}`);
  }
});

test('every article ships its title, prose, headings, and complete code examples as HTML', () => {
  for (const post of posts) {
    const html = readPage(`/post/${post.slug}/`);
    const main = mainContent(html);
    const content = proseText(textContent(main));
    assert.ok(content.includes(normalize(post.data.title)), `Missing title: ${post.slug}`);
    const introduction = post.body.trim().split(/\r?\n\s*\r?\n/)[0];
    assert.ok(content.includes(proseText(markdownText(introduction))),
      `Missing article body: ${post.slug}`);

    const withoutCode = post.body.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
    for (const heading of withoutCode.matchAll(/^#{1,6}\s+(.+)$/gm)) {
      assert.ok(content.includes(proseText(markdownText(heading[1]))), `Missing heading in ${post.slug}: ${heading[1]}`);
    }
    const builtCode = [...main.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)].map((match) => textContent(match[1]));
    for (const code of post.body.matchAll(/^```[^\n]*\n([\s\S]*?)^```\s*$/gm)) {
      assert.ok(builtCode.includes(normalize(code[1])), `Missing or altered code example in ${post.slug}`);
    }
    assert.doesNotMatch(html, /<astro-island\b|data-reactroot|<div\b[^>]*\bid=["']root["']/i,
      `${post.slug} must not depend on a hydrated app shell`);
  }
});

test('the CV is rendered from its YAML content, including nested experience and all talks', () => {
  const cv = load(readFileSync(join(root, 'public/cv-data.yaml'), 'utf8'));
  const html = readPage('/cv/');
  const content = textContent(mainContent(html));
  for (const value of [cv.personal.name, cv.personal.description, cv.contact.email, cv.summary]) {
    assert.ok(content.includes(normalize(value)), `Missing CV content: ${value}`);
  }
  for (const job of [...cv.experience, ...cv.openSourceContributions]) {
    for (const value of [job.company, job.location, ...(job.responsibilities ?? []), ...(job.skills ?? [])]) {
      assert.ok(content.includes(normalize(value)), `Missing experience content: ${value}`);
    }
    for (const position of job.positions) {
      for (const value of [position.title, position.period, ...(position.responsibilities ?? []), ...(position.skills ?? [])]) {
        assert.ok(content.includes(normalize(value)), `Missing position content: ${value}`);
      }
    }
  }
  for (const talk of cv.talks) {
    for (const value of [talk.venue, talk.date, talk.location]) {
      assert.ok(content.includes(normalize(value)), `Missing public talk: ${value}`);
    }
    for (const session of talk.sessions) {
      for (const value of [session.name, session.summary, session.type, session.with].filter(Boolean)) {
        assert.ok(content.includes(textContent(value)), `Missing talk session content: ${session.name}`);
      }
      for (const href of Object.values(session.links ?? {})) {
        assert.ok(tags(html).some((tag) => tag.name === 'a' && tag.attributes.href === href),
          `Missing talk resource: ${href}`);
      }
    }
  }
  const ids = new Set(tags(html).map((tag) => tag.attributes.id).filter(Boolean));
  for (const anchor of ['contact-information', 'professional-summary', 'work-experience', 'open-source-contributions', 'public-talks']) {
    assert.ok(ids.has(anchor), `Existing CV anchor must be preserved: #${anchor}`);
  }
});

test('each public page has its own title, canonical URL, and matching sharing metadata', () => {
  const paths = ['/', '/about/', '/cv/', ...posts.map((post) => `/post/${post.slug}/`)];
  const titles = new Set();
  for (const pathname of paths) {
    const html = readPage(pathname);
    const pageTitle = title(html);
    assert.ok(pageTitle.length > 5, `Missing title on ${pathname}`);
    assert.ok(!titles.has(pageTitle), `Duplicate title on ${pathname}`);
    titles.add(pageTitle);
    assert.equal(canonical(html), `${origin}${pathname}`);
    assert.ok(meta(html, 'description')?.trim(), `Missing description on ${pathname}`);
    assert.equal(meta(html, 'og:title'), pageTitle);
    assert.equal(meta(html, 'og:description'), meta(html, 'description'));
    assert.equal(meta(html, 'og:url'), canonical(html));
    assert.ok(textContent(mainContent(html)).length > 100, `Empty page: ${pathname}`);
    if (pathname.startsWith('/post/')) {
      const post = posts.find((entry) => pathname === `/post/${entry.slug}/`);
      assert.ok(pageTitle.includes(post.data.title));
      assert.equal(meta(html, 'description'), post.data.description);
      assert.equal(meta(html, 'og:type'), 'article');
      assert.equal(new Date(meta(html, 'article:published_time')).toISOString(), new Date(post.data.date).toISOString());
    }
  }
});

test('frontmatter aliases work as static redirects without an application runtime', () => {
  for (const post of posts) {
    for (const alias of post.data.aliases ?? []) {
      const html = readPage(`${alias.replace(/\/$/, '')}/`);
      const destination = `/post/${post.slug}/`;
      assert.equal(canonical(html), `${origin}${destination}`);
      const refresh = tags(html).find((tag) => tag.name === 'meta'
        && tag.attributes['http-equiv']?.toLowerCase() === 'refresh')?.attributes.content;
      assert.ok(refresh?.endsWith(`url=${destination}`), `Missing static redirect for ${alias}`);
      assert.ok(tags(html).some((tag) => tag.name === 'a' && tag.attributes.href === destination),
        `Alias must also offer an ordinary link: ${alias}`);
    }
  }
});

test('all local links, fragments, scripts, styles, and images resolve in the Pages artifact', () => {
  const failures = [];
  const idsByFile = new Map();
  const files = htmlFiles(dist);
  for (const file of files) {
    idsByFile.set(file, new Set(tags(readFileSync(file, 'utf8')).map((tag) => tag.attributes.id).filter(Boolean)));
  }
  for (const file of files) {
    const relative = file.slice(dist.length).split(sep).join('/');
    const pathname = relative.endsWith('/index.html') ? relative.slice(0, -10) : relative;
    for (const tag of tags(readFileSync(file, 'utf8'))) {
      const attribute = tag.name === 'a' || tag.name === 'link' ? 'href'
        : ['img', 'script', 'source'].includes(tag.name) ? 'src' : undefined;
      const href = attribute && tag.attributes[attribute];
      // Fully qualified URLs can belong to other GitHub Pages projects on the same domain.
      if (!href || /^[a-z][a-z\d+.-]*:|^\/\//i.test(href)) continue;
      const url = new URL(href, `${origin}${pathname}`);
      const target = pageFile(url.pathname);
      if (!existsSync(target)) {
        failures.push(`${relative}: ${href} points to a missing file`);
        continue;
      }
      if (url.hash && extname(target) === '.html') {
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (!idsByFile.get(target)?.has(fragment)) failures.push(`${relative}: ${href} points to a missing fragment`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test('GitHub Pages receives the custom domain and a real 404 instead of the SPA fallback', () => {
  assert.equal(readFileSync(join(dist, 'CNAME'), 'utf8').trim(), 'asankov.dev');
  const html = readPage('/404.html');
  assert.match(textContent(mainContent(html)), /404/);
  assert.equal(meta(html, 'robots'), 'noindex');
  assert.doesNotMatch(html, /http-equiv=["']refresh["']|location\.(?:replace|assign)|history\.replaceState|spa-github-pages/i);
  for (const file of htmlFiles(dist)) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /<astro-island\b|<script\b[^>]*src=["']\/src\//i,
      `${file} must contain production HTML`);
    assert.doesNotMatch(html, /fetch\s*\(\s*["'`]\/(?:articles\/|cv-data\.yaml)/,
      `${file} must not fetch page content in the browser`);
  }
});
