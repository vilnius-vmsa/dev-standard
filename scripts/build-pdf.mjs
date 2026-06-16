import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PDFDocument } from 'pdf-lib';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const buildDir = path.resolve(projectRoot, process.env.PDF_BUILD_DIR ?? 'build');
const outputPath = path.resolve(projectRoot, process.env.PDF_OUTPUT ?? 'artifacts/dev-standard.pdf');
const preferredPort = Number(process.env.PDF_SERVER_PORT ?? 0);

const printCss = `
  @page {
    margin: 18mm 16mm;
  }

  @media print {
    nav.navbar,
    aside.theme-doc-sidebar-container,
    .theme-doc-toc-desktop,
    .theme-doc-breadcrumbs,
    .theme-edit-this-page,
    .pagination-nav,
    footer.footer {
      display: none !important;
    }

    body,
    main,
    article,
    .main-wrapper,
    .container,
    .row,
    .col,
    .theme-doc-markdown {
      max-width: none !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    a {
      color: inherit !important;
      text-decoration: none !important;
    }

    pre,
    blockquote,
    table,
    img,
    svg {
      break-inside: avoid;
    }

    pre {
      white-space: pre-wrap !important;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      break-after: avoid;
    }
  }
`;

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

await access(buildDir);

const sitemapRoutes = await readSitemapRoutes(buildDir);
const basePath = process.env.PDF_BASE_PATH ?? inferBasePath(sitemapRoutes);
const docRoutes = await readDocRoutes(path.resolve(projectRoot, 'docs'));
const routes = orderRoutes(docRoutes, sitemapRoutes, basePath);

if (routes.length === 0) {
  throw new Error('No pages found to include in the PDF.');
}

const server = await startServer(buildDir, basePath, preferredPort);
const browser = await chromium.launch();

try {
  const mergedPdf = await PDFDocument.create();

  for (const [index, route] of routes.entries()) {
    const url = new URL(route, server.origin).toString();
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: printCss });

      const title = await page.title();
      console.log(`Printing ${index + 1}/${routes.length}: ${title || route}`);

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '18mm',
          right: '16mm',
          bottom: '18mm',
          left: '16mm',
        },
      });

      const routePdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(routePdf, routePdf.getPageIndices());
      for (const copiedPage of copiedPages) {
        mergedPdf.addPage(copiedPage);
      }
    } finally {
      await page.close();
    }
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, await mergedPdf.save());
  console.log(`PDF written to ${path.relative(projectRoot, outputPath)}`);
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.instance.close((error) => (error ? reject(error) : resolve()));
  });
}

async function readSitemapRoutes(rootDir) {
  const sitemapPath = path.join(rootDir, 'sitemap.xml');

  try {
    const sitemap = await readFile(sitemapPath, 'utf8');
    const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => decodeXml(match[1].trim()))
      .map((loc) => new URL(loc).pathname)
      .filter((pathname) => !pathname.endsWith('/404') && !pathname.endsWith('/404.html'));

    return [...new Set(routes)];
  } catch {
    return [];
  }
}

function inferBasePath(routes) {
  if (routes.length === 0) {
    return '/';
  }

  const segments = routes.map((route) => route.split('/').filter(Boolean));
  const commonSegments = [];

  for (let index = 0; ; index += 1) {
    const segment = segments[0]?.[index];

    if (!segment || !segments.every((parts) => parts[index] === segment)) {
      break;
    }

    commonSegments.push(segment);
  }

  return commonSegments.length > 0 ? `/${commonSegments.join('/')}/` : '/';
}

async function readDocRoutes(docsDir) {
  const files = await listMarkdownFiles(docsDir);

  return Promise.all(
    files.map(async (filePath) => {
      const content = await readFile(filePath, 'utf8');
      const slug = readFrontmatterValue(content, 'slug');
      const relativePath = path.relative(docsDir, filePath);

      return normalizeRoute(slug ?? routeFromDocPath(relativePath));
    }),
  );
}

