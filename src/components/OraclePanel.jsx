import { useState } from 'react'
import { d6, d66, idx18, idx36 } from '../utils/rng'
import {
  EVENTOS, GANCHO_ASSUNTO, GANCHO_ACONTECIMENTO, PALAVRAS, CLIMA,
  NPC_TRACO, NPC_PAPEL, NPC_DESEJO, NPC_INTENCAO, NPC_REACAO, NPC_HUMOR,
} from '../data/oracle'

function Dado({ valor, cor }) {
  return <span className={`dado ${cor}`}>{valor}</span>
}

export default function OraclePanel({ onRegistrar }) {
  const [resultados, setResultados] = useState([])

  const empilhar = (item) => setResultados((r) => [{ id: Date.now() + Math.random(), ...item }, ...r].slice(0, 12))

  const rolarSimNao = () => {
    const resp = d6()
    const ev = d6()
    const resposta = resp <= 3 ? 'NÃO' : 'SIM'
    const evento = resp === ev ? EVENTOS[idx18([resp, ev])] : null
    empilhar({
      tipo: 'Pergunta Sim/Não',
      dados: [<Dado key="a" valor={resp} cor="resposta" />, <Dado key="b" valor={ev} cor="evento" />],
      titulo: resposta,
      texto: evento ? `Dados iguais — EVENTO! ${evento.nome}: ${evento.texto}` : 'Sem evento (dados diferentes).',
      diario: `Oráculo: ${resposta}${evento ? ` — Evento: ${evento.nome}` : ''}`,
    })
  }

  const rolarEvento = () => {
    const d = d66()
    const ev = EVENTOS[idx18(d)]
    empilhar({
      tipo: 'Evento D66',
      dados: [<Dado key="a" valor={d[0]} />, <Dado key="b" valor={d[1]} />],
      titulo: ev.nome,
      texto: ev.texto,
      diario: `Evento: ${ev.nome} — ${ev.texto}`,
    })
  }

  const rolarGancho = () => {
    const d1 = d66()
    const d2 = d66()
    const assunto = GANCHO_ASSUNTO[idx18(d1)]
    const acontecimento = GANCHO_ACONTECIMENTO[idx18(d2)]
    empilhar({
      tipo: 'Gancho de história',
      dados: [<Dado key="a" valor={d1[0]} />, <Dado key="b" valor={d1[1]} />, <Dado key="c" valor={d2[0]} />, <Dado key="d" valor={d2[1]} />],
      titulo: assunto,
      texto: acontecimento,
      diario: `Gancho: ${assunto} — ${acontecimento}`,
    })
  }

  const rolarPalavras = () => {
    const col = d6()
    const colIdx = col <= 2 ? 0 : col <= 4 ? 1 : 2
    const d = d66()
    const palavra = PALAVRAS[colIdx][idx36(d)]
    empilhar({
      tipo: 'Palavra aleatória',
      dados: [<Dado key="c" valor={col} />, <Dado key="a" valor={d[0]} />, <Dado key="b" valor={d[1]} />],
      titulo: palavra,
      texto: `Coluna ${col <= 2 ? '1–2' : col <= 4 ? '3–4' : '5–6'}. Use como inspiração para descrever a cena.`,
      diario: `Palavra: ${palavra}`,
    })
  }

  const rolarClima = () => {
    const d = d66()
    const clima = CLIMA[idx36(d)]
    empilhar({
      tipo: 'Clima D66',
      dados: [<Dado key="a" valor={d[0]} />, <Dado key="b" valor={d[1]} />],
      titulo: clima,
      texto: 'Use para dar atmosfera à cena ou como gancho inicial.',
      diario: `Clima: ${clima}`,
    })
  }

  const rolarNPC = () => {
    const p = (t) => t[idx18(d66())]
    const npc = {
      traco: p(NPC_TRACO), papel: p(NPC_PAPEL), desejo: p(NPC_DESEJO),
      intencao: p(NPC_INTENCAO), reacao: p(NPC_REACAO), humor: p(NPC_HUMOR),
    }
    empilhar({
      tipo: 'NPC',
      dados: [],
      titulo: `${npc.papel} ${npc.traco}`,
      texto: `Deseja: ${npc.desejo} · Intenção: ${npc.intencao} · Reação inicial: ${npc.reacao} · Humor: ${npc.humor}`,
      diario: `NPC: ${npc.papel} ${npc.traco}; deseja ${npc.desejo.toLowerCase()}; quer ${npc.intencao.toLowerCase()}; reação ${npc.reacao.toLowerCase()}; humor: ${npc.humor.toLowerCase()}.`,
    })
  }

  return (
    <div className="painel oracle">
      <h2>🔮 Oráculo VrzzN</h2>
      <p className="regra-resumo">
        Faça uma pergunta de <b>SIM ou NÃO</b> e role 2d6: o dado <span className="tag-resposta">1</span> é a
        resposta (1–3 = Não, 4–6 = Sim) e o dado <span className="tag-evento">2</span> é o evento.
        Resultados iguais disparam um <b>evento</b>.
      </p>
      <div className="oracle-botoes">
        <button className="btn-oracle principal" onClick={rolarSimNao}>❓ Sim ou Não (2d6)</button>
        <button className="btn-oracle" onClick={rolarEvento}>⚡ Evento (D66)</button>
        <button className="btn-oracle" onClick={rolarGancho}>📖 Gancho de história</button>
        <button className="btn-oracle" onClick={rolarPalavras}>💬 Palavra aleatória</button>
        <button className="btn-oracle" onClick={rolarClima}>🌦️ Clima</button>
        <button className="btn-oracle" onClick={rolarNPC}>🧙 Gerar NPC</button>
      </div>
      <div className="oracle-resultados">
        {resultados.length === 0 && <p className="vazio">Role os dados para consultar o oráculo…</p>}
        {resultados.map((r) => (
          <div key={r.id} className="resultado">
            <div className="resultado-topo">
              <span className="resultado-tipo">{r.tipo}</span>
              <span className="resultado-dados">{r.dados}</span>
            </div>
            <strong>{r.titulo}</strong>
            <p>{r.texto}</p>
            <button className="btn-mini" onClick={() => onRegistrar(r.diario)}>➕ Diário</button>
          </div>
        ))}
      </div>
    </div>
  )
}
