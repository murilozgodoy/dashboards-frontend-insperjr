import { useState, useEffect } from 'react';
import { apiService, DadosArquivo, RespostaAPI } from '../services/api';

export default function ApiTest() {
  const [dados, setDados] = useState<RespostaAPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  const checkApiStatus = async () => {
    try {
      const status = await apiService.healthCheck();
      setApiStatus(status.message);
    } catch (err) {
      setApiStatus('API não está funcionando');
    }
  };

  //pegar dados da api
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllData();
      setDados(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Teste da API - Dashboards</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Status da API:</h2>
        <p className="text-lg">{apiStatus || 'Verificando...'}</p>
      </div>

      <div className="mb-6">
        <button 
          onClick={fetchData}
          disabled={loading}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Carregando...' : 'Buscar Dados da API'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {dados && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Resumo:</h2>
            <p><strong>Arquivos processados:</strong> {dados.arquivos_processados}</p>
          </div>

          {dados.dados.map((arquivo, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{arquivo.arquivo}</h3>
              <p><strong>Registros:</strong> {arquivo.quantidade_registros}</p>
              <p><strong>Colunas:</strong> {arquivo.colunas.join(', ')}</p>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Primeiros registros:</h4>
                <div className="bg-gray-50 p-3 rounded overflow-x-auto">
                  <pre className="text-sm">
                    {JSON.stringify(arquivo.dados.slice(0, 3), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
