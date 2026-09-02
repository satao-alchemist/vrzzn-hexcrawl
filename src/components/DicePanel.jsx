import { useState } from 'react'

const DADOS = [
  { id: 'd4', faces: 4, label: 'd4' },
  { id: 'd6', faces: 6, label: 'd6' },
  { id: 'd8', faces: 8, label: 'd8' },
  { id: 'd10', faces: 10, label: 'd10' },
  { id: 'd12', faces: 12, label: 'd12' },
  { id: 'd20', faces: 20, label: 'd20' },
  { id: 'd100', faces: 100, label: 'd100' },
]

function rolar(faces) {
  return 1 + Math.floor(Math.random() * faces)
}

export default function DicePanel({ onRegistrar }) {
  const [qtd, setQtd] = useState(1)
  const [mod, setMod] = useState(0)
  const [historico, setHistorico] = useState([])

  const fazerRolagem = (faces, label) => {
    const n = Math.max(1, Math.min(20, qtd))
    const rolls = Array.from({ length: n }, () => rolar(faces))
    const soma = rolls.reduce((a, b) => a + b, 0) + mod
    const texto = n === 1
      ? `${label}: ${rolls[0]}${mod ? ` ${mod >= 0 ? '+' : ''}${mod} = ${soma}` : ''}`
      : `${n}${label}: [${rolls.join(', ')}]${mod ? ` ${mod >= 0 ? '+' : ''}${mod}` : ''} = ${soma}`
    const item = { id: Date.now() + Math.random(), texto, soma, rolls, label }
    setHistorico((h) => [item, ...h].slice(0, 15))
    if (onRegistrar) onRegistrar(`🎲 Rolagem: ${texto}`)
  }

  return (
    <div className="painel">
      <h2>🎲 Rolagem de Dados</h2>
      <p className="regra-resumo">Role qualquer dado padrão. Ajuste quantidade e modificador.</p>

      <div className="form-grid" style={{ marginBottom: 12 }}>
        <label>
          Quantidade
          <input style={{ marginLeft: 10 }} type="number" min="1" max="20" value={qtd} onChange={(e) => setQtd(+e.target.value || 1)} />
        </label>
      </div>

      <div className="dados-botoes" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {DADOS.map((d) => (
          <button key={d.id} className="btn-oracle" onClick={() => fazerRolagem(d.faces, d.label)}>
            {d.label}
          </button>
        ))}
      </div>

      {historico.length > 0 && (
        <>
          <h3 style={{ marginTop: 16 }}>Histórico</h3>
          <ul className="sub-lista">
            {historico.map((h) => (
              <li key={h.id}><b>{h.texto}</b></li>
            ))}
          </ul>
          <button className="btn-oracle" style={{ marginTop: 8 }} onClick={() => setHistorico([])}>
            Limpar histórico
          </button>
        </>
      )}
    </div>
  )
}
