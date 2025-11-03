import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import KPICard from './KPICard';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown,
  FiPercent
} from 'react-icons/fi';

import WaterfallChart from './WaterfallChart';
import MargensPorPlataformaChart from './MargensPorPlataformaChart';
import RentabilidadeCanaisChart from './RentabilidadeCanaisChart';
import SimulacaoMix from './SimulacaoMix';
import RentabilidadePorTipoChart from './RentabilidadePorTipoChart';
import EvolucaoTemporalRentabilidadeChart from './EvolucaoTemporalRentabilidadeChart';
import ROIPorPlataformaChart from './ROIPorPlataformaChart';
import { apiService } from '../services/api';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const RentabilidadeDashboard: React.FC = () => {
  const [defaultInicio, setDefaultInicio] = useState<string | null>(null);
  const [defaultFim, setDefaultFim] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [granularidadeAtual, setGranularidadeAtual] = useState<'dia' | 'semana' | 'mes'>('mes');
  const [kpis, setKpis] = useState<any | null>(null);
  const [waterfall, setWaterfall] = useState<any | null>(null);
  const [margens, setMargens] = useState<any[]>([]);
  const [canais, setCanais] = useState<any | null>(null);
  const [tipos, setTipos] = useState<any[]>([]);
  const [evolucao, setEvolucao] = useState<any[]>([]);
  const [roi, setRoi] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // Descobre o mês mais recente do dataset
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
        
        const [k, w, m, c, t, e, r] = await Promise.all([
          apiService.getRentabilidadeKpis({ inicio, fim }),
          apiService.getRentabilidadeWaterfall({ inicio, fim }),
          apiService.getRentabilidadeMargensPorPlataforma({ inicio, fim }),
          apiService.getRentabilidadeCanaisVsMarketplace({ inicio, fim }),
          apiService.getRentabilidadePorTipo({ inicio, fim }),
            apiService.getRentabilidadeEvolucaoTemporal({ granularidade: 'dia', inicio, fim }),
          apiService.getRentabilidadeROIPorPlataforma({ inicio, fim })
        ]);
        
        if (!mounted) return;
        setKpis(k);
        setWaterfall(w);
        setMargens(m.plataformas);
        setCanais(c);
        setTipos(t.tipos);
        setEvolucao(e.dados);
        setRoi(r.plataformas);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dashboard de rentabilidade');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function onDateRange(e: any) {
      const { inicio, fim, granularidade } = e.detail || {};
      if (!inicio || !fim) return;
      const gran = (granularidade === 'dia' || granularidade === 'mes') ? granularidade : 'mes';
      setGranularidadeAtual(gran);
      (async () => {
        try {
          setLoading(true);
          const [k, w, m, c, t, e, r] = await Promise.all([
            apiService.getRentabilidadeKpis({ inicio, fim }),
            apiService.getRentabilidadeWaterfall({ inicio, fim }),
            apiService.getRentabilidadeMargensPorPlataforma({ inicio, fim }),
            apiService.getRentabilidadeCanaisVsMarketplace({ inicio, fim }),
            apiService.getRentabilidadePorTipo({ inicio, fim }),
            apiService.getRentabilidadeEvolucaoTemporal({ granularidade: gran, inicio, fim }),
            apiService.getRentabilidadeROIPorPlataforma({ inicio, fim })
          ]);
          setKpis(k);
          setWaterfall(w);
          setMargens(m.plataformas);
          setCanais(c);
          setTipos(t.tipos);
          setEvolucao(e.dados);
          setRoi(r.plataformas);
          
          // Atualizar datas para o SimulacaoMix
          setDefaultInicio(inicio);
          setDefaultFim(fim);
          setError(null);
        } catch (e: any) {
          setError(e?.message || 'Erro ao carregar dashboard de rentabilidade');
        } finally {
          setLoading(false);
        }
      })();
    }
    window.addEventListener('dateRangeChange', onDateRange as any);
    return () => window.removeEventListener('dateRangeChange', onDateRange as any);
  }, []);

  const kpiCards = useMemo(() => {
    if (!kpis) return [] as any[];
    return [
      {
        title: 'Receita Bruta Total',
        value: currency.format(kpis.receita_bruta_total || 0),
        icon: <FiDollarSign />, 
        color: 'green' as const
      },
      {
        title: 'Comissões Totais Pagas',
        value: currency.format(kpis.comissoes_totais || 0),
        icon: <FiTrendingDown />, 
        color: 'red' as const
      },
      {
        title: 'Receita Líquida',
        value: currency.format(kpis.receita_liquida || 0),
        icon: <FiDollarSign />, 
        color: 'green' as const
      },
      {
        title: 'Margem Líquida',
        value: `${(kpis.margem_liquida_pct || 0).toFixed(2)}%`,
        icon: <FiPercent />, 
        color: 'orange' as const
      }
    ];
  }, [kpis]);

  return (
    <Layout 
      title="Rentabilidade" 
      subtitle="Comissões, margens e receita líquida"
    >
      <DashboardContainer>
        {error && <div style={{ color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 }}>{error}</div>}
        
        <KPISection>
          <SectionTitle>KPIs Financeiros</SectionTitle>
          <KPIGrid>
            {kpiCards.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </KPIGrid>
        </KPISection>

        <SecaoGraficos>
          {/* 1ª Linha: Evolução da Rentabilidade ao Longo do Tempo (linha inteira) */}
          <ContainerGrafico>
            <CabecalhoGrafico>
              <TituloGrafico>Evolução da Rentabilidade ao Longo do Tempo</TituloGrafico>
              <SubtituloGrafico>Receita bruta, comissões, receita líquida e margem % mensal</SubtituloGrafico>
            </CabecalhoGrafico>
            {evolucao.length ? (
              <EvolucaoTemporalRentabilidadeChart 
                data={evolucao} 
                granularidade={granularidadeAtual || 'mes'} 
              />
            ) : (
              <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
            )}
          </ContainerGrafico>

          {/* 2ª Linha: Canais Próprios vs Marketplaces, Simulação e ROI */}
          <GradeGraficosLinha2>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Rentabilidade: Canais Próprios vs Marketplaces</TituloGrafico>
                <SubtituloGrafico>Comparação detalhada de margens e receitas</SubtituloGrafico>
              </CabecalhoGrafico>
              {canais ? <RentabilidadeCanaisChart data={canais} /> : <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>}
            </ContainerGrafico>

            <ContainerGrafico style={{ minHeight: 'auto' }}>
              <CabecalhoGrafico>
                <TituloGrafico>Simulação: Impacto de Mudança</TituloGrafico>
                <SubtituloGrafico>Se X% dos pedidos fossem via canal próprio</SubtituloGrafico>
              </CabecalhoGrafico>
              {defaultInicio && defaultFim ? (
                <SimulacaoMix inicio={defaultInicio} fim={defaultFim} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>ROI por Plataforma</TituloGrafico>
                <SubtituloGrafico>Investimento (comissão) vs Retorno (receita líquida)</SubtituloGrafico>
              </CabecalhoGrafico>
              {roi.length ? <ROIPorPlataformaChart data={roi} /> : <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>}
            </ContainerGrafico>
          </GradeGraficosLinha2>

          {/* 3ª Linha: Rentabilidade por Tipo, Impacto das Comissões e Margens */}
          <GradeGraficosLinha3>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Rentabilidade por Tipo de Pedido</TituloGrafico>
                <SubtituloGrafico>Família, Combo, Prato único: Receita e margem</SubtituloGrafico>
              </CabecalhoGrafico>
              {tipos.length ? <RentabilidadePorTipoChart data={tipos} /> : <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Impacto das Comissões na Receita</TituloGrafico>
                <SubtituloGrafico>Receita bruta → Comissões → Receita líquida</SubtituloGrafico>
              </CabecalhoGrafico>
              {waterfall ? <WaterfallChart data={waterfall} /> : <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>}
            </ContainerGrafico>

            <ContainerGrafico>
            <CabecalhoGrafico>
              <TituloGrafico>Margens por Plataforma</TituloGrafico>
              <SubtituloGrafico>Margem % por plataforma</SubtituloGrafico>
            </CabecalhoGrafico>
              {margens.length ? <MargensPorPlataformaChart data={margens} /> : <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>}
            </ContainerGrafico>
          </GradeGraficosLinha3>
        </SecaoGraficos>
      </DashboardContainer>
    </Layout>
  );
};

export default RentabilidadeDashboard;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const KPISection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SecaoGraficos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GradeGraficos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const GradeGraficosLinha2 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const GradeGraficosLinha3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ContainerGrafico = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  min-height: 300px;

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 250px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: 200px;
    border-radius: 12px;
  }
`;

const CabecalhoGrafico = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
`;

const TituloGrafico = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const SubtituloGrafico = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
`;

const PlaceholderGrafico = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f8fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
`;

const TextoPlaceholder = styled.p`
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
`;

