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
  }
};