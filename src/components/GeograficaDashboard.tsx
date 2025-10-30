import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import { apiService } from '../services/api';

import VolumePorBairroChart from './VolumePorBairroChart';
import ReceitaPorBairroChart from './ReceitaPorBairroChart';
import TicketMedioPorBairroChart from './TicketMedioPorBairroChart';
import SatisfacaoPorBairroChart from './SatisfacaoPorBairroChart';
import DistanciaMediaPorBairroChart from './DistanciaMediaPorBairroChart';
import EficienciaPorBairroChart from './EficienciaPorBairroChart';
import PedidosPorDistanciaChart from './PedidosPorDistanciaChart';
import SatisfacaoPorDistanciaChart from './SatisfacaoPorDistanciaChart';
import ValorPorDistanciaChart from './ValorPorDistanciaChart';
import PlataformasPorBairroSelector from './PlataformasPorBairroSelector';

const GeograficaDashboard: React.FC = () => {
  const [defaultInicio, setDefaultInicio] = useState<string | null>(null);
  const [defaultFim, setDefaultFim] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [volumeData, setVolumeData] = useState<{ bairro: string; volume: number }[]>([]);
  const [receitaData, setReceitaData] = useState<{ bairro: string; receita: number }[]>([]);
  const [ticketMedioData, setTicketMedioData] = useState<{ bairro: string; ticket_medio: number }[]>([]);
  const [satisfacaoData, setSatisfacaoData] = useState<{ bairro: string; satisfacao: number }[]>([]);
  const [distanciaData, setDistanciaData] = useState<{ bairro: string; distancia_media: number }[]>([]);
  const [eficienciaData, setEficienciaData] = useState<{ bairro: string; eficiencia: number }[]>([]);
  
  // Estados para análise por distância
  const [pedidosDistanciaData, setPedidosDistanciaData] = useState<{ faixa: string; pedidos: number }[]>([]);
  const [satisfacaoDistanciaData, setSatisfacaoDistanciaData] = useState<{ faixa: string; satisfacao: number }[]>([]);
  const [valorDistanciaData, setValorDistanciaData] = useState<{ faixa: string; valor: number }[]>([]);

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
        
        const [volume, receita, ticketMedio, satisfacao, distancia, eficiencia, pedidosDist, satisfacaoDist, valorDist] = await Promise.all([
          apiService.getGeografiaVolumePorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaReceitaPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaTicketMedioPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaSatisfacaoPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaDistanciaMediaPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaEficienciaPorBairro({ inicio, fim, top_n: 20 }),
          apiService.getGeografiaPedidosPorDistancia({ inicio, fim }),
          apiService.getGeografiaSatisfacaoPorDistancia({ inicio, fim }),
          apiService.getGeografiaValorPorDistancia({ inicio, fim })
        ]);
        
        if (!mounted) return;
        
        setVolumeData(volume.dados);
        setReceitaData(receita.dados);
        setTicketMedioData(ticketMedio.dados);
        setSatisfacaoData(satisfacao.dados);
        setDistanciaData(distancia.dados);
        setEficienciaData(eficiencia.dados);
        setPedidosDistanciaData(pedidosDist.dados);
        setSatisfacaoDistanciaData(satisfacaoDist.dados);
        setValorDistanciaData(valorDist.dados);
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
          const [volume, receita, ticketMedio, satisfacao, distancia, eficiencia, pedidosDist, satisfacaoDist, valorDist] = await Promise.all([
            apiService.getGeografiaVolumePorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaReceitaPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaTicketMedioPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaSatisfacaoPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaDistanciaMediaPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaEficienciaPorBairro({ inicio, fim, top_n: 20 }),
            apiService.getGeografiaPedidosPorDistancia({ inicio, fim }),
            apiService.getGeografiaSatisfacaoPorDistancia({ inicio, fim }),
            apiService.getGeografiaValorPorDistancia({ inicio, fim })
          ]);
          
          setVolumeData(volume.dados);
          setReceitaData(receita.dados);
          setTicketMedioData(ticketMedio.dados);
          setSatisfacaoData(satisfacao.dados);
          setDistanciaData(distancia.dados);
          setEficienciaData(eficiencia.dados);
          setPedidosDistanciaData(pedidosDist.dados);
          setSatisfacaoDistanciaData(satisfacaoDist.dados);
          setValorDistanciaData(valorDist.dados);
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
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Volume de Pedidos por Bairro</TituloGrafico>
                <SubtituloGrafico>Top 20 bairros com mais pedidos</SubtituloGrafico>
              </CabecalhoGrafico>
              {volumeData.length ? (
                <VolumePorBairroChart data={volumeData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Receita por Bairro</TituloGrafico>
                <SubtituloGrafico>Top 20 bairros com maior receita</SubtituloGrafico>
              </CabecalhoGrafico>
              {receitaData.length ? (
                <ReceitaPorBairroChart data={receitaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Ticket Médio por Bairro</TituloGrafico>
                <SubtituloGrafico>Top 20 bairros com maior ticket médio</SubtituloGrafico>
              </CabecalhoGrafico>
              {ticketMedioData.length ? (
                <TicketMedioPorBairroChart data={ticketMedioData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Satisfação por Bairro</TituloGrafico>
                <SubtituloGrafico>Top 20 bairros com maior satisfação</SubtituloGrafico>
              </CabecalhoGrafico>
              {satisfacaoData.length ? (
                <SatisfacaoPorBairroChart data={satisfacaoData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Distância Média por Bairro</TituloGrafico>
                <SubtituloGrafico>Top 20 bairros com maior distância</SubtituloGrafico>
              </CabecalhoGrafico>
              {distanciaData.length ? (
                <DistanciaMediaPorBairroChart data={distanciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Eficiência por Bairro (Receita/Distância)</TituloGrafico>
                <SubtituloGrafico>Top 20 bairros com maior eficiência</SubtituloGrafico>
              </CabecalhoGrafico>
              {eficienciaData.length ? (
                <EficienciaPorBairroChart data={eficienciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>
          </GradeGraficos>
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
                <SubtituloGrafico>Volume de pedidos por faixa de distância</SubtituloGrafico>
              </CabecalhoGrafico>
              {pedidosDistanciaData.length ? (
                <PedidosPorDistanciaChart data={pedidosDistanciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Satisfação por Distância</TituloGrafico>
                <SubtituloGrafico>Satisfação média por faixa de distância</SubtituloGrafico>
              </CabecalhoGrafico>
              {satisfacaoDistanciaData.length ? (
                <SatisfacaoPorDistanciaChart data={satisfacaoDistanciaData} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Receita por Distância</TituloGrafico>
                <SubtituloGrafico>Valor total por faixa de distância</SubtituloGrafico>
              </CabecalhoGrafico>
              {valorDistanciaData.length ? (
                <ValorPorDistanciaChart data={valorDistanciaData} />
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

