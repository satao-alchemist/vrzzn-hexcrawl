import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import fs from 'fs'
import HexMap from '../src/components/HexMap'
import HexZoomModal from '../src/components/HexZoomModal'
import { gerarMundo } from '../src/utils/worldgen'

const mundo = gerarMundo('wyrdlands')

let mapa = renderToStaticMarkup(<HexMap mundo={mundo} selecionado={null} onSelecionar={() => {}} />)
mapa = mapa.match(/<svg.*?<\/svg>/s)[0]
mapa = mapa.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="820" ')
mapa = mapa.replace(
  /<svg([^>]*)>/,
  `<svg$1><style>
    .hex-label { font-size: 9px; font-weight: 700; fill: rgba(0,0,0,0.65); font-family: Georgia, serif; }
    .poi-marcador { font-size: 11px; fill: rgba(60,20,80,0.85); }
  </style>`,
)
fs.writeFileSync('teste-mapa.svg', mapa)

const mont = mundo.hexes.find((h) => h.terreno === 'montanha') || mundo.hexes[0]
const zoom = renderToStaticMarkup(
  <HexZoomModal hex={mont} seed="wyrdlands" onFechar={() => {}} onRegistrar={() => {}} onGerarEncontro={() => {}} />,
)
let zoomSvg = zoom.match(/<svg.*?<\/svg>/s)[0]
zoomSvg = zoomSvg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" ')
zoomSvg = zoomSvg.replace(/<svg([^>]*)>/, `<svg$1><style>.poi-marcador{font-size:16px;fill:#4a1160;}.jogador-token{font-size:26px;}</style>`)
fs.writeFileSync('teste-zoom.svg', zoomSvg)

console.log('OK — montanha em', mont.col, mont.row)