async function listMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await listMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
      results.push(entryPath);
    }
  }

  return results.sort((left, right) => left.localeCompare(right, 'lt'));
}

function readFrontmatterValue(content, key) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatter) {
    return undefined;
  }

  const value = frontmatter[1].match(new RegExp(`^${key}:\\s*['"]?([^'"\\r\\n]+)['"]?\\s*$`, 'm'));
  return value?.[1].trim();
}

function routeFromDocPath(relativePath) {
  const parsed = path.parse(relativePath);
  const routePath = path
    .join(parsed.dir, parsed.name)
    .split(path.sep)
    .map(stripDocusaurusNumberPrefix)
    .join('/');

  return routePath.endsWith('/index') ? routePath.slice(0, -'/index'.length) : routePath;
}

function stripDocusaurusNumberPrefix(segment) {
  return segment.replace(/^\d+[-_]/, '');
}

function normalizeRoute(route) {
  const withoutTrailingSlash = route === '/' ? route : route.replace(/\/+$/, '');
  return withoutTrailingSlash.startsWith('/') ? withoutTrailingSlash : `/${withoutTrailingSlash}`;
}

function orderRoutes(docRoutes, sitemapRoutes, basePrefix) {
  if (sitemapRoutes.length === 0) {
    return docRoutes.map((route) => routeWithBase(route, basePrefix));
  }

  const sitemapSet = new Set(sitemapRoutes);
  const orderedRoutes = [];

  for (const route of docRoutes) {
    const candidate = routeWithBase(route, basePrefix);

    if (sitemapSet.has(candidate)) {
      orderedRoutes.push(candidate);
    }
  }

  for (const route of sitemapRoutes) {
    if (!orderedRoutes.includes(route)) {
      orderedRoutes.push(route);
    }
  }

  return orderedRoutes;
}

function routeWithBase(route, basePrefix) {
  if (basePrefix === '/') {
    return route;
  }

  return route === '/' ? basePrefix : `${basePrefix}${route.slice(1)}`;
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

async function startServer(rootDir, basePrefix, port) {
  const server = createServer(async (request, response) => {
    try {
      const requestPath = new URL(request.url ?? '/', 'http://localhost').pathname;
      const filePath = await resolveStaticFile(rootDir, stripBasePath(requestPath, basePrefix));

      if (!filePath) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      const contentType = contentTypes.get(path.extname(filePath)) ?? 'application/octet-stream';
      response.writeHead(200, { 'content-type': contentType });
      createReadStream(filePath).pipe(response);
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(error instanceof Error ? error.message : String(error));
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;
  return {
    instance: server,
    origin: `http://127.0.0.1:${actualPort}`,
  };
}

function stripBasePath(requestPath, basePrefix) {
  if (basePrefix === '/') {
    return requestPath;
  }

  const normalizedBase = basePrefix.endsWith('/') ? basePrefix : `${basePrefix}/`;
  const baseWithoutSlash = normalizedBase.slice(0, -1);

  if (requestPath === baseWithoutSlash || requestPath === normalizedBase) {
    return '/';
  }

  if (requestPath.startsWith(normalizedBase)) {
    return `/${requestPath.slice(normalizedBase.length)}`;
  }

  return requestPath;
}

async function resolveStaticFile(rootDir, requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  const candidates = fileCandidates(decodedPath);

  for (const candidate of candidates) {
    const filePath = path.resolve(rootDir, `.${candidate}`);

    const relativePath = path.relative(rootDir, filePath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      continue;
    }

    try {
      const fileStat = await stat(filePath);

      if (fileStat.isFile()) {
        return filePath;
      }
    } catch {
      // Try the next candidate.
    }
  }

  return undefined;
}

function fileCandidates(requestPath) {
  if (path.extname(requestPath)) {
    return [requestPath];
  }

  const withoutTrailingSlash = requestPath.replace(/\/+$/, '') || '/';

  if (withoutTrailingSlash === '/') {
    return ['/index.html'];
  }

  return [
    `${withoutTrailingSlash}.html`,
    `${withoutTrailingSlash}/index.html`,
  ];
}
