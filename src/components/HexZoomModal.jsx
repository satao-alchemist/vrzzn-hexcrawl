import { useMemo, useState, useEffect } from 'react'
import { TERRENOS } from '../data/terrain'
import { gerarSubMapa, axialParaPixel, hexPontas, coordLabel } from '../utils/worldgen'
import OraclePanel from './OraclePanel'
import DicePanel from './DicePanel'
import Diary from './Diary'

const VIZINHOS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]
const SUB_SIZE = 52
const CENTRO = 160

const ABAS_ZOOM = [
  { id: 'local', nome: '📍 Local' },
  { id: 'oracle', nome: '🔮 Oráculo' },
  { id: 'dados', nome: '🎲 Dados' },
  { id: 'diario', nome: '📜 Diário' },
]

/** Rótulo no estilo do mapa geral: 00.00 a partir de q,r (offset +2) */
function subLabel(q, r) {
  return coordLabel(q + 2, r + 2)
}

export default function HexZoomModal({
  hex,
  seed,
  visitadosIniciais = [],
  onMarcarSub,
  onDesmarcarSub,
  onDesmarcarHex,
  onFechar,
  onRegistrar,
  entradas = [],
  onRemoverEntrada,
  onLimparDiario,
}) {
  const subs = useMemo(() => {
    const lista = gerarSubMapa(hex, seed)
    return lista.map((s, i) => ({ ...s, label: subLabel(s.q, s.r), idx: i + 1 }))
  }, [hex, seed])

  // pos null = ainda não escolheu de onde começar
  const [pos, setPos] = useState(null)
  const [visitados, setVisitados] = useState(() => new Set(visitadosIniciais))
  const [abaZoom, setAbaZoom] = useState('local')

  useEffect(() => {
    setVisitados(new Set(visitadosIniciais))
  }, [visitadosIniciais])

  useEffect(() => {
    setPos(null)
    setAbaZoom('local')
  }, [hex?.col, hex?.row])

  if (!hex) return null

  const t = TERRENOS[hex.terreno]
  const atual = pos
    ? subs.find((s) => s.q === pos[0] && s.r === pos[1])
    : null
  const ehVizinho = (s) =>
    pos && VIZINHOS.some(([dq, dr]) => s.q === pos[0] + dq && s.r === pos[1] + dr)
  const key = (s) => `${s.q},${s.r}`
  const temExplorado = visitados.size > 0

  const escolherInicio = (s) => {
    setPos([s.q, s.r])
  }

  const mover = (s) => {
    if (!pos) {
      escolherInicio(s)
      return
    }
    if (!ehVizinho(s) && !(s.q === pos[0] && s.r === pos[1])) return
    setPos([s.q, s.r])
  }

  const toggleExplorado = (s) => {
    const k = key(s)
    if (visitados.has(k)) {
      setVisitados((v) => {
        const next = new Set(v)
        next.delete(k)
        return next
      })
      onDesmarcarSub?.(k)
    } else {
      setVisitados((v) => new Set(v).add(k))
      onMarcarSub?.(k)
    }
  }

  const desmarcarTudo = () => {
    setVisitados(new Set())
    onDesmarcarHex?.()
  }

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-zoom modal-zoom-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-topo">
          <h2>
            Hex {coordLabel(hex.col, hex.row)} —{' '}
            <span className="chip-terreno" style={{ background: t.cor, borderColor: t.borda }}>
              {t.emoji} {t.nome}
            </span>
            {temExplorado && <small style={{ marginLeft: 8, opacity: 0.75 }}>· {visitados.size} explorado(s)</small>}
          </h2>
          <button className="btn-fechar" onClick={onFechar} title="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="zoom-mapa-area">
            <svg viewBox="-80 -80 480 480" className="submapa-grande">
              {subs.map((s) => {
                const p = axialParaPixel(s.q, s.r, SUB_SIZE)
                const x = CENTRO + p.x
                const y = CENTRO + p.y
                const jogador = pos && s.q === pos[0] && s.r === pos[1]
                const alcancavel = !pos || ehVizinho(s)
                const marcado = visitados.has(key(s))
                return (
                  <g
                    key={s.label}
                    className={alcancavel || !pos ? 'sub-hex alcancavel' : 'sub-hex'}
                    onClick={() => mover(s)}
                    style={{ cursor: alcancavel || !pos ? 'pointer' : 'default' }}
                  >
                    <polygon
                      points={hexPontas(x, y, SUB_SIZE * 0.96)}
                      fill={s.tipo.cor}
                      stroke={jogador ? '#c0392b' : !pos ? '#f1c40f' : alcancavel ? '#f1c40f' : s.tipo.borda}
                      strokeWidth={jogador ? 3.5 : !pos || alcancavel ? 2.5 : 1.2}
                      strokeDasharray={!jogador && (!pos || alcancavel) ? '7 5' : undefined}
                    >
                      <title>{`${s.label} — ${s.tipo.nome}${s.poi ? ` — ◆ ${s.poi}` : ''}`}</title>
                    </polygon>
                    <text
                      x={x}
                      y={y - SUB_SIZE * 0.35}
                      textAnchor="middle"
                      className="hex-label"
                      fontSize={11}
                    >
                      {s.label}
                    </text>
                    {s.poi && (
                      <text x={x} y={y + 8} textAnchor="middle" className="poi-marcador sub">◆</text>
                    )}
                    {marcado && (
                      <circle cx={x - SUB_SIZE * 0.5} cy={y - SUB_SIZE * 0.5} r={5} fill="#2c6e49" opacity={0.9} />
                    )}
                    {jogador && (
                      <text x={x} y={y + 18} textAnchor="middle" className="jogador-token">🧙</text>
                    )}
                  </g>
                )
              })}
            </svg>
            <p className="dica-zoom">
              {!pos
                ? 'Clique em qualquer mini-hexágono para começar a exploração por ele.'
                : 'Clique num vizinho (contorno amarelo) para andar. Marque explorado só com a caixa de seleção.'}
            </p>
          </div>

          <div className="zoom-info">
            <nav className="abas abas-zoom">
              {ABAS_ZOOM.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={abaZoom === a.id ? 'ativa' : ''}
                  onClick={() => setAbaZoom(a.id)}
                >
                  {a.nome}
                </button>
              ))}
            </nav>

            {abaZoom === 'local' && (
              <div className="zoom-aba-conteudo">
                {!atual ? (
                  <>
                    <h3>Escolha o ponto de partida</h3>
                    <p className="vazio">
                      Clique em qualquer mini-hex no mapa. Cada um tem identificação no estilo do mapa geral (ex.: 02.03).
                    </p>
                  </>
                ) : (
                  <>
                    <h3>
                      📍 {atual.label} — {atual.tipo.nome}
                    </h3>
                    {atual.poi ? (
                      <p>◆ <b>{atual.poi}</b></p>
                    ) : (
                      <p className="vazio">Nada de especial à vista… use o oráculo se tiver dúvidas.</p>
                    )}

                    <label className="check-explorado">
                      <input
                        type="checkbox"
                        checked={visitados.has(key(atual))}
                        onChange={() => toggleExplorado(atual)}
                      />
                      <span>Marcar como explorado</span>
                    </label>
                  </>
                )}

                <div className="acoes-hex" style={{ marginTop: 10 }}>
                  {atual && (
                    <button
                      className="btn-oracle"
                      onClick={() =>
                        onRegistrar(
                          `Hex ${coordLabel(hex.col, hex.row)} (${t.nome}) · ${atual.label}: ${atual.tipo.nome}${atual.poi ? ` — ${atual.poi}` : ''}.`
                        )
                      }
                    >
                      ➕ Registrar no diário
                    </button>
                  )}
                  <button
                    className="btn-oracle"
                    onClick={desmarcarTudo}
                    disabled={!temExplorado}
                    title="Limpa todas as marcas de explorado deste hex"
                    style={{ borderColor: '#a04040', color: '#e8b4b4' }}
                  >
                    ✕ Limpar exploração
                  </button>
                </div>

                <h3>Legenda dos mini-hexes</h3>
                <ul className="sub-lista legenda-subs">
                  {subs.map((s) => (
                    <li key={s.label} className={pos && s.q === pos[0] && s.r === pos[1] ? 'atual' : ''}>
                      <label className="check-explorado compacto">
                        <input
                          type="checkbox"
                          checked={visitados.has(key(s))}
                          onChange={() => toggleExplorado(s)}
                        />
                        <span>
                          <b>{s.label}</b> — {s.tipo.nome}
                          {s.poi ? ` · ◆ ${s.poi}` : ''}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="dica-zoom" style={{ marginTop: 6 }}>
                  Explorados: {visitados.size}/{subs.length}
                </p>
              </div>
            )}

            {abaZoom === 'oracle' && (
              <div className="zoom-aba-conteudo zoom-painel-embed">
                <OraclePanel onRegistrar={onRegistrar} />
              </div>
            )}

            {abaZoom === 'dados' && (
              <div className="zoom-aba-conteudo zoom-painel-embed">
                <DicePanel onRegistrar={onRegistrar} />
              </div>
            )}

            {abaZoom === 'diario' && (
              <div className="zoom-aba-conteudo zoom-painel-embed">
                <Diary
                  entradas={entradas}
                  onAdicionar={onRegistrar}
                  onRemover={onRemoverEntrada}
                  onLimpar={onLimparDiario}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
