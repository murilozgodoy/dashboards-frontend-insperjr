// Cores padrão do dashboard
export const CHART_COLORS = {
  azul: '#f97316',      // Laranja Normal (antes azul)
  vermelho: '#dc2626',  // Red (mais forte)
  amarelo: '#f59e0b',   // Yellow/Orange
  marrom: '#92400e',    // Brown
} as const;

// Array de cores para uso sequencial em gráficos
export const CHART_COLORS_ARRAY = [
  CHART_COLORS.azul,
  CHART_COLORS.vermelho,
  CHART_COLORS.amarelo,
  CHART_COLORS.marrom,
];

// Função helper para obter cor por índice (cíclico)
export const getChartColor = (index: number): string => {
  return CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length];
};

// Mapeamento específico para alguns casos
export const PERIODO_DIA_COLORS = {
  'Madrugada': CHART_COLORS.marrom,
  'Manhã': CHART_COLORS.azul,
  'Tarde': CHART_COLORS.amarelo,
  'Noite': CHART_COLORS.vermelho,
};

