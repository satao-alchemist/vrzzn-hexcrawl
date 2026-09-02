export const TERRENOS = {
  agua:      { nome: 'Água',      cor: '#5da5da', borda: '#3d7fb5', emoji: '🌊' },
  planicie:  { nome: 'Planície',  cor: '#93c267', borda: '#6d9c48', emoji: '🌾' },
  floresta:  { nome: 'Floresta',  cor: '#63a34e', borda: '#477a36', emoji: '🌲' },
  colina:    { nome: 'Colinas',   cor: '#d9c05e', borda: '#ab9350', emoji: '⛰️' },
  montanha:  { nome: 'Montanhas', cor: '#b0894f', borda: '#7d6136', emoji: '🏔️' },
  deserto:   { nome: 'Deserto',   cor: '#f0c98c', borda: '#c69a5e', emoji: '🏜️' },
  pantano:   { nome: 'Pântano',   cor: '#a4c4ae', borda: '#6f9480', emoji: '🌿' },
  cidade:    { nome: 'Cidade',    cor: '#c9a27a', borda: '#8b6914', emoji: '🏛️' },
}

export const POIS = {
  planicie: [
    'Fazenda isolada', 'Círculo de pedras antigas', 'Estrada empoeirada com marcos gastos',
    'Torre de vigia em ruínas', 'Acampamento de caravanas', 'Poço abandonado',
    'Campo de batalha antigo', 'Marco de fronteira rachado',
  ],
  floresta: [
    'Clareira com cogumelos gigantes', 'Árvore colossal oca', 'Ruínas élficas tomadas por raízes',
    'Cabana de eremita', 'Covil de feras', 'Riacho de águas cristalinas',
    'Altar coberto de musgo', 'Armadilhas de caçadores',
  ],
  colina: [
    'Túmulo de antigo rei', 'Pedreira abandonada', 'Vila de pastores',
    'Forte de bandidos', 'Mirante natural', 'Campos de pedras rolantes',
    'Entrada de caverna rasa', 'Moinho solitário',
  ],
  montanha: [
    'Mina anã abandonada', 'Ninho de grifos', 'Passagem estreita entre picos',
    'Mosteiro no alto do penhasco', 'Caverna profunda', 'Monólito com runas',
    'Ponte de pedra sobre abismo', 'Acampamento de escaladores',
  ],
  deserto: [
    'Oásis cercado de palmeiras', 'Ruínas semienterradas na areia', 'Caravana perdida',
    'Poço seco com ossos ao redor', 'Templo do sol esquecido', 'Navio encalhado no mar de dunas',
    'Acampamento nômade', 'Obelisco rachado',
  ],
  pantano: [
    'Cabana de bruxa sobre palafitas', 'Círculo de árvores mortas', 'Barco afundado pela metade',
    'Ruína afogada', 'Ninho de criaturas lamacentas', 'Trilha de pedras instáveis',
    'Fonte de vapores estranhos', 'Cemitério alagado',
  ],
  agua: [
    'Ilhota com palmeiras', 'Navio afundado visível na maré baixa', 'Redemoinho constante',
    'Banco de névoa parado', 'Destroços flutuantes', 'Recife traiçoeiro',
  ],
  cidade: [
    'Praça com Mural de Avisos', 'Taverna', 'Estalagem', 'Guarda',
    'Alquimia', 'Ferreiro', 'Mercado Mantimentos', 'Feiras',
    'Fazendas', 'Castelo do Governante',
  ],
}

