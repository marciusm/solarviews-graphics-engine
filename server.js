// SOLARVIEWS & GALAXY GRAPHICS ENGINE: servidor local, sem dependências.
//   • consulta as posições dos planetas no JPL Horizons (a cada 10 min)
//   • consulta o clima espacial na NOAA SWPC (a cada 60 s)
//   • entrega tudo junto em /api/state e serve a ferramenta (index.html e font/)
//   • aberta por http://localhost, a ferramenta pode usar MIDI no Firefox,
//     o que um arquivo aberto do disco não pode
//
// Uso:  node server.js
// Variáveis opcionais: PORT (3000), HOST (127.0.0.1), HORIZONS_MINUTES (10), SWPC_SECONDS (60)

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLANETS } from './server/planets.js';
import { fetchStateVector } from './server/horizons.js';
import { fetchSolarWind, fetchImf, fetchKp, fetchXray } from './server/swpc.js';

const ROOT = fileURLToPath(new URL('./', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const PLANETS_EVERY = (Number(process.env.HORIZONS_MINUTES) || 10) * 60_000;
const SPACE_EVERY = (Number(process.env.SWPC_SECONDS) || 60) * 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jdNow = () => Date.now() / 86400000 + 2440587.5;
const log = (...args) => console.log(new Date().toISOString().slice(11, 19), ...args);

// ── estado em memória ────────────────────────────────────────────────
const planets = { bodies: new Map(), fetchedAt: null, error: null, loading: false };
const space = {
  wind: { fetch: fetchSolarWind, data: null, fetchedAt: null, error: null },
  imf: { fetch: fetchImf, data: null, fetchedAt: null, error: null },
  kp: { fetch: fetchKp, data: null, fetchedAt: null, error: null },
  xray: { fetch: fetchXray, data: null, fetchedAt: null, error: null },
};

async function refreshPlanets() {
  if (planets.loading) return;
  planets.loading = true;
  const jd = jdNow();
  const errors = [];
  try {
    for (const p of PLANETS) {
      try {
        const v = await fetchStateVector(p.horizons, jd);
        planets.bodies.set(p.id, { id: p.id, ...v, fetchedAt: new Date().toISOString() });
      } catch (err) {
        errors.push(`${p.name}: ${err.message}`);
      }
      await sleep(400); // o Horizons pede consultas em série, uma de cada vez
    }
  } finally {
    planets.loading = false;
  }
  const ok = PLANETS.length - errors.length;
  if (ok > 0) planets.fetchedAt = new Date().toISOString();
  planets.error = errors.length ? errors.join(' · ') : null;
  log(`JPL Horizons: ${ok}/${PLANETS.length} planetas atualizados${errors.length ? ` (falhas: ${planets.error})` : ''}`);
}

async function refreshSpace() {
  await Promise.all(
    Object.values(space).map(async (slot) => {
      try {
        const next = await slot.fetch();
        // Leitura parcial (arquivo-resumo): mantém os campos que faltam da leitura anterior.
        if (next.partial && slot.data) {
          for (const k of Object.keys(next)) if (next[k] === null && slot.data[k] != null) next[k] = slot.data[k];
        }
        slot.data = next;
        slot.fetchedAt = new Date().toISOString();
        slot.error = null;
      } catch (err) {
        slot.error = err.message;
      }
    }),
  );
  const { wind, imf, kp, xray } = space;
  const fails = Object.entries(space).filter(([, s]) => s.error).map(([k, s]) => `${k}: ${s.error}`);
  log(
    'NOAA SWPC:',
    wind.data
      ? `vento ${Math.round(wind.data.speed)} km/s${Number.isFinite(wind.data.density) ? `, ${wind.data.density.toFixed(1)} p/cm³` : ' (resumo)'}`
      : 'vento —',
    '·',
    imf.data ? `Bz ${imf.data.bz.toFixed(1)} nT` : 'Bz —',
    '·',
    kp.data ? `Kp ${kp.data.value.toFixed(2)}` : 'Kp —',
    '·',
    xray.data ? `raios-X ${xray.data.class}` : 'raios-X —',
    fails.length ? `(falhas: ${fails.join(' · ')})` : '',
  );
}

function status(fetchedAt, error, everyMs, loading = false) {
  if (!fetchedAt) return loading || !error ? 'loading' : 'offline';
  return Date.now() - Date.parse(fetchedAt) < everyMs * 3 ? 'live' : 'stale';
}

function snapshot() {
  const slot = (s) => ({ status: status(s.fetchedAt, s.error, SPACE_EVERY), fetchedAt: s.fetchedAt, error: s.error, data: s.data });
  return {
    serverTime: new Date().toISOString(),
    planets: {
      source: 'NASA/JPL Horizons',
      status: status(planets.fetchedAt, planets.error, PLANETS_EVERY, planets.loading),
      fetchedAt: planets.fetchedAt,
      error: planets.error,
      bodies: [...planets.bodies.values()],
    },
    space: {
      source: 'NOAA SWPC',
      wind: slot(space.wind),
      imf: slot(space.imf),
      kp: slot(space.kp),
      xray: slot(space.xray),
    },
  };
}

// ── HTTP ─────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.md': 'text/markdown; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/state') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*', // outras ferramentas (TouchDesigner, Max, Resolume…) podem ler
    });
    return res.end(JSON.stringify(snapshot()));
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    return res.end();
  }

  let rel;
  try {
    rel = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400);
    return res.end();
  }
  if (rel.endsWith('/')) rel += 'index.html';

  // Não servir o código do servidor nem arquivos ocultos (.git etc.).
  const parts = rel.split('/').filter(Boolean);
  if (parts.some((p) => p.startsWith('.')) || parts[0] === 'server' || parts[0] === 'node_modules') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('não encontrado');
  }

  const file = resolve(ROOT, `.${rel}`);
  if (!file.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
    res.writeHead(403);
    return res.end();
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('não encontrado');
  }
});

function listen(port, attempts = 10) {
  const onError = (err) => {
    if (err.code === 'EADDRINUSE' && attempts > 0) {
      log(`a porta ${port} está ocupada, tentando ${port + 1}…`);
      listen(port + 1, attempts - 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  };
  server.once('error', onError);
  server.listen(port, HOST, () => {
    server.off('error', onError);
    const shown = HOST === '0.0.0.0' || HOST === '127.0.0.1' ? 'localhost' : HOST;
    console.log(`\n  ☀  SOLARVIEWS & GALAXY GRAPHICS ENGINE\n     abra http://${shown}:${port}\n`);
    log(`dados: JPL Horizons a cada ${PLANETS_EVERY / 60000} min · NOAA SWPC a cada ${SPACE_EVERY / 1000} s`);
  });
}

listen(PORT);
refreshSpace();
refreshPlanets();
setInterval(refreshSpace, SPACE_EVERY);
setInterval(refreshPlanets, PLANETS_EVERY);
process.on('SIGINT', () => {
  log('até logo');
  process.exit(0);
});
