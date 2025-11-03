import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import { apiService } from '../services/api';

import VolumePorBairroChart from './VolumePorBairroChart';
import TicketMedioPorBairroChart from './TicketMedioPorBairroChart';
import EficienciaPorBairroChart from './EficienciaPorBairroChart';
import PedidosPorDistanciaChart from './PedidosPorDistanciaChart';
import ReceitaTicketMedioPorDistanciaChart from './ReceitaTicketMedioPorDistanciaChart';
import PlataformasPorBairroSelector from './PlataformasPorBairroSelector';
import TabelaReceitaDistancia from './TabelaReceitaDistancia';

const GeograficaDashboard: React.FC = () => {
  const [defaultInicio, setDefaultInicio] = useState<string | null>(null);
  const [defaultFim, setDefaultFim] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [volumeData, setVolumeData] = useState<{ bairro: string; volume: number; satisfacao?: number }[]>([]);
  const [ticketMedioData, setTicketMedioData] = useState<{ bairro: string; ticket_medio: number }[]>([]);
  const [eficienciaData, setEficienciaData] = useState<{ bairro: string; eficiencia: number }[]>([]);
  const [receitaDistanciaData, setReceitaDistanciaData] = useState<{ bairro: string; receita: number; distancia_media?: number }[]>([]);
  
  // Estados para análise por distância
  const [pedidosDistanciaData, setPedidosDistanciaData] = useState<{ faixa: string; pedidos: number; satisfacao_media?: number }[]>([]);
  const [receitaTicketDistanciaData, setReceitaTicketDistanciaData] = useState<{ faixa: string; receita: number; ticket_medio?: number }[]>([]);

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
        
        const [volume, ticketMedio, eficiencia, receitaDist, pedidosDist, receitaTicketDist] = await Promise.all([
          apiService.getGeografiaVolumeCompletoPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaTicketMedioPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaEficienciaPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaReceitaDistanciaPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaPedidosCompletoPorDistancia({ inicio, fim }),
          apiService.getGeografiaReceitaTicketPorDistancia({ inicio, fim })
        ]);
        
        if (!mounted) return;
        
        setVolumeData(volume.dados);
        setTicketMedioData(ticketMedio.dados);
        setEficienciaData(eficiencia.dados);
        setReceitaDistanciaData(receitaDist.dados);
        setPedidosDistanciaData(pedidosDist.dados);
        setReceitaTicketDistanciaData(receitaTicketDist.dados);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar análise geográfica');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function onDateRange(e: any) {
      const { inicio, fim } = e.detail || {};
      if (!inicio || !fim) return;
      (async () => {
        try {
          setLoading(true);
          const [volume, ticketMedio, eficiencia, receitaDist, pedidosDist, receitaTicketDist] = await Promise.all([
            apiService.getGeografiaVolumeCompletoPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaTicketMedioPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaEficienciaPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaReceitaDistanciaPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaPedidosCompletoPorDistancia({ inicio, fim }),
            apiService.getGeografiaReceitaTicketPorDistancia({ inicio, fim })
          ]);
          
          setVolumeData(volume.dados);
          setTicketMedioData(ticketMedio.dados);
          setEficienciaData(eficiencia.dados);
          setReceitaDistanciaData(receitaDist.dados);
          setPedidosDistanciaData(pedidosDist.dados);
          setReceitaTicketDistanciaData(receitaTicketDist.dados);
          setError(null);
        } catch (e: any) {
          setError(e?.message || 'Erro ao carregar análise geográfica');
        } finally {
          setLoading(false);
        }
      })();
    }
    window.addEventListener('dateRangeChange', onDateRange as any);
    return () => window.removeEventListener('dateRangeChange', onDateRange as any);
  }, []);

  return (
    <Layout 
      title="Análise Geográfica" 
      subtitle="Performance por região e bairros"
    >
      <DashboardContainer>
        {error && <div style={{ color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 }}>{error}</div>}
        
        <SecaoGraficos>
          <SectionTitle>Análise por Bairro</SectionTitle>
          <GradeGraficosBairro>
            <ContainerGraficoFullWidth>
              <CabecalhoGrafico>
                <TituloGrafico>Volume de Pedidos por Bairro</TituloGrafico>
                <SubtituloGrafico>Bairros com mais pedidos</SubtituloGrafico>
              </CabecalhoGrafico>
              {volumeData.length ? (
                <VolumePorBairroChart data={volumeData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGraficoFullWidth>

            <ContainerGraficoLeft>
              <CabecalhoGrafico>
                <TituloGrafico>Ticket Médio por Bairro</TituloGrafico>
                <SubtituloGrafico>Bairros com maior ticket médio</SubtituloGrafico>
              </CabecalhoGrafico>
              {ticketMedioData.length ? (
                <TicketMedioPorBairroChart data={ticketMedioData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGraficoLeft>

            <ContainerGraficoLeft>
              <CabecalhoGrafico>
                <TituloGrafico>Eficiência por Bairro (Receita/Distância)</TituloGrafico>
                <SubtituloGrafico>Bairros com maior eficiência</SubtituloGrafico>
              </CabecalhoGrafico>
              {eficienciaData.length ? (
                <EficienciaPorBairroChart data={eficienciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGraficoLeft>

            <ContainerGraficoRight>
              <CabecalhoGrafico>
                <TituloGrafico>Tabela Comparativa: Receita e Distância por Bairros</TituloGrafico>
                <SubtituloGrafico>Top 20 bairros com maior receita</SubtituloGrafico>
              </CabecalhoGrafico>
              {receitaDistanciaData.length ? (
                <TabelaReceitaDistancia data={receitaDistanciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGraficoRight>
          </GradeGraficosBairro>
        </SecaoGraficos>

        <SecaoGraficos>
          <SectionTitle>Distribuição de Plataformas por Bairro</SectionTitle>
          <ContainerGrafico>
            <CabecalhoGrafico>
              <TituloGrafico>Plataformas Utilizadas por Bairro</TituloGrafico>
              <SubtituloGrafico>Selecione um bairro para ver a distribuição de plataformas</SubtituloGrafico>
            </CabecalhoGrafico>
            {defaultInicio && defaultFim ? (
              <PlataformasPorBairroSelector inicio={defaultInicio} fim={defaultFim} />
            ) : (
              <PlaceholderGrafico><TextoPlaceholder>Carregando...</TextoPlaceholder></PlaceholderGrafico>
            )}
          </ContainerGrafico>
        </SecaoGraficos>

        <SecaoGraficos>
          <SectionTitle>Análise por Distância</SectionTitle>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Pedidos por Faixa de Distância</TituloGrafico>
                <SubtituloGrafico>Volume de pedidos e satisfação média por faixa de distância</SubtituloGrafico>
              </CabecalhoGrafico>
              {pedidosDistanciaData.length ? (
                <PedidosPorDistanciaChart data={pedidosDistanciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Receita e Ticket Médio por Faixa de Distância</TituloGrafico>
                <SubtituloGrafico>Receita total e ticket médio por faixa de distância</SubtituloGrafico>
              </CabecalhoGrafico>
              {receitaTicketDistanciaData.length ? (
                <ReceitaTicketMedioPorDistanciaChart data={receitaTicketDistanciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>
      </DashboardContainer>
    </Layout>
  );
};

export default GeograficaDashboard;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SecaoGraficos = styled.div`
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

const GradeGraficos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
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

const GradeGraficosBairro = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

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
  min-height: 400px;

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 350px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: 300px;
    border-radius: 12px;
  }
`;

const ContainerGraficoFullWidth = styled(ContainerGrafico)`
  grid-column: 1 / -1;
`;

const ContainerGraficoLeft = styled(ContainerGrafico)`
  grid-column: 1;
`;

const ContainerGraficoRight = styled(ContainerGrafico)`
  grid-column: 2;
  grid-row: 2 / 4;
  
  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: auto;
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
  height: 300px;
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