export const SUB_TERRENOS = {
  montanha: [
    { nome: 'Pico nevado', cor: '#cfd6dd', borda: '#8a929c' },
    { nome: 'Encosta rochosa', cor: '#a98a55', borda: '#7d6136' },
    { nome: 'Desfiladeiro', cor: '#8d6f42', borda: '#5f4c2c' },
    { nome: 'Caverna', cor: '#5c4f3d', borda: '#3e3529' },
    { nome: 'Vale escondido', cor: '#7fae5c', borda: '#5c8440' },
    { nome: 'Ruína antiga', cor: '#9c968b', borda: '#6e695f' },
  ],
  floresta: [
    { nome: 'Bosque denso', cor: '#4d8a3e', borda: '#356028' },
    { nome: 'Clareira', cor: '#a7cc77', borda: '#7ba053' },
    { nome: 'Bosque antigo', cor: '#3f7434', borda: '#2a5223' },
    { nome: 'Riacho', cor: '#6fb3de', borda: '#4a86ad' },
    { nome: 'Covil', cor: '#7a6b52', borda: '#554a37' },
    { nome: 'Ruína tomada', cor: '#8f9b7a', borda: '#5f6b4e' },
  ],
  planicie: [
    { nome: 'Campo aberto', cor: '#9cc96f', borda: '#74a14e' },
    { nome: 'Plantação', cor: '#c9c96a', borda: '#9c9c48' },
    { nome: 'Estrada', cor: '#c9b18a', borda: '#96794f' },
    { nome: 'Bosquete', cor: '#6fae54', borda: '#4f833b' },
    { nome: 'Riacho', cor: '#6fb3de', borda: '#4a86ad' },
    { nome: 'Ruína antiga', cor: '#9c968b', borda: '#6e695f' },
  ],
  colina: [
    { nome: 'Alto da colina', cor: '#d9c05e', borda: '#ab9350' },
    { nome: 'Encosta gramada', cor: '#b3b963', borda: '#87904a' },
    { nome: 'Pedregulhos', cor: '#b0a488', borda: '#7d735c' },
    { nome: 'Caverna rasa', cor: '#5c4f3d', borda: '#3e3529' },
    { nome: 'Vale fértil', cor: '#8fbd63', borda: '#679345' },
    { nome: 'Ruína antiga', cor: '#9c968b', borda: '#6e695f' },
  ],
  deserto: [
    { nome: 'Dunas altas', cor: '#f2d096', borda: '#c69a5e' },
    { nome: 'Planalto rochoso', cor: '#c99f6a', borda: '#966f42' },
    { nome: 'Oásis', cor: '#79b76a', borda: '#528a45' },
    { nome: 'Mar de areia', cor: '#f5dca9', borda: '#c69a5e' },
    { nome: 'Cânion seco', cor: '#b5895a', borda: '#7d5c37' },
    { nome: 'Ruína semienterrada', cor: '#b3a58e', borda: '#7d715c' },
  ],
  pantano: [
    { nome: 'Água parada', cor: '#5f8f9e', borda: '#3f6470' },
    { nome: 'Lamaçal', cor: '#7d8f6a', borda: '#566345' },
    { nome: 'Juncal', cor: '#a4c4ae', borda: '#6f9480' },
    { nome: 'Ilhota firme', cor: '#93b377', borda: '#668553' },
    { nome: 'Árvores mortas', cor: '#8a8272', borda: '#5f594c' },
    { nome: 'Ruína afogada', cor: '#8f9b8a', borda: '#5f6b5a' },
  ],
  agua: [
    { nome: 'Águas profundas', cor: '#3f7fb5', borda: '#2d5c86' },
    { nome: 'Águas rasas', cor: '#7fbde0', borda: '#5a92b5' },
    { nome: 'Recife', cor: '#8fae8a', borda: '#5f7d5a' },
    { nome: 'Ilhota', cor: '#c9bd8a', borda: '#968a5c' },
    { nome: 'Redemoinho', cor: '#4d8fc5', borda: '#356692' },
    { nome: 'Névoa', cor: '#c4cdd4', borda: '#8a959e' },
  ],
  cidade: [
    { nome: 'Praça com Mural de Avisos', cor: '#d4b896', borda: '#a07840' },
    { nome: 'Taverna', cor: '#c9a27a', borda: '#8b6914' },
    { nome: 'Estalagem', cor: '#c4a882', borda: '#8a6a40' },
    { nome: 'Guarda', cor: '#8a9aaa', borda: '#5a6a7a' },
    { nome: 'Alquimia', cor: '#9a80b0', borda: '#6a5080' },
    { nome: 'Ferreiro', cor: '#b0894f', borda: '#7d6136' },
    { nome: 'Mercado Mantimentos', cor: '#e8c87a', borda: '#b89a40' },
    { nome: 'Feiras', cor: '#e0b86a', borda: '#a88840' },
    { nome: 'Fazendas', cor: '#93c267', borda: '#6d9c48' },
    { nome: 'Castelo do Governante', cor: '#b0a0c8', borda: '#7a6a98' },
  ],
}

export const LOCAIS_CIDADE_OBRIGATORIOS = [
  { nome: 'Praça com Mural de Avisos', cor: '#d4b896', borda: '#a07840' },
  { nome: 'Taverna', cor: '#c9a27a', borda: '#8b6914' },
  { nome: 'Estalagem', cor: '#c4a882', borda: '#8a6a40' },
  { nome: 'Guarda', cor: '#8a9aaa', borda: '#5a6a7a' },
  { nome: 'Alquimia', cor: '#9a80b0', borda: '#6a5080' },
  { nome: 'Ferreiro', cor: '#b0894f', borda: '#7d6136' },
  { nome: 'Mercado Mantimentos', cor: '#e8c87a', borda: '#b89a40' },
  { nome: 'Feiras', cor: '#e0b86a', borda: '#a88840' },
  { nome: 'Fazendas', cor: '#93c267', borda: '#6d9c48' },
  { nome: 'Castelo do Governante', cor: '#b0a0c8', borda: '#7a6a98' },
]

export const LOCAIS_CIDADE_EXTRA = [
  { nome: 'Templo', cor: '#b8a8d0', borda: '#8878a8' },
  { nome: 'Guilda de Aventureiros', cor: '#a0b8c8', borda: '#6a8898' },
  { nome: 'Biblioteca', cor: '#c8b8a0', borda: '#988868' },
  { nome: 'Portão da Cidade', cor: '#a89888', borda: '#786858' },
  { nome: 'Beco dos Artesãos', cor: '#c0a890', borda: '#907860' },
  { nome: 'Cemitério', cor: '#8a9088', borda: '#5a6058' },
  { nome: 'Doca / Cais', cor: '#6fa0b8', borda: '#4a7088' },
  { nome: 'Jardins Públicos', cor: '#7cb86a', borda: '#508848' },
  { nome: 'Casa de Banho', cor: '#80b0b8', borda: '#508088' },
  { nome: 'Teatro de Rua', cor: '#d0a070', borda: '#a07040' },
  { nome: 'Moinho', cor: '#b8a888', borda: '#887858' },
  { nome: 'Estábulos', cor: '#a89070', borda: '#786040' },
]