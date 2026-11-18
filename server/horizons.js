// JPL Horizons: efemérides de alta precisão (DE441) da NASA/JPL.
// Documentação: https://ssd-api.jpl.nasa.gov/doc/horizons.html
//
// Pedimos o vetor de estado heliocêntrico (posição + velocidade) de um corpo
// num único instante, no referencial da eclíptica J2000, em UA e UA/dia.
// O Horizons não envia cabeçalhos CORS e pede consultas em série; por isso
// quem conversa com ele é o servidor, nunca o navegador.
//
// Nota (10/11/2026): o parâmetro TLIST passou a ser rejeitado pelo Horizons
// ("Epoch before 5879611 B.C.") e o modo CSV_FORMAT='YES' devolve as linhas
// sem as colunas de posição e velocidade. Por isso usamos START_TIME/STOP_TIME
// com dia juliano e o formato de texto (CSV_FORMAT='NO'). O leitor abaixo
// entende os dois formatos, caso o CSV volte a funcionar.

const API = 'https://ssd.jpl.nasa.gov/api/horizons.api';
const quoted = (v) => `'${v}'`;
const MINUTE = 1 / 1440; // um minuto, em dias

export function vectorsUrl(command, jd) {
  const params = new URLSearchParams({
    format: 'json',
    COMMAND: quoted(command),
    OBJ_DATA: quoted('NO'),
    MAKE_EPHEM: quoted('YES'),
    EPHEM_TYPE: quoted('VECTORS'),
    CENTER: quoted('500@10'), // centro do Sol
    START_TIME: quoted(`JD ${jd.toFixed(6)}`), // o instante pedido (JD)
    STOP_TIME: quoted(`JD ${(jd + MINUTE).toFixed(6)}`), // um minuto depois
    STEP_SIZE: quoted('1'), // um passo: só o início e o fim
    VEC_TABLE: quoted('2'), // posição + velocidade
    REF_PLANE: quoted('ECLIPTIC'),
    REF_SYSTEM: quoted('ICRF'),
    VEC_CORR: quoted('NONE'), // estados geométricos
    OUT_UNITS: quoted('AU-D'),
    CSV_FORMAT: quoted('NO'),
    VEC_LABELS: quoted('NO'),
  });
  return `${API}?${params}`;
}

// Extrai o primeiro registro entre $$SOE e $$EOE. Dois formatos possíveis:
//
//   texto:  JDTDB = A.D. data TDB
//           X  Y  Z
//           VX VY VZ
//
//   CSV:    JDTDB, data, X, Y, Z, VX, VY, VZ,
export function parseVectors(text) {
  const start = text.indexOf('$$SOE');
  const end = text.indexOf('$$EOE');
  if (start < 0 || end < 0) {
    const hint = text.trim().split('\n').slice(-2).join(' ').slice(0, 160);
    throw new Error(`resposta sem efemérides (${hint})`);
  }
  const lines = text.slice(start + 5, end).trim().split(/\r?\n/).map((l) => l.trim());
  let jdTdb;
  let nums;
  if (lines[0].includes('=')) {
    jdTdb = Number(lines[0].split('=')[0]);
    nums = lines.slice(1, 3).join(' ').split(/\s+/).map(Number);
  } else {
    const cols = lines[0].split(',').map((s) => s.trim());
    jdTdb = Number(cols[0]);
    nums = cols.slice(2, 8).map(Number);
  }
  if (!Number.isFinite(jdTdb) || nums.length < 6 || nums.slice(0, 6).some((n) => !Number.isFinite(n))) {
    throw new Error('vetor de estado ilegível');
  }
  return { jdTdb, position: nums.slice(0, 3), velocity: nums.slice(3, 6) };
}

export async function fetchStateVector(command, jd, { timeoutMs = 20000 } = {}) {
  const res = await fetch(vectorsUrl(command, jd), {
    headers: { 'User-Agent': 'solarviews/0.1 (arte generativa; servidor local)' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(body.error);
  return parseVectors(body.result);
}
