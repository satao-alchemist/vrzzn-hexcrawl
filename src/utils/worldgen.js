import { hashStr, mulberry32, makeNoise2D, fbm } from './rng'
import { TERRENOS, POIS, SUB_TERRENOS, LOCAIS_CIDADE_OBRIGATORIOS, LOCAIS_CIDADE_EXTRA } from '../data/terrain'

export const HEX_SIZE = 42
export const SQRT3 = Math.sqrt(3)

export function hexCentro(col, row, size = HEX_SIZE) {
  return {
    x: size * 1.5 * col,
    y: size * SQRT3 * (row + (col & 1 ? 0.5 : 0)),
  }
}

export function hexPontas(cx, cy, size = HEX_SIZE) {
  const pts = []
  for (let i = 0; i < 6; i++) {
    const ang = (Math.PI / 180) * (60 * i)
    pts.push(`${cx + size * Math.cos(ang)},${cy + size * Math.sin(ang)}`)
  }
  return pts.join(' ')
}

export function coordLabel(col, row) {
  return `${String(col + 1).padStart(2, '0')}.${String(row + 1).padStart(2, '0')}`
}

function classificarTerreno(e, m) {
  if (e < 0.36) return 'agua'
  if (e < 0.42) return m > 0.5 ? 'pantano' : 'planicie'
  if (e > 0.74) return 'montanha'
  if (e > 0.60) return 'colina'
  if (m < 0.28) return 'deserto'
  if (m > 0.60) return 'floresta'
  return 'planicie'
}

const NOMES_CIDADE = [
  'Valenhall', 'Pedravale', 'Lunara', 'Ferroporto', 'Sombrahaven',
  'Cristalfonte', 'Ventolira', 'Dragãoporto', 'Aurora', 'Névoaguarda',
  'Runicórdia', 'Solária', 'Umbraforte', 'Galespire', 'Brumalira',
]

export function gerarMundo(seedStr, cols = 30, rows = 18) {
  const seed = hashStr(seedStr || 'vrzzn')
  const ruidoElev = makeNoise2D(seed)
  const ruidoUmid = makeNoise2D(seed ^ 0x9e3779b9)
  const hexes = []
  const centroCol = Math.floor(cols / 2)
  const centroRow = Math.floor(rows / 2)
  const rngCidade = mulberry32(hashStr(`cidade:${seedStr}`))
  const nomeCidade = NOMES_CIDADE[Math.floor(rngCidade() * NOMES_CIDADE.length)]

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const e = fbm(ruidoElev, col * 0.09, row * 0.09, 4)
      const m = fbm(ruidoUmid, col * 0.13 + 40, row * 0.13 + 40, 4)
      let terreno = classificarTerreno(e, m)
      const rngHex = mulberry32(hashStr(`${seedStr}:${col},${row}`))
      let poi = null
      let isCidade = false

      if (col === centroCol && row === centroRow) {
        terreno = 'cidade'
        poi = `Cidade de ${nomeCidade}`
        isCidade = true
      } else {
        // Ponto de interesse: ~30% em terra, ~15% na água
        const chance = terreno === 'agua' ? 0.15 : 0.3
        if (rngHex() < chance) {
          const tabela = POIS[terreno]
          poi = tabela[Math.floor(rngHex() * tabela.length)]
        }
      }

      hexes.push({ col, row, terreno, poi, elevacao: e, umidade: m, variante: rngHex(), isCidade })
    }
  }
  return { seedStr, cols, rows, hexes, cidade: { col: centroCol, row: centroRow, nome: nomeCidade } }
}

// Zoom: hexágono de raio 2 (19 sub-hexes = 5 hexes de "diâmetro")
export const SUB_OFFSETS = (() => {
  const lista = []
  for (let q = -2; q <= 2; q++) {
    for (let r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r++) {
      lista.push([q, r])
    }
  }
  return lista
})()

// Converte axial (q,r) para pixel (hexes flat-top)
export function axialParaPixel(q, r, size) {
  return {
    x: size * 1.5 * q,
    y: size * SQRT3 * (r + q / 2),
  }
}

function embaralhar(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function gerarSubMapaCidade(hex, seedStr) {
  const rng = mulberry32(hashStr(`sub-cidade:${seedStr}:${hex.col},${hex.row}`))

  const praca = LOCAIS_CIDADE_OBRIGATORIOS.find((l) => l.nome.startsWith('Praça')) || LOCAIS_CIDADE_OBRIGATORIOS[0]
  const outrosObrigatorios = LOCAIS_CIDADE_OBRIGATORIOS.filter((l) => l !== praca)

  const offsetsRestantes = SUB_OFFSETS.filter(([q, r]) => !(q === 0 && r === 0))
  const offsetsEmbaralhados = embaralhar(offsetsRestantes, rng)

  const extrasEmbaralhados = embaralhar(LOCAIS_CIDADE_EXTRA, rng)
  const obrigatoriosRestantes = embaralhar(outrosObrigatorios, rng)

  const fila = [...obrigatoriosRestantes]
  while (fila.length < offsetsEmbaralhados.length) {
    fila.push(extrasEmbaralhados[fila.length % extrasEmbaralhados.length])
  }

  const porOffset = new Map()
  porOffset.set('0,0', praca)
  offsetsEmbaralhados.forEach(([q, r], i) => {
    porOffset.set(`${q},${r}`, fila[i])
  })

  return SUB_OFFSETS.map(([q, r]) => {
    const central = q === 0 && r === 0
    const tipo = porOffset.get(`${q},${r}`)
    return {
      q,
      r,
      tipo: { nome: tipo.nome, cor: tipo.cor, borda: tipo.borda },
      poi: null,
      central,
    }
  })
}

export function gerarSubMapa(hex, seedStr) {
  if (hex.terreno === 'cidade' || hex.isCidade) {
    return gerarSubMapaCidade(hex, seedStr)
  }

  const rng = mulberry32(hashStr(`sub:${seedStr}:${hex.col},${hex.row}`))
  const subTabela = SUB_TERRENOS[hex.terreno]
  const pesos = [0.22, 0.22, 0.18, 0.15, 0.13, 0.10]

  const escolher = () => {
    const v = rng()
    let acc = 0
    for (let i = 0; i < pesos.length; i++) {
      acc += pesos[i]
      if (v < acc) return subTabela[i]
    }
    return subTabela[0]
  }

  const subs = SUB_OFFSETS.map(([q, r]) => {
    const central = q === 0 && r === 0
    const tipo = central && hex.poi
      ? { nome: hex.poi, cor: subTabela[5].cor, borda: subTabela[5].borda }
      : escolher()
    let poi = null
    if (!central && rng() < 0.35) {
      const tabela = POIS[hex.terreno]
      poi = tabela[Math.floor(rng() * tabela.length)]
    }
    if (central && hex.poi) poi = hex.poi
    return { q, r, tipo, poi, central }
  })

  return subs
}

export function nomeTerreno(key) {
  return TERRENOS[key]?.nome ?? key
}
