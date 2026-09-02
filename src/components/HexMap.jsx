import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { HEX_SIZE, SQRT3, hexCentro, hexPontas, coordLabel } from '../utils/worldgen'
import { TERRENOS } from '../data/terrain'

export default function HexMap({ mundo, selecionado, explorados = [], onSelecionar }) {
  const s = HEX_SIZE
  const largura = s * 1.5 * (mundo.cols - 1) + s * 2 + 20
  const altura = s * SQRT3 * (mundo.rows + 0.5) + 20

  const [view, setView] = useState({ x: 0, y: 0, w: largura, h: altura })
  const drag = useRef(null)
  const svgRef = useRef(null)

  const resetView = useCallback(() => setView({ x: 0, y: 0, w: largura, h: altura }), [largura, altura])

  const zoom = useCallback((fator, cxr, cyr) => {
    setView((v) => {
      const nw = Math.min(largura * 2.5, Math.max(largura / 6, v.w * fator))
      const nh = nw * (altura / largura)
      const fx = cxr != null ? (cxr - v.x) / v.w : 0.5
      const fy = cyr != null ? (cyr - v.y) / v.h : 0.5
      return { x: cxr != null ? cxr - nw * fx : v.x + (v.w - nw) / 2, y: cyr != null ? cyr - nh * fy : v.y + (v.h - nh) / 2, w: nw, h: nh }
    })
  }, [largura, altura])

  const paraSVG = useCallback((ev) => {
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: view.x + ((ev.clientX - rect.left) / rect.width) * view.w,
      y: view.y + ((ev.clientY - rect.top) / rect.height) * view.h,
    }
  }, [view])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const handler = (ev) => {
      ev.preventDefault()
      const rect = el.getBoundingClientRect()
      setView((v) => {
        const px = v.x + ((ev.clientX - rect.left) / rect.width) * v.w
        const py = v.y + ((ev.clientY - rect.top) / rect.height) * v.h
        const fator = ev.deltaY > 0 ? 1.15 : 1 / 1.15
        const nw = Math.min(largura * 2.5, Math.max(largura / 6, v.w * fator))
        const nh = nw * (altura / largura)
        const fx = (px - v.x) / v.w
        const fy = (py - v.y) / v.h
        return { x: px - nw * fx, y: py - nh * fy, w: nw, h: nh }
      })
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [largura, altura])

  const onPointerDown = (ev) => {
    const p = paraSVG(ev)
    drag.current = { px: ev.clientX, py: ev.clientY, vx: view.x, vy: view.y, moved: false, startSVG: p }
  }
  const onPointerMove = (ev) => {
    if (!drag.current) return
    const d = drag.current
    if (Math.abs(ev.clientX - d.px) + Math.abs(ev.clientY - d.py) > 4) d.moved = true
    const rect = svgRef.current.getBoundingClientRect()
    const escala = view.w / rect.width
    setView((v) => ({ ...v, x: d.vx - (ev.clientX - d.px) * escala, y: d.vy - (ev.clientY - d.py) * escala }))
  }
  const onPointerUp = (ev) => {
    const d = drag.current
    drag.current = null
    if (!d || d.moved) return
    const p = paraSVG(ev)
    let melhor = null, melhorDist = Infinity
    for (const h of mundo.hexes) {
      const c = hexCentro(h.col, h.row)
      const dist = (c.x + 10 - p.x) ** 2 + (c.y + 10 - p.y) ** 2
      if (dist < melhorDist) { melhorDist = dist; melhor = h }
    }
    if (melhor && melhorDist < (s * 1.1) ** 2) onSelecionar(melhor)
  }

  const celulas = useMemo(() => mundo.hexes.map((h) => {
    const c = hexCentro(h.col, h.row)
    return { ...h, cx: c.x + 10, cy: c.y + 10 }
  }), [mundo])

  return (
    <div className="hexmap-wrap">
      <div className="hexmap-controles">
        <button onClick={() => zoom(1 / 1.4)} title="Aproximar">＋</button>
        <button onClick={() => zoom(1.4)} title="Afastar">－</button>
        <button onClick={resetView} title="Ver mapa inteiro">⤢</button>
        <span className="dica">Arraste para mover · roda para zoom · clique num hexágono para explorar</span>
      </div>
      <svg
        ref={svgRef}
        className="hexmap"
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => (drag.current = null)}
      >
        <rect x={view.x} y={view.y} width={view.w} height={view.h} fill="#e8ddc4" />
        {celulas.map((h) => {
          const t = TERRENOS[h.terreno]
          const sel = selecionado && selecionado.col === h.col && selecionado.row === h.row
          const explorado = explorados.includes(`${h.col},${h.row}`)
          return (
            <g key={`${h.col}-${h.row}`} className="hex-celula">
              <polygon
                points={hexPontas(h.cx, h.cy, s * 0.98)}
                fill={t.cor}
                stroke={sel ? '#c0392b' : explorado ? '#2c6e49' : t.borda}
                strokeWidth={sel ? 4 : explorado ? 2.5 : 1.5}
              />
              <text
                x={h.cx}
                y={h.cy + s * 0.12}
                textAnchor="middle"
                className="hex-emoji"
                fontSize={s * 0.55}
                style={{ pointerEvents: 'none' }}
              >
                {t.emoji}
              </text>
              {h.poi && (
                <text x={h.cx} y={h.cy + s * 0.62} textAnchor="middle" className="poi-marcador">◆</text>
              )}
              {explorado && !sel && (
                <text x={h.cx + s * 0.48} y={h.cy - s * 0.35} textAnchor="middle" className="hex-explorado" fontSize={s * 0.28}>✓</text>
              )}
              <text x={h.cx} y={h.cy - s * 0.55} textAnchor="middle" className="hex-label">
                {coordLabel(h.col, h.row)}
              </text>
              {sel && (
                <polygon points={hexPontas(h.cx, h.cy, s * 1.06)} fill="none" stroke="#c0392b" strokeWidth={2.5} strokeDasharray="6 4" className="hex-sel-anim" />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
