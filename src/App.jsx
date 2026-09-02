import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import HexMap from './components/HexMap'
import HexZoomModal from './components/HexZoomModal'
import OraclePanel from './components/OraclePanel'
import Diary from './components/Diary'
import DicePanel from './components/DicePanel'
import { gerarMundo, coordLabel } from './utils/worldgen'
import { d66, idx18, idx36 } from './utils/rng'
import { GANCHO_ASSUNTO, GANCHO_ACONTECIMENTO, CLIMA, NPC_TRACO, NPC_PAPEL } from './data/oracle'
import { TERRENOS } from './data/terrain'

const STORAGE = {
  seed: 'vrzzn-g-seed',
  diario: 'vrzzn-g-diario',
  explorados: 'vrzzn-g-explorados',
  subexplorados: 'vrzzn-g-subexplorados',
}

const ABAS = [
  { id: 'oracle', nome: '🔮 Oráculo' },
  { id: 'dados', nome: '🎲 Dados' },
  { id: 'diario', nome: '📜 Diário' },
]

export default function App() {
  const [seed, setSeed] = useState(() => localStorage.getItem(STORAGE.seed) || 'wyrdlands')
  const [seedInput, setSeedInput] = useState(seed)
  const [selecionado, setSelecionado] = useState(null)
  const [hexZoom, setHexZoom] = useState(null)
  const [aba, setAba] = useState('oracle')
  const arquivoRef = useRef(null)
  const [entradas, setEntradas] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE.diario) || '[]') } catch { return [] }
  })
  const [hexesExplorados, setHexesExplorados] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE.explorados) || '[]') } catch { return [] }
  })
  const [subExplorados, setSubExplorados] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE.subexplorados) || '{}') } catch { return {} }
  })

  const mundo = useMemo(() => gerarMundo(seed), [seed])
  const cidadeHex = useMemo(() => mundo.hexes.find((h) => h.isCidade) || null, [mundo])

  useEffect(() => { localStorage.setItem(STORAGE.seed, seed) }, [seed])
  useEffect(() => { localStorage.setItem(STORAGE.diario, JSON.stringify(entradas)) }, [entradas])
  useEffect(() => { localStorage.setItem(STORAGE.explorados, JSON.stringify(hexesExplorados)) }, [hexesExplorados])
  useEffect(() => { localStorage.setItem(STORAGE.subexplorados, JSON.stringify(subExplorados)) }, [subExplorados])

  const marcarHexExplorado = useCallback((col, row) => {
    const k = `${col},${row}`
    setHexesExplorados((prev) => (prev.includes(k) ? prev : [...prev, k]))
  }, [])

  const desmarcarHexExplorado = useCallback((col, row) => {
    const k = `${col},${row}`
    setHexesExplorados((prev) => prev.filter((x) => x !== k))
    setSubExplorados((prev) => ({ ...prev, [k]: [] }))
  }, [])

  const marcarSubExplorado = useCallback((col, row, subKey) => {
    const hexKey = `${col},${row}`
    setSubExplorados((prev) => {
      const atual = prev[hexKey] || []
      if (atual.includes(subKey)) return prev
      return { ...prev, [hexKey]: [...atual, subKey] }
    })
    marcarHexExplorado(col, row)
  }, [marcarHexExplorado])

  const desmarcarSubExplorado = useCallback((col, row, subKey) => {
    const hexKey = `${col},${row}`
    setSubExplorados((prev) => {
      const atual = prev[hexKey] || []
      const filtrado = atual.filter((x) => x !== subKey)
      if (filtrado.length === 0) {
        setHexesExplorados((hexes) => hexes.filter((x) => x !== hexKey))
      }
      return { ...prev, [hexKey]: filtrado }
    })
  }, [])

  const registrar = useCallback((texto) => {
    setEntradas((l) => [{ id: Date.now() + Math.random(), data: Date.now(), texto }, ...l])
  }, [])

  const novaAventura = () => {
    const assunto = GANCHO_ASSUNTO[idx18(d66())]
    const acontecimento = GANCHO_ACONTECIMENTO[idx18(d66())]
    const clima = CLIMA[idx36(d66())]
    const npc = `${NPC_PAPEL[idx18(d66())]} ${NPC_TRACO[idx18(d66())].toLowerCase()}`
    const inicio = cidadeHex || mundo.hexes.find((h) => h.terreno !== 'agua')
    setSelecionado(inicio)
    registrar(
      `🎬 Nova aventura! Gancho: ${assunto} — ${acontecimento}. ` +
      `Clima: ${clima}. Envolve: ${npc}. ` +
      `Ponto de partida: ${inicio?.isCidade ? `Cidade de ${mundo.cidade?.nome}` : 'hex'} ${coordLabel(inicio.col, inicio.row)}.`
    )
    setAba('diario')
  }

  const novoMapa = () => {
    const s = seedInput.trim() || String(Math.floor(Math.random() * 99999))
    setSeed(s)
    setSeedInput(s)
    setSelecionado(null)
    setHexZoom(null)
    setHexesExplorados([])
    setSubExplorados({})
  }

  const mapaAleatorio = () => {
    const s = String(Math.floor(Math.random() * 999999))
    setSeed(s)
    setSeedInput(s)
    setSelecionado(null)
    setHexZoom(null)
    setHexesExplorados([])
    setSubExplorados({})
  }

  const salvar = () => {
    const save = {
      app: 'vrzzn-hexcrawl',
      versao: 1,
      data: new Date().toISOString(),
      seed,
      selecionado: selecionado ? { col: selecionado.col, row: selecionado.row } : null,
      entradas,
      hexesExplorados,
      subExplorados,
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vrzzn-hexcrawl-${seed}-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const carregar = (ev) => {
    const file = ev.target.files?.[0]
    ev.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const save = JSON.parse(reader.result)
        if (!save.seed) throw new Error('arquivo inválido')
        setSeed(save.seed)
        setSeedInput(save.seed)
        setEntradas(Array.isArray(save.entradas) ? save.entradas : [])
        setHexesExplorados(Array.isArray(save.hexesExplorados) ? save.hexesExplorados : [])
        setSubExplorados(save.subExplorados && typeof save.subExplorados === 'object' ? save.subExplorados : {})
        setHexZoom(null)
        if (save.selecionado) {
          const mundoNovo = gerarMundo(save.seed)
          const h = mundoNovo.hexes.find((x) => x.col === save.selecionado.col && x.row === save.selecionado.row)
          setSelecionado(h || null)
        } else {
          setSelecionado(null)
        }
      } catch {
        alert('Não foi possível carregar: arquivo de save inválido.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="app">
      <header className="topo">
        <h1>🔮 VrzzN Hexcrawl <small>RPG Solo</small></h1>
        <div className="topo-controles">
          <input
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            placeholder="semente do mundo"
            onKeyDown={(e) => e.key === 'Enter' && novoMapa()}
          />
          <button className="btn-topo" onClick={novoMapa}>Gerar mapa</button>
          <button className="btn-topo" onClick={mapaAleatorio}>🎲 Mapa aleatório</button>
          <button className="btn-topo destaque" onClick={novaAventura}>🎬 Nova aventura</button>
          <button className="btn-topo" onClick={salvar} title="Baixar save (.json)">💾 Salvar</button>
          <button className="btn-topo" onClick={() => arquivoRef.current?.click()} title="Carregar save">📂 Carregar</button>
          <input ref={arquivoRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={carregar} />
        </div>
      </header>

      <main className="layout">
        <section className="area-mapa">
          <HexMap
            mundo={mundo}
            selecionado={selecionado}
            explorados={hexesExplorados}
            onSelecionar={(h) => {
              setSelecionado(h)
              setHexZoom(h)
            }}
          />
          <div className="legenda">
            {Object.values(TERRENOS).map((t) => (
              <span key={t.nome}>
                <i style={{ background: t.cor, borderColor: t.borda }} />
                <span className="leg-emoji">{t.emoji}</span> {t.nome}
              </span>
            ))}
            <span><i className="leg-poi">◆</i> Ponto de interesse</span>
            <span>🏛️ Cidade (hub)</span>
            <span><i className="leg-explorado">✓</i> Hex explorado</span>
          </div>
        </section>

        <aside className="lateral">
          <nav className="abas">
            {ABAS.map((a) => (
              <button key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>
                {a.nome}
              </button>
            ))}
          </nav>
          {aba === 'oracle' && <OraclePanel onRegistrar={registrar} />}
          {aba === 'dados' && <DicePanel onRegistrar={registrar} />}
          {aba === 'diario' && (
            <Diary
              entradas={entradas}
              onAdicionar={registrar}
              onRemover={(id) => setEntradas((l) => l.filter((e) => e.id !== id))}
              onLimpar={() => setEntradas([])}
            />
          )}
        </aside>
      </main>

      {hexZoom && (() => {
        const hexKey = `${hexZoom.col},${hexZoom.row}`
        const jaTemRegistro = Object.prototype.hasOwnProperty.call(subExplorados, hexKey)
        return (
          <HexZoomModal
            key={hexKey}
            hex={hexZoom}
            seed={seed}
            visitadosIniciais={jaTemRegistro ? subExplorados[hexKey] : []}
            onMarcarSub={(subKey) => marcarSubExplorado(hexZoom.col, hexZoom.row, subKey)}
            onDesmarcarSub={(subKey) => desmarcarSubExplorado(hexZoom.col, hexZoom.row, subKey)}
            onDesmarcarHex={() => desmarcarHexExplorado(hexZoom.col, hexZoom.row)}
            onFechar={() => setHexZoom(null)}
            onRegistrar={registrar}
            entradas={entradas}
            onRemoverEntrada={(id) => setEntradas((l) => l.filter((e) => e.id !== id))}
            onLimparDiario={() => setEntradas([])}
          />
        )
      })()}

      <footer className="rodape">
        Oráculo <b>VrzzN</b> por Wyrdlands · Hexmaps procedurais.
      </footer>
    </div>
  )
}
