//aqqui seria o servvico para consumir a api em backend
const API_BASE_URL = 'http://localhost:8001';

export interface DadosArquivo {
  arquivo: string;
  quantidade_registros: number;
  colunas: string[];
  dados: any[];
}

export interface RespostaAPI {
  arquivos_processados: number;
  dados: DadosArquivo[];
}

export const apiService = {
  async getAllData(): Promise<RespostaAPI> {
    const response = await fetch(`${API_BASE_URL}/api/dados`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados da API');
    }
    return response.json();
  },

  async getDataByFile(nomeArquivo: string): Promise<DadosArquivo> {
    const response = await fetch(`${API_BASE_URL}/api/dados/${nomeArquivo}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do arquivo');
    }
    return response.json();
  },

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('API não está funcionando');
    }
    return response.json();
  },

  // HOME ENDPOINTS
  async getHomeKpis(params?: { inicio?: string; fim?: string }): Promise<{
    receita_total: number;
    receita_variacao_pct: number;
    pedidos_totais: number;
    pedidos_variacao_pct: number;
    ticket_medio: number;
    ticket_medio_variacao_pct: number;
    satisfacao_media: number;
    satisfacao_taxa_alta: number; // 0-1
    periodo: { inicio: string; fim: string };
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/home/kpis${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar KPIs');
    return response.json();
  },

  async getHomeReceitaTempo(params?: { granularidade?: 'dia'|'semana'|'mes'; inicio?: string; fim?: string }): Promise<{
    granularidade: 'dia'|'semana'|'mes';
    dados: { periodo: string; receita: number; pedidos: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.granularidade) qs.set('granularidade', params.granularidade);
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/home/receita-tempo${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar receita temporal');
    return response.json();
  },

  async getHomePlataformas(params?: { inicio?: string; fim?: string; metric?: 'pedidos'|'receita' }): Promise<{
    metric: 'pedidos'|'receita';
    plataformas: { nome: string; pedidos?: number; receita?: number; pct: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.metric) qs.set('metric', params.metric);
    const response = await fetch(`${API_BASE_URL}/api/home/plataformas${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar plataformas');
    return response.json();
  },

  async getHomeResumoMensal(params?: { mes?: string }): Promise<{
    melhor_dia_semana: string | null;
    horario_pico: string | null;
    plataforma_mais_usada: string | null;
    bairro_top_receita: string | null;
    mes: string;
  }> {
    const qs = new URLSearchParams();
    if (params?.mes) qs.set('mes', params.mes);
    const response = await fetch(`${API_BASE_URL}/api/home/resumo-mensal${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar resumo mensal');
    return response.json();
  },

  async getHomeDateBounds(): Promise<{ min: string | null; max: string | null }> {
    const response = await fetch(`${API_BASE_URL}/api/home/date-bounds`);
    if (!response.ok) throw new Error('Erro ao buscar limites de data');
    return response.json();
  },

  // GEOGRAFIA ENDPOINTS
  async getGeografiaVolumePorBairro(params?: { inicio?: string; fim?: string; top_n?: number }): Promise<{
    dados: { bairro: string; volume: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.top_n) qs.set('top_n', params.top_n.toString());
    const response = await fetch(`${API_BASE_URL}/api/geografica/volume-por-bairro${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar volume por bairro');
    return response.json();
  },

  async getGeografiaReceitaPorBairro(params?: { inicio?: string; fim?: string; top_n?: number }): Promise<{
    dados: { bairro: string; receita: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.top_n) qs.set('top_n', params.top_n.toString());
    const response = await fetch(`${API_BASE_URL}/api/geografica/receita-por-bairro${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar receita por bairro');
    return response.json();
  },

  async getGeografiaTicketMedioPorBairro(params?: { inicio?: string; fim?: string; top_n?: number }): Promise<{
    dados: { bairro: string; ticket_medio: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.top_n) qs.set('top_n', params.top_n.toString());
    const response = await fetch(`${API_BASE_URL}/api/geografica/ticket-medio-por-bairro${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar ticket médio por bairro');
    return response.json();
  },

  async getGeografiaSatisfacaoPorBairro(params?: { inicio?: string; fim?: string; top_n?: number }): Promise<{
    dados: { bairro: string; satisfacao: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.top_n) qs.set('top_n', params.top_n.toString());
    const response = await fetch(`${API_BASE_URL}/api/geografica/satisfacao-por-bairro${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar satisfação por bairro');
    return response.json();
  },

  async getGeografiaDistanciaMediaPorBairro(params?: { inicio?: string; fim?: string; top_n?: number }): Promise<{
    dados: { bairro: string; distancia_media: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.top_n) qs.set('top_n', params.top_n.toString());
    const response = await fetch(`${API_BASE_URL}/api/geografica/distancia-media-por-bairro${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar distância média por bairro');
    return response.json();
  },

  async getGeografiaEficienciaPorBairro(params?: { inicio?: string; fim?: string; top_n?: number }): Promise<{
    dados: { bairro: string; eficiencia: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.top_n) qs.set('top_n', params.top_n.toString());
    const response = await fetch(`${API_BASE_URL}/api/geografica/eficiencia-por-bairro${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar eficiência por bairro');
    return response.json();
  },

  // ANÁLISE POR DISTÂNCIA
  async getGeografiaPedidosPorDistancia(params?: { inicio?: string; fim?: string }): Promise<{
    dados: { faixa: string; pedidos: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/geografica/pedidos-por-distancia${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar pedidos por distância');
    return response.json();
  },

  async getGeografiaSatisfacaoPorDistancia(params?: { inicio?: string; fim?: string }): Promise<{
    dados: { faixa: string; satisfacao: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/geografica/satisfacao-por-distancia${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar satisfação por distância');
    return response.json();
  },

  async getGeografiaValorPorDistancia(params?: { inicio?: string; fim?: string }): Promise<{
    dados: { faixa: string; valor: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/geografica/valor-por-distancia${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar valor por distância');
    return response.json();
  },

  // ANÁLISE DE PLATAFORMAS POR BAIRRO
  async getGeografiaListaBairros(params?: { inicio?: string; fim?: string }): Promise<{
    bairros: { bairro: string; total_pedidos: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/geografica/lista-bairros${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar lista de bairros');
    return response.json();
  },

  async getGeografiaPlataformasPorBairro(bairro: string, params?: { inicio?: string; fim?: string }): Promise<{
    dados: { plataforma: string; pedidos: number; percentual: number }[];
    bairro: string;
    total: number;
  }> {
    const qs = new URLSearchParams();
    qs.set('bairro', bairro);
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/geografica/plataformas-por-bairro${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar plataformas por bairro');
    return response.json();
  },

  // TEMPORAL ENDPOINTS
  async getTemporalPeriodoDia(params?: { inicio?: string; fim?: string }): Promise<{
    data: { periodo: string; quantidade: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/temporal/periodo-dia${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar período do dia');
    return response.json();
  },

  async getTemporalTipoDia(params?: { inicio?: string; fim?: string }): Promise<{
    data: { tipo: string; quantidade: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/temporal/tipo-dia${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar tipo de dia');
    return response.json();
  },

  async getTemporalHeatmapHorario(params?: { inicio?: string; fim?: string }): Promise<{
    data: { dia_semana: string; hora: number; quantidade: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/temporal/heatmap-horario${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar heatmap de horário');
    return response.json();
  },

  async getTemporalEvolucaoPedidos(params?: { inicio?: string; fim?: string; granularidade?: 'dia'|'semana'|'mes' }): Promise<{
    data: { periodo: string; receita: number; pedidos: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.granularidade) qs.set('granularidade', params.granularidade);
    const response = await fetch(`${API_BASE_URL}/api/temporal/evolucao-pedidos${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar evolução de pedidos');
    return response.json();
  },

  async getTemporalHorarioPico(params?: { inicio?: string; fim?: string }): Promise<{
    data: { hora: number; quantidade: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/temporal/horario-pico${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar horário de pico');
    return response.json();
  },

  // OPERACIONAL ENDPOINTS
  async getOperacionalKpis(params?: { inicio?: string; fim?: string; threshold_minutos?: number }): Promise<{
    tempo_preparo_medio: number;
    tempo_entrega_medio: number;
    precisao_eta_pct: number;
    taxa_atraso_pct: number;
    eficiencia_media: number;
    desempenho_eta: number;
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.threshold_minutos !== undefined) qs.set('threshold_minutos', params.threshold_minutos.toString());
    const response = await fetch(`${API_BASE_URL}/api/operacional/kpis${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar KPIs operacionais');
    return response.json();
  },

  async getOperacionalTempoPreparoTempo(params?: { granularidade?: 'dia'|'semana'|'mes'; inicio?: string; fim?: string }): Promise<{
    granularidade: 'dia'|'semana'|'mes';
    dados: { periodo: string; tempo_medio: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.granularidade) qs.set('granularidade', params.granularidade);
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/operacional/tempo-preparo-tempo${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar tempo de preparo temporal');
    return response.json();
  },

  async getOperacionalDistribuicaoTempos(params?: { tipo?: 'preparo'|'entrega'; inicio?: string; fim?: string }): Promise<{
    faixas: { faixa: string; quantidade: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.tipo) qs.set('tipo', params.tipo);
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/operacional/distribuicao-tempos${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar distribuição de tempos');
    return response.json();
  },

  async getOperacionalAtrasos(params?: { threshold_minutos?: number; inicio?: string; fim?: string; limit?: number }): Promise<{
    dados: {
      data: string | null;
      nome_cliente: string;
      eta_minutos: number;
      tempo_real_minutos: number;
      atraso_minutos: number;
      distancia_km: number;
      platform: string;
    }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.threshold_minutos !== undefined) qs.set('threshold_minutos', params.threshold_minutos.toString());
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.limit !== undefined) qs.set('limit', params.limit.toString());
    const response = await fetch(`${API_BASE_URL}/api/operacional/atrasos${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar atrasos');
    return response.json();
  },

  async getOperacionalPrecisaoEtaHora(params?: { inicio?: string; fim?: string }): Promise<{
    dados: { hora: number; precisao_pct: number; total_pedidos: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/operacional/precisao-eta-hora${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar precisão ETA por hora');
    return response.json();
  },

  async getOperacionalAnalisePorPeriodo(params?: { inicio?: string; fim?: string }): Promise<{
    dados: { periodo: string; quantidade: number; tempo_preparo_medio: number; tempo_entrega_medio: number; taxa_atraso_pct: number; precisao_eta_pct: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/operacional/analise-por-periodo${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar análise por período');
    return response.json();
  },

  async getOperacionalEtaVsRealScatter(params?: { inicio?: string; fim?: string; limit?: number }): Promise<{
    pontos: { eta: number; real: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.limit !== undefined) qs.set('limit', params.limit.toString());
    const response = await fetch(`${API_BASE_URL}/api/operacional/eta-vs-real-scatter${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar dados do scatter plot');
    return response.json();
  },

  async getOperacionalTemposPorHora(params?: { inicio?: string; fim?: string }): Promise<{
    dados: { hora: number; tempo_preparo_medio: number; tempo_entrega_medio: number; quantidade: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/operacional/tempos-por-hora${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar tempos por hora');
    return response.json();
  },

  async getOperacionalEstatisticasTempos(params?: { inicio?: string; fim?: string }): Promise<{
    preparo: { min: number; max: number; media: number; p50: number; p75: number; p95: number };
    entrega: { min: number; max: number; media: number; p50: number; p75: number; p95: number };
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/operacional/estatisticas-tempos${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar estatísticas detalhadas');
    return response.json();
  },

  async getOperacionalOutliersDetalhados(params?: { inicio?: string; fim?: string; preparo_min?: number; entrega_min?: number; limit?: number }): Promise<{
    outliers_preparo: any[];
    outliers_entrega: any[];
    resumo: { total_pedidos: number; outliers_preparo_count: number; outliers_entrega_count: number; pct_preparo: number; pct_entrega: number };
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.preparo_min !== undefined) qs.set('preparo_min', params.preparo_min.toString());
    if (params?.entrega_min !== undefined) qs.set('entrega_min', params.entrega_min.toString());
    if (params?.limit !== undefined) qs.set('limit', params.limit.toString());
    const response = await fetch(`${API_BASE_URL}/api/operacional/outliers-detalhados${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar outliers detalhados');
    return response.json();
  },

  // RENTABILIDADE ENDPOINTS
  async getRentabilidadeKpis(params?: { inicio?: string; fim?: string }): Promise<{
    receita_bruta_total: number;
    comissoes_totais: number;
    receita_liquida: number;
    margem_liquida_pct: number;
    receita_liquida_vs_bruta_pct: number;
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/kpis${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar KPIs de rentabilidade');
    return response.json();
  },

  async getRentabilidadeWaterfall(params?: { inicio?: string; fim?: string }): Promise<{
    receita_bruta: number;
    menos_comissao_ifood: number;
    menos_comissao_rappi: number;
    receita_liquida_final: number;
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/waterfall${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar dados do waterfall');
    return response.json();
  },

  async getRentabilidadeMargensPorPlataforma(params?: { inicio?: string; fim?: string }): Promise<{
    plataformas: {
      plataforma: string;
      receita_bruta: number;
      comissao_pct: number;
      comissao_brl: number;
      receita_liquida: number;
      margem_pct: number;
    }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/margens-por-plataforma${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar margens por plataforma');
    return response.json();
  },

  async getRentabilidadeCanaisVsMarketplace(params?: { inicio?: string; fim?: string }): Promise<{
    marketplaces: {
      receita_bruta: number;
      comissao_pct: number;
      comissao_brl: number;
      receita_liquida: number;
      margem_pct: number;
    };
    canais_proprios: {
      receita_bruta: number;
      comissao_brl: number;
      receita_liquida: number;
      margem_pct: number;
    };
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/canais-vs-marketplace${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar comparação canais vs marketplace');
    return response.json();
  },

  async getTemporalSazonalidadeSemanal(params?: { inicio?: string; fim?: string; metric?: 'pedidos' | 'receita' }): Promise<{
    data: { dia_semana: string; valor: number }[];
    metric: string;
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.metric) qs.set('metric', params.metric);
    const response = await fetch(`${API_BASE_URL}/api/temporal/sazonalidade-semanal${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar sazonalidade semanal');
    return response.json();
  },

  async getTemporalComparacaoTendencias(params?: { inicio?: string; fim?: string; granularidade?: 'semana' | 'mes' }): Promise<{
    data: { periodo: string; pedidos: number; receita: number; variacao_pedidos_pct: number; variacao_receita_pct: number }[];
    granularidade: string;
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    if (params?.granularidade) qs.set('granularidade', params.granularidade);
    const response = await fetch(`${API_BASE_URL}/api/temporal/comparacao-tendencias${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar comparação de tendências');
    return response.json();
  },

  async getRentabilidadeSimulacao(params: { pct_canal_proprio: number; inicio?: string; fim?: string }): Promise<{
    economia_comissoes: number;
    aumento_receita_liquida_pct: number;
    receita_bruta_atual: number;
    comissoes_atual: number;
    receita_liquida_atual: number;
    receita_bruta_simulada: number;
    comissoes_simulada: number;
    receita_liquida_simulada: number;
  }> {
    const qs = new URLSearchParams();
    qs.set('pct_canal_proprio', params.pct_canal_proprio.toString());
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/simulacao?${qs}`);
    if (!response.ok) throw new Error('Erro ao buscar simulação');
    return response.json();
  },

  async getTemporalTendenciasDiarias(params?: { inicio?: string; fim?: string }): Promise<{
    data: { dia_semana: string; total_pedidos: number; media_pedidos: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/temporal/tendencias-diarias${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar tendências diárias');
    return response.json();
  },

  async getTemporalPrevistoVsReal(params?: { inicio?: string; fim?: string }): Promise<{
    data: { periodo: string; pedidos_real: number; pedidos_previsto: number }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/temporal/previsto-vs-real${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar previsto vs real');
    return response.json();
  },

  async getRentabilidadePorTipo(params?: { inicio?: string; fim?: string }): Promise<{
    tipos: {
      tipo: string;
      ticket_medio: number;
      receita_bruta: number;
      comissao_brl: number;
      receita_liquida: number;
      margem_pct: number;
    }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/rentabilidade-por-tipo${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar rentabilidade por tipo');
    return response.json();
  },

  async getRentabilidadeEvolucaoTemporal(params?: { granularidade?: 'dia'|'semana'|'mes'; inicio?: string; fim?: string }): Promise<{
    granularidade: 'dia'|'semana'|'mes';
    dados: {
      periodo: string;
      receita_bruta: number;
      comissoes: number;
      receita_liquida: number;
      margem_pct: number;
    }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.granularidade) qs.set('granularidade', params.granularidade);
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/evolucao-temporal${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar evolução temporal da rentabilidade');
    return response.json();
  },

  async getRentabilidadeROIPorPlataforma(params?: { inicio?: string; fim?: string }): Promise<{
    plataformas: {
      plataforma: string;
      investimento: number;
      retorno: number;
      roi_pct: number;
      payback_meses: number;
    }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.inicio) qs.set('inicio', params.inicio);
    if (params?.fim) qs.set('fim', params.fim);
    const response = await fetch(`${API_BASE_URL}/api/rentabilidade/roi-por-plataforma${qs.toString() ? `?${qs}` : ''}`);
    if (!response.ok) throw new Error('Erro ao buscar ROI por plataforma');
    return response.json();
  }
};