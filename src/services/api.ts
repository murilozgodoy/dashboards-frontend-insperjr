//aqqui seria o servvico para consumir a api em backend
const API_BASE_URL = 'http://localhost:8000';

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
  }
};