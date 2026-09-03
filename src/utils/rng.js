export function hashStr(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function latticeHash(seed, x, y) {
  let h = seed >>> 0
  h ^= Math.imul(x, 374761393)
  h ^= Math.imul(y, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967295
}

function smooth(t) {
  return t * t * (3 - 2 * t)
}

export function makeNoise2D(seed) {
  return function noise(x, y) {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const a = latticeHash(seed, xi, yi)
    const b = latticeHash(seed, xi + 1, yi)
    const c = latticeHash(seed, xi, yi + 1)
    const d = latticeHash(seed, xi + 1, yi + 1)
    const u = smooth(xf)
    const v = smooth(yf)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
}

export function fbm(noise, x, y, octaves = 4) {
  let value = 0
  let amplitude = 0.5
  let freq = 1
  let total = 0
  for (let i = 0; i < octaves; i++) {
    value += noise(x * freq, y * freq) * amplitude
    total += amplitude
    amplitude *= 0.5
    freq *= 2.1
  }
  return value / total
}

export const d6 = (rng = Math.random) => 1 + Math.floor(rng() * 6)
export const d66 = (rng = Math.random) => [d6(rng), d6(rng)]

export const idx36 = ([a, b]) => (a - 1) * 6 + (b - 1)

export const idx18 = ([a, b]) => (a - 1) * 3 + Math.floor((b - 1) / 2)
