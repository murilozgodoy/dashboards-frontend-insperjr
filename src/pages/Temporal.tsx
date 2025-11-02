import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { CHART_COLORS } from '../config/colors';
import PeriodoDiaChart from '../components/PeriodoDiaChart';
import TipoDiaChart from '../components/TipoDiaChart';
import HorarioPicoChart from '../components/HorarioPicoChart';
import LineChartReceita from '../components/LineChartReceita';
import SazonalidadeSemanalChart from '../components/SazonalidadeSemanalChart';
import TendenciasDiariasChart from '../components/TendenciasDiariasChart';
import PrevistoVsRealChart from '../components/PrevistoVsRealChart';
import { apiService } from '../services/api';

const Temporal: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para cada gráfico
  const [periodoDia, setPeriodoDia] = useState<{ periodo: string; quantidade: number }[]>([]);
  const [tipoDia, setTipoDia] = useState<{ tipo: string; quantidade: number }[]>([]);
  const [horarioPico, setHorarioPico] = useState<{ hora: number; quantidade: number }[]>([]);
  const [evolucaoPedidos, setEvolucaoPedidos] = useState<{ periodo: string; receita: number; pedidos: number }[]>([]);
  const [sazonalidadeSemanal, setSazonalidadeSemanal] = useState<{ dia_semana: string; valor: number }[]>([]);
  const [sazonalidadeMetric, setSazonalidadeMetric] = useState<'pedidos' | 'receita'>('pedidos');
  const [tendenciasDiarias, setTendenciasDiarias] = useState<{ dia_semana: string; total_pedidos: number; media_pedidos: number }[]>([]);
  const [previstoVsReal, setPrevistoVsReal] = useState<{ periodo: string; pedidos_real: number; pedidos_previsto: number }[]>([]);

  const [defaultInicio, setDefaultInicio] = useState<string | null>(null);
  const [defaultFim, setDefaultFim] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // Descobre o período mais recente do dataset
        const bounds = await apiService.getHomeDateBounds();
        const maxDate = bounds.max || new Date().toISOString().slice(0,10);
        const d = new Date(maxDate + 'T00:00:00');
        const monthStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        const inicio = `${monthStr}-01`;
        const fim = new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().slice(0,10);
        if (mounted) {
          setDefaultInicio(inicio);
          setDefaultFim(fim);
        }
        await fetchTemporalData(inicio, fim);
      } catch (e: any) {
        if (mounted) {
          setError(e?.message || 'Erro ao carregar dados temporais');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Listener para mudanças de data range
  useEffect(() => {
    function onDateRange(e: any) {
      const { inicio, fim, granularidade } = e.detail || {};
      if (!inicio || !fim) return;
      setDefaultInicio(inicio);
      setDefaultFim(fim);
      fetchTemporalData(inicio, fim, granularidade);
    }
    window.addEventListener('dateRangeChange', onDateRange as any);
    return () => window.removeEventListener('dateRangeChange', onDateRange as any);
  }, []);

  const fetchTemporalData = async (inicio: string, fim: string, granularidade: 'dia' | 'semana' | 'mes' = 'dia') => {
    try {
      setLoading(true);
      const [
        periodo,
        tipo,
        pico,
        evolucao,
        sazonalidade,
        tendencias,
        previsto
      ] = await Promise.all([
        apiService.getTemporalPeriodoDia({ inicio, fim }),
        apiService.getTemporalTipoDia({ inicio, fim }),
        apiService.getTemporalHorarioPico({ inicio, fim }),
        apiService.getTemporalEvolucaoPedidos({ inicio, fim, granularidade }),
        apiService.getTemporalSazonalidadeSemanal({ inicio, fim, metric: sazonalidadeMetric }),
        apiService.getTemporalTendenciasDiarias({ inicio, fim }),
        apiService.getTemporalPrevistoVsReal({ inicio, fim })
      ]);

      setPeriodoDia(periodo.data);
      setTipoDia(tipo.data);
      setHorarioPico(pico.data);
      setEvolucaoPedidos(evolucao.data);
      setSazonalidadeSemanal(sazonalidade.data);
      setTendenciasDiarias(tendencias.data);
      setPrevistoVsReal(previsto.data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar dados temporais');
    } finally {
      setLoading(false);
    }
  };

  const handleSazonalidadeMetricChange = async (metric: 'pedidos' | 'receita') => {
    const inicio = defaultInicio || '';
    const fim = defaultFim || '';
    if (!inicio || !fim) return;
    setSazonalidadeMetric(metric);
    try {
      const result = await apiService.getTemporalSazonalidadeSemanal({ 
        inicio, 
        fim, 
        metric 
      });
      setSazonalidadeSemanal(result.data);
    } catch (e: any) {
      console.error('Erro ao alterar métrica:', e);
    }
  };


  if (loading && periodoDia.length === 0) {
    return (
      <Layout title="Análise Temporal" subtitle="Evolução de receita e pedidos">
        <LoadingContainer>
          <p>Carregando dados...</p>
        </LoadingContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Análise Temporal" subtitle="Evolução de receita e pedidos">
        <ErrorContainer>
          <p>Erro: {error}</p>
        </ErrorContainer>
      </Layout>
    );
  }

  return (
    <Layout title="Análise Temporal" subtitle="Evolução de receita e pedidos">
      <TemporalContainer>
        {/* Gráfico de Evolução Temporal */}
        <SectionCard>
          <SectionTitle>Evolução de Pedidos e Receita</SectionTitle>
          <LineChartReceita data={evolucaoPedidos} />
        </SectionCard>

        {/* Primeira linha de gráficos */}
        <GridRow>
          <SectionCard>
            <SectionTitle>Distribuição por Período do Dia</SectionTitle>
            <PeriodoDiaChart data={periodoDia} />
          </SectionCard>

          <SectionCard>
            <SectionTitle>Distribuição por Tipo de Dia</SectionTitle>
            <TipoDiaChart data={tipoDia} />
          </SectionCard>
        </GridRow>

        {/* Segunda linha de gráficos */}
        <GridRow>
          <SectionCard>
            <SectionTitle>Horário de Pico</SectionTitle>
            <HorarioPicoChart data={horarioPico} />
          </SectionCard>

          <SectionCard>
            <SectionTitle>
              Sazonalidade Semanal
              <MetricToggle>
                <ToggleButton 
                  active={sazonalidadeMetric === 'pedidos'} 
                  onClick={() => handleSazonalidadeMetricChange('pedidos')}
                >
                  Pedidos
                </ToggleButton>
                <ToggleButton 
                  active={sazonalidadeMetric === 'receita'} 
                  onClick={() => handleSazonalidadeMetricChange('receita')}
                >
                  Receita
                </ToggleButton>
              </MetricToggle>
            </SectionTitle>
            <SazonalidadeSemanalChart data={sazonalidadeSemanal} metric={sazonalidadeMetric} />
          </SectionCard>
        </GridRow>

        {/* Terceira linha de gráficos */}
        <GridRow>
          <SectionCard>
            <SectionTitle>Análise de Tendências Diárias (Média)</SectionTitle>
            <TendenciasDiariasChart data={tendenciasDiarias} />
          </SectionCard>

          <SectionCard>
            <SectionTitle>Pedidos Previstos vs Reais (Diário)</SectionTitle>
            <PrevistoVsRealChart data={previstoVsReal} />
          </SectionCard>
        </GridRow>
      </TemporalContainer>
    </Layout>
  );
};

export default Temporal;

const TemporalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const GranularityToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: ${props => props.active ? CHART_COLORS.marrom : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#78350f' : '#f1f5f9'};
    border-color: ${props => props.active ? CHART_COLORS.marrom : '#cbd5e1'};
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  text-align: center;
  color: #64748b;
`;

const ErrorContainer = styled.div`
  background: #fee2e2;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #fecaca;
  text-align: center;
  color: #991b1b;
`;
