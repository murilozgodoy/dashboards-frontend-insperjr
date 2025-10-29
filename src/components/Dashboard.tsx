import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import KPICard from './KPICard';
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiTrendingUp, 
  FiUsers 
} from 'react-icons/fi';

import LineChartReceita from './LineChartReceita';
import DistribuicaoPlataformasChart from './DistribuicaoPlataformasChart';
import ResumoMensal from './ResumoMensal';
import { apiService } from '../services/api';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const Dashboard: React.FC = () => {
  // Será definido dinamicamente a partir do dataset
  const [defaultInicio, setDefaultInicio] = useState<string | null>(null);
  const [defaultFim, setDefaultFim] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<any | null>(null);
  const [serie, setSerie] = useState<{ periodo: string; receita: number; pedidos: number }[]>([]);
  const [plataformas, setPlataformas] = useState<{ nome: string; pedidos?: number; receita?: number; pct: number }[]>([]);
  const [resumo, setResumo] = useState<any | null>(null);

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
        const [k, s, p, r] = await Promise.all([
          apiService.getHomeKpis({ inicio, fim }),
          apiService.getHomeReceitaTempo({ granularidade: 'dia', inicio, fim }),
          apiService.getHomePlataformas({ inicio, fim, metric: 'pedidos' }),
          apiService.getHomeResumoMensal({ mes: monthStr })
        ]);
        if (!mounted) return;
        setKpis(k);
        setSerie(s.dados);
        setPlataformas(p.plataformas);
        setResumo(r);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dashboard');
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
      (async () => {
        try {
          setLoading(true);
          const [k, s, p, r] = await Promise.all([
            apiService.getHomeKpis({ inicio, fim }),
            apiService.getHomeReceitaTempo({ granularidade: granularidade || 'dia', inicio, fim }),
            apiService.getHomePlataformas({ inicio, fim, metric: 'pedidos' }),
            apiService.getHomeResumoMensal({ mes: inicio.slice(0,7) })
          ]);
          setKpis(k);
          setSerie(s.dados);
          setPlataformas(p.plataformas);
          setResumo(r);
          setError(null);
        } catch (e: any) {
          setError(e?.message || 'Erro ao carregar dashboard');
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
        title: 'Receita Total',
        value: currency.format(kpis.receita_total || 0),
        change: { value: Number((kpis.receita_variacao_pct || 0).toFixed(1)), period: 'vs. mês anterior' },
        icon: <FiDollarSign />, color: 'green' as const
      },
      {
        title: 'Pedidos',
        value: (kpis.pedidos_totais || 0).toLocaleString('pt-BR'),
        change: { value: Number((kpis.pedidos_variacao_pct || 0).toFixed(1)), period: 'vs. mês anterior' },
        icon: <FiShoppingCart />, color: 'blue' as const
      },
      {
        title: 'Ticket Médio',
        value: currency.format(kpis.ticket_medio || 0),
        change: { value: Number((kpis.ticket_medio_variacao_pct || 0).toFixed(1)), period: 'vs. mês anterior' },
        icon: <FiTrendingUp />, color: 'orange' as const
      },
      {
        title: 'Satisfação Média',
        value: (kpis.satisfacao_media || 0).toFixed(2).replace('.', ','),
        change: { value: Number(((kpis.satisfacao_taxa_alta || 0) * 100).toFixed(1)), period: 'notas 4-5' },
        icon: <FiUsers />, color: 'purple' as const
      }
    ];
  }, [kpis]);

  return (
    <Layout 
      title="Visão Geral" 
      subtitle="Acompanhe as principais métricas do Kaiserhaus"
    >
      <DashboardContainer>
        {error && <div style={{ color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 }}>{error}</div>}
        <KPISection>
          <SectionTitle>Métricas Principais</SectionTitle>
          <KPIGrid>
            {kpiCards.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </KPIGrid>
        </KPISection>

        <SecaoGraficos>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Receita Temporal</TituloGrafico>
                <SubtituloGrafico>Últimos 30 dias (dez/2024)</SubtituloGrafico>
              </CabecalhoGrafico>
              {serie.length ? <LineChartReceita data={serie} /> : <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Distribuição por Plataforma</TituloGrafico>
                <SubtituloGrafico>% de pedidos por plataforma</SubtituloGrafico>
              </CabecalhoGrafico>
              {plataformas.length ? <DistribuicaoPlataformasChart data={plataformas} mode="pie" /> : <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>}
            </ContainerGrafico>

            <ContainerGrafico>
              <ResumoMensal
                melhorDia={resumo?.melhor_dia_semana}
                horarioPico={resumo?.horario_pico}
                plataformaMaisUsada={resumo?.plataforma_mais_usada}
                bairroTop={resumo?.bairro_top_receita}
                mes={resumo?.mes}
              />
            </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>
      </DashboardContainer>
    </Layout>
  );
};

export default Dashboard;




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

//styled components p graficos
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
