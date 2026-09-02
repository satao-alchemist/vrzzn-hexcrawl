import { useState } from 'react'

export default function Diary({ entradas, onAdicionar, onRemover, onLimpar }) {
  const [nota, setNota] = useState('')

  const exportar = () => {
    const md = ['# Diário de Aventura — VrzzN Hexcrawl', '']
    for (const e of [...entradas].reverse()) {
      md.push(`## ${new Date(e.data).toLocaleString('pt-BR')}`, '', e.texto, '')
    }
    const blob = new Blob([md.join('\n')], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diario-de-aventura.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="painel">
      <h2>📜 Diário de aventura</h2>
      <div className="diario-add">
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Escreva o que aconteceu… (ou gere resultados no oráculo e envie para cá)"
          rows={3}
        />
        <div className="diario-acoes">
          <button className="btn-oracle principal" onClick={() => { if (nota.trim()) { onAdicionar(nota.trim()); setNota('') } }}>
            ✍️ Adicionar
          </button>
          <button className="btn-oracle" onClick={exportar} disabled={entradas.length === 0}>⬇️ Exportar .md</button>
          <button className="btn-oracle perigo" onClick={() => { if (confirm('Apagar todo o diário?')) onLimpar() }} disabled={entradas.length === 0}>
            🗑️ Limpar
          </button>
        </div>
      </div>
      <div className="diario-lista">
        {entradas.length === 0 && <p className="vazio">Seu diário está vazio. A história começa agora…</p>}
        {entradas.map((e) => (
          <div key={e.id} className="diario-entrada">
            <div className="diario-topo">
              <small>{new Date(e.data).toLocaleString('pt-BR')}</small>
              <button className="btn-mini" onClick={() => onRemover(e.id)}>✕</button>
            </div>
            <p>{e.texto}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
