// Dados físicos dos planetas: constantes que não mudam com o tempo.
// O que muda (onde cada planeta está AGORA e a que velocidade) chega do
// JPL Horizons pelo servidor. Veja server/horizons.js.
//
// magnetosphere: tamanho relativo da "bolha" magnética que desvia o vento
// solar (0 a 1). Júpiter tem a maior do sistema; Vênus e Marte quase não têm
// campo próprio. No visual, é o raio da esteira que cada planeta abre no vento.

export const PLANETS = [
  { id: 'mercury', horizons: '199', name: 'Mercúrio', symbol: '☿', color: '#cfc4b8', radiusKm: 2439.7, massEarth: 0.0553, periodDays: 87.969,   rotationHours: 1407.6,  magnetosphere: 0.25 },
  { id: 'venus',   horizons: '299', name: 'Vênus',    symbol: '♀', color: '#f5dca8', radiusKm: 6051.8, massEarth: 0.815,  periodDays: 224.701,  rotationHours: -5832.5, magnetosphere: 0.12 },
  { id: 'earth',   horizons: '399', name: 'Terra',    symbol: '♁', color: '#6aa6ff', radiusKm: 6371.0, massEarth: 1.0,    periodDays: 365.256,  rotationHours: 23.934,  magnetosphere: 0.5 },
  { id: 'mars',    horizons: '499', name: 'Marte',    symbol: '♂', color: '#ff7b4f', radiusKm: 3389.5, massEarth: 0.107,  periodDays: 686.980,  rotationHours: 24.623,  magnetosphere: 0.12 },
  { id: 'jupiter', horizons: '599', name: 'Júpiter',  symbol: '♃', color: '#eab98a', radiusKm: 69911,  massEarth: 317.8,  periodDays: 4332.59,  rotationHours: 9.925,   magnetosphere: 1.0 },
  { id: 'saturn',  horizons: '699', name: 'Saturno',  symbol: '♄', color: '#f2d892', radiusKm: 58232,  massEarth: 95.16,  periodDays: 10759.22, rotationHours: 10.656,  magnetosphere: 0.75 },
  { id: 'uranus',  horizons: '799', name: 'Urano',    symbol: '♅', color: '#a3f2f0', radiusKm: 25362,  massEarth: 14.54,  periodDays: 30688.5,  rotationHours: -17.24,  magnetosphere: 0.55 },
  { id: 'neptune', horizons: '899', name: 'Netuno',   symbol: '♆', color: '#5f80ff', radiusKm: 24622,  massEarth: 17.15,  periodDays: 60182,    rotationHours: 16.11,   magnetosphere: 0.55 },
];

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const srgbToLinear = (rgb) => rgb.map((v) => Math.pow(v, 2.2));

for (const p of PLANETS) {
  p.rgb = hexToRgb(p.color); // espaço da tela (sRGB)
  p.lin = srgbToLinear(p.rgb); // espaço linear (campo HDR)
}
