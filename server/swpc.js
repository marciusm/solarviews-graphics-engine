// NOAA Space Weather Prediction Center: clima espacial em tempo real.
// Arquivos públicos, sem chave, atualizados a cada minuto (aceitam gzip):
//   • vento solar (velocidade, densidade, temperatura) e campo magnético
//     interplanetário medidos no ponto L1 pela rede RTSW. Várias naves enviam
//     dados ao mesmo tempo (SWFO-L1 "SOLAR1", ACE, IMAP); usamos a marcada como
//     "active", que é a fonte operacional da NOAA.
//   • índice Kp estimado (1 min): atividade geomagnética na Terra.
//   • fluxo de raios-X do GOES (0,1–0,8 nm): define a classe das explosões solares.

const BASE = 'https://services.swpc.noaa.gov';
const HEADERS = {
  'User-Agent': 'solarviews/0.1 (arte generativa; servidor local)',
  'Accept-Encoding': 'gzip',
};

// Os arquivos de 1 minuto são grandes (alguns MB) e o servidor da NOAA às vezes
// engasga: tentamos duas vezes antes de desistir.
async function getJson(path, { timeoutMs = 20000, attempts = 2 } = {}) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(BASE + path, { headers: HEADERS, signal: AbortSignal.timeout(timeoutMs) });
      if (!res.ok) throw new Error(`HTTP ${res.status} em ${path}`);
      return await res.json();
    } catch (err) {
      last = err;
    }
  }
  throw last;
}

// Reserva: os arquivos-resumo têm poucos bytes e só o valor mais recente.
async function getSummary(name) {
  const rows = await getJson(`/products/summary/${name}.json`, { timeoutMs: 10000, attempts: 1 });
  const r = Array.isArray(rows) ? rows[rows.length - 1] : rows;
  if (!r) throw new Error(`resumo ${name} vazio`);
  return r;
}

const num = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
// Alguns arquivos omitem o "Z" do horário UTC.
const utc = (t) => (typeof t === 'string' && !/(Z|[+-]\d\d:?\d\d)$/.test(t) ? `${t}Z` : t);
const newestFirst = (rows) =>
  rows.slice().sort((a, b) => (a.time_tag < b.time_tag ? 1 : a.time_tag > b.time_tag ? -1 : 0));

// A amostra mais recente da nave ativa; se nenhuma estiver ativa, a mais recente válida.
function pickL1(rows, fields) {
  const valid = (r) => fields.every((f) => Number.isFinite(num(r[f])));
  const sorted = newestFirst(rows);
  return sorted.find((r) => r.active === true && valid(r)) || sorted.find(valid) || null;
}

export async function fetchSolarWind() {
  try {
    const r = pickL1(await getJson('/json/rtsw/rtsw_wind_1m.json'), ['proton_speed', 'proton_density']);
    if (!r) throw new Error('sem medições válidas de vento solar');
    return {
      speed: num(r.proton_speed), // km/s
      density: num(r.proton_density), // prótons/cm³
      temperature: num(r.proton_temperature), // K
      time: utc(r.time_tag),
      spacecraft: r.source ?? null,
    };
  } catch (err) {
    // Só a velocidade; densidade e temperatura ficam vazias e a interface usa valores típicos.
    const s = await getSummary('solar-wind-speed').catch(() => null);
    if (!s || !Number.isFinite(num(s.proton_speed))) throw err;
    return { speed: num(s.proton_speed), density: null, temperature: null, time: utc(s.time_tag), spacecraft: null, partial: true };
  }
}

export async function fetchImf() {
  try {
    const r = pickL1(await getJson('/json/rtsw/rtsw_mag_1m.json'), ['bt', 'bz_gsm']);
    if (!r) throw new Error('sem medições válidas de campo magnético');
    return { bt: num(r.bt), bz: num(r.bz_gsm), by: num(r.by_gsm), time: utc(r.time_tag), spacecraft: r.source ?? null };
  } catch (err) {
    const s = await getSummary('solar-wind-mag-field').catch(() => null);
    if (!s || !Number.isFinite(num(s.bt)) || !Number.isFinite(num(s.bz_gsm))) throw err;
    return { bt: num(s.bt), bz: num(s.bz_gsm), by: null, time: utc(s.time_tag), spacecraft: null, partial: true };
  }
}

export async function fetchKp() {
  const rows = await getJson('/json/planetary_k_index_1m.json');
  for (let i = rows.length - 1; i >= 0; i--) {
    const v = num(rows[i].estimated_kp ?? rows[i].kp_index);
    if (Number.isFinite(v)) return { value: v, time: utc(rows[i].time_tag) };
  }
  throw new Error('sem valores de Kp');
}

export async function fetchXray() {
  const rows = await getJson('/json/goes/primary/xrays-6-hour.json');
  for (let i = rows.length - 1; i >= 0; i--) {
    const r = rows[i];
    const flux = num(r.flux);
    if (r.energy === '0.1-0.8nm' && flux > 0) {
      return { flux, class: flareClass(flux), time: utc(r.time_tag), satellite: r.satellite ?? null };
    }
  }
  throw new Error('sem fluxo de raios-X');
}

// Classe da explosão solar a partir do fluxo em W/m² (A, B, C, M, X).
export function flareClass(flux) {
  for (const [letter, base] of [['X', 1e-4], ['M', 1e-5], ['C', 1e-6], ['B', 1e-7]]) {
    if (flux >= base) return `${letter}${(flux / base).toFixed(1)}`;
  }
  return `A${(flux / 1e-8).toFixed(1)}`;
}
