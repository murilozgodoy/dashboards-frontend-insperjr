import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import KPICard from './KPICard';
import { apiService } from '../services/api';
import { 
  FiClock, 
  FiCheckCircle, 
  FiTrendingUp,
  FiAlertCircle
} from 'react-icons/fi';

import TempoPreparoTempoChart from './TempoPreparoTempoChart';
import EtaVsRealScatterChart from './EtaVsRealScatterChart';
import DistribuicaoTemposChart from './DistribuicaoTemposChart';
import PrecisaoEtaHoraChart from './PrecisaoEtaHoraChart';
import TemposPorHoraChart from './TemposPorHoraChart';
import EstatisticasDetalhadasCard from './EstatisticasDetalhadasCard';
import AnalisePorPeriodoChart from './AnalisePorPeriodoChart';

const OperacionalDashboard: React.FC = () => {
  const [defaultInicio, setDefaultInicio] = useState<string | null>(null);
  const [defaultFim, setDefaultFim] = useState<string | null>(null);
  const [thresholdAtraso, setThresholdAtraso] = useState<number>(10);
  const [thresholdInput, setThresholdInput] = useState<string>('10');

  const [error, setError] = useState<string | null>(null);
  
  const [kpis, setKpis] = useState<any | null>(null);
  const [tempoPreparoTempo, setTempoPreparoTempo] = useState<{ periodo: string; tempo_medio: number }[]>([]);
  const [etaVsRealScatter, setEtaVsRealScatter] = useState<{ eta: number; real: number }[]>([]);
  const [distribuicaoPreparo, setDistribuicaoPreparo] = useState<{ faixa: string; quantidade: number }[]>([]);
  const [distribuicaoEntrega, setDistribuicaoEntrega] = useState<{ faixa: string; quantidade: number }[]>([]);
  const [precisaoEtaHora, setPrecisaoEtaHora] = useState<{ hora: number; precisao_pct: number; total_pedidos: number }[]>([]);
  const [analisePorPeriodo, setAnalisePorPeriodo] = useState<{ periodo: string; quantidade: number; tempo_preparo_medio: number; tempo_entrega_medio: number; taxa_atraso_pct: number; precisao_eta_pct: number }[]>([]);
  const [temposPorHora, setTemposPorHora] = useState<{ hora: number; tempo_preparo_medio: number; tempo_entrega_medio: number; quantidade: number }[]>([]);
  const [estatisticasTempos, setEstatisticasTempos] = useState<{ preparo: any; entrega: any } | null>(null);
  const [outliersDetalhados, setOutliersDetalhados] = useState<any | null>(null);
  const [atrasos, setAtrasos] = useState<any[]>([]);
  const [mostrarTodosPreparo, setMostrarTodosPreparo] = useState(false);
  const [mostrarTodosEntrega, setMostrarTodosEntrega] = useState(false);
  const [mostrarTodosAtrasos, setMostrarTodosAtrasos] = useState(false);
  const LIMITE_INICIAL = 10;

  const loadData = async (inicio: string, fim: string, threshold?: number) => {
    const thresholdToUse = threshold !== undefined ? threshold : thresholdAtraso;
    try {
      const [
        kpisData,
        tempoPreparo,
        etaRealScatter,
        distPreparo,
        distEntrega,
        precisaoHora,
        temposHora,
        analisePeriodo,
        estatisticas,
        outliers,
        atrasosData
      ] = await Promise.all([
        apiService.getOperacionalKpis({ inicio, fim, threshold_minutos: thresholdToUse }),
        apiService.getOperacionalTempoPreparoTempo({ granularidade: 'dia', inicio, fim }),
        apiService.getOperacionalEtaVsRealScatter({ inicio, fim, limit: 500 }),
        apiService.getOperacionalDistribuicaoTempos({ tipo: 'preparo', inicio, fim }),
        apiService.getOperacionalDistribuicaoTempos({ tipo: 'entrega', inicio, fim }),
        apiService.getOperacionalPrecisaoEtaHora({ inicio, fim }),
        apiService.getOperacionalTemposPorHora({ inicio, fim }),
        apiService.getOperacionalAnalisePorPeriodo({ inicio, fim }),
        apiService.getOperacionalEstatisticasTempos({ inicio, fim }),
        apiService.getOperacionalOutliersDetalhados({ inicio, fim, preparo_min: 30, entrega_min: 60, limit: 30 }),
        apiService.getOperacionalAtrasos({ threshold_minutos: thresholdToUse, inicio, fim, limit: 20 })
      ]);

      setKpis(kpisData);
      setTempoPreparoTempo(tempoPreparo.dados);
      setEtaVsRealScatter(etaRealScatter.pontos);
      setDistribuicaoPreparo(distPreparo.faixas);
      setDistribuicaoEntrega(distEntrega.faixas);
      setPrecisaoEtaHora(precisaoHora.dados);
      setTemposPorHora(temposHora.dados);
      setAnalisePorPeriodo(analisePeriodo.dados);
      setEstatisticasTempos(estatisticas);
      setOutliersDetalhados(outliers);
      setAtrasos(atrasosData.dados);
      //resetar estados de "ver todos" quando dados mudarem
      setMostrarTodosPreparo(false);
      setMostrarTodosEntrega(false);
      setMostrarTodosAtrasos(false);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar dados operacionais');
    }
  };

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
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
        
        await loadData(inicio, fim);
        if (mounted) {
          setThresholdInput(thresholdAtraso.toString());
        }
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dashboard operacional');
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  const handleApplyThreshold = () => {
    const newThreshold = parseInt(thresholdInput) || 10;
    if (newThreshold >= 0 && newThreshold <= 60) {
      setThresholdAtraso(newThreshold);
      if (defaultInicio && defaultFim) {
        loadData(defaultInicio, defaultFim, newThreshold);
      }
    } else {
      setThresholdInput(thresholdAtraso.toString());
    }
  };

  useEffect(() => {
    function onDateRange(e: any) {
      const { inicio, fim } = e.detail || {};
      if (!inicio || !fim) return;
      loadData(inicio, fim);
    }
    window.addEventListener('dateRangeChange', onDateRange as any);
    return () => window.removeEventListener('dateRangeChange', onDateRange as any);
  }, []);

  const kpiCards = useMemo(() => {
    if (!kpis) return [] as any[];
    return [
      {
        title: 'Pedidos Entregues no Prazo',
        value: `${kpis.precisao_eta_pct?.toFixed(1) || 0}%`,
        change: undefined,
        icon: <FiCheckCircle />, 
        color: kpis.precisao_eta_pct >= 80 ? 'green' : kpis.precisao_eta_pct >= 60 ? 'orange' : 'red' as const
      },
      {
        title: 'Taxa de Atraso',
        value: `${kpis.taxa_atraso_pct?.toFixed(1) || 0}%`,
        change: undefined,
        icon: <FiAlertCircle />, 
        color: kpis.taxa_atraso_pct < 10 ? 'green' : kpis.taxa_atraso_pct < 20 ? 'orange' : 'red' as const
      },
      {
        title: 'Eficiência Média',
        value: `${kpis.eficiencia_media?.toFixed(2) || 0}`,
        change: undefined,
        icon: <FiTrendingUp />, 
        color: 'blue' as const
      },
      {
        title: 'Desempenho ETA',
        value: `${kpis.desempenho_eta >= 0 ? '+' : ''}${kpis.desempenho_eta?.toFixed(1) || 0}%`,
        change: undefined,
        icon: <FiClock />, 
        color: Math.abs(kpis.desempenho_eta) < 5 ? 'green' : Math.abs(kpis.desempenho_eta) < 15 ? 'orange' : 'red' as const
      }
    ];
  }, [kpis, thresholdAtraso]);

  return (
    <Layout 
      title="Operacional" 
      subtitle="Tempos, precisão de ETA e eficiência"
    >
      <DashboardContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FiltroContainer>
          <FiltroLabel>Limite de Atraso (minutos):</FiltroLabel>
          <FiltroInputWrapper>
            <FiltroInput
              type="number"
              min="0"
              max="60"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyThreshold();
                }
              }}
            />
            <FiltroButton onClick={handleApplyThreshold}>
              Aplicar
            </FiltroButton>
          </FiltroInputWrapper>
        </FiltroContainer>

        {/*kpis */}
        <KPISection>
          <SectionTitle>Indicadores de Eficiência</SectionTitle>
          <KPIGrid>
            {kpiCards.map((kpi: any, index: number) => (
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
          <SectionTitle>Tempos e Evolução</SectionTitle>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Tempo Médio de Preparo ao Longo do Tempo</TituloGrafico>
                <SubtituloGrafico>Evolução diária do tempo de preparo</SubtituloGrafico>
              </CabecalhoGrafico>
              {tempoPreparoTempo.length ? (
                <TempoPreparoTempoChart data={tempoPreparoTempo} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Tempos por Hora do Dia</TituloGrafico>
                <SubtituloGrafico>Tempo médio de preparo e entrega por hora</SubtituloGrafico>
              </CabecalhoGrafico>
              {temposPorHora.length ? (
                <TemposPorHoraChart data={temposPorHora} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Distribuição de Tempos de Preparo</TituloGrafico>
                <SubtituloGrafico>Quantidade de pedidos por faixa de tempo</SubtituloGrafico>
              </CabecalhoGrafico>
              {distribuicaoPreparo.length ? (
                <DistribuicaoTemposChart data={distribuicaoPreparo} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Distribuição de Tempos de Entrega</TituloGrafico>
                <SubtituloGrafico>Quantidade de pedidos por faixa de tempo</SubtituloGrafico>
              </CabecalhoGrafico>
              {distribuicaoEntrega.length ? (
                <DistribuicaoTemposChart data={distribuicaoEntrega} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>

        {/*estatisticas deatalhadas */}
        {estatisticasTempos && (
          <SecaoGraficos>
            <ContainerGrafico>
              <EstatisticasDetalhadasCard 
                preparo={estatisticasTempos.preparo}
                entrega={estatisticasTempos.entrega}
              />
            </ContainerGrafico>
          </SecaoGraficos>
        )}

        {/* Precisão do ETA */}
        <SecaoGraficos>
          <SectionTitle>Precisão do ETA</SectionTitle>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Scatter Plot: ETA vs Tempo Real</TituloGrafico>
                <SubtituloGrafico>Comparação visual entre ETA estimado e tempo real de entrega</SubtituloGrafico>
                <LegendaCores>
                  <LegendaItem>
                    <LegendaCor $cor="#10b981" />
                    <span>Verde: Diferença ≤ 5 min (preciso)</span>
                  </LegendaItem>
                  <LegendaItem>
                    <LegendaCor $cor="#ef4444" />
                    <span>Vermelho: Atrasado (&gt; 5 min)</span>
                  </LegendaItem>
                  <LegendaItem>
                    <LegendaCor $cor="#3b82f6" />
                    <span>Azul: Antecipado (&lt; -5 min)</span>
                  </LegendaItem>
                </LegendaCores>
              </CabecalhoGrafico>
              {etaVsRealScatter.length ? (
                <EtaVsRealScatterChart data={etaVsRealScatter} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

             <ContainerGrafico>
               <CabecalhoGrafico>
                 <TituloGrafico>Precisão do ETA por Hora do Dia</TituloGrafico>
                 <SubtituloGrafico>
                   Percentual de pedidos entregues no prazo por hora do dia.
                 </SubtituloGrafico>
                 <LegendaCores style={{ marginTop: '0.75rem' }}>
                   <LegendaItem>
                     <LegendaCor $cor="#10b981" />
                     <span>Verde: ≥ 80% (Precisão Boa)</span>
                   </LegendaItem>
                   <LegendaItem>
                     <LegendaCor $cor="#f59e0b" />
                     <span>Amarelo: 60-79% (Precisão Média)</span>
                   </LegendaItem>
                   <LegendaItem>
                     <LegendaCor $cor="#ef4444" />
                     <span>Vermelho: &lt; 60% (Precisão Baixa)</span>
                   </LegendaItem>
                 </LegendaCores>
               </CabecalhoGrafico>
               {precisaoEtaHora.length ? (
                 <PrecisaoEtaHoraChart data={precisaoEtaHora} />
               ) : (
                 <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
               )}
             </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>

        <SecaoGraficos>
          <SectionTitle>Análise por Período do Dia</SectionTitle>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Análise Operacional por Período</TituloGrafico>
                <SubtituloGrafico>Métricas de tempos, volume, atrasos e precisão por período do dia</SubtituloGrafico>
              </CabecalhoGrafico>
              {analisePorPeriodo.length > 0 ? (
                <AnalisePorPeriodoChart data={analisePorPeriodo} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>

        {/*outliers */}
        {outliersDetalhados && (outliersDetalhados.outliers_preparo.length > 0 || outliersDetalhados.outliers_entrega.length > 0) && (
          <SecaoGraficos>
            <SectionTitle>Análise de Outliers</SectionTitle>
            
            {outliersDetalhados.resumo && (
              <ResumoOutliers>
                <ResumoItem>
                  <ResumoLabel>Preparo &gt; 30 min:</ResumoLabel>
                  <ResumoValue>{outliersDetalhados.resumo.outliers_preparo_count} ({outliersDetalhados.resumo.pct_preparo.toFixed(1)}%)</ResumoValue>
                </ResumoItem>
                <ResumoItem>
                  <ResumoLabel>Entrega &gt; 60 min:</ResumoLabel>
                  <ResumoValue>{outliersDetalhados.resumo.outliers_entrega_count} ({outliersDetalhados.resumo.pct_entrega.toFixed(1)}%)</ResumoValue>
                </ResumoItem>
              </ResumoOutliers>
            )}

            {outliersDetalhados.outliers_preparo.length > 0 && (
              <TabelaContainer style={{ marginBottom: '1.5rem' }}>
                <TabelaTitle>
                  Top Pedidos com Preparo &gt; 30 minutos
                  {outliersDetalhados.outliers_preparo.length > LIMITE_INICIAL && (
                    <ContadorTabela>
                      ({mostrarTodosPreparo ? outliersDetalhados.outliers_preparo.length : LIMITE_INICIAL} de {outliersDetalhados.outliers_preparo.length})
                    </ContadorTabela>
                  )}
                </TabelaTitle>
                <Tabela>
                  <thead>
                    <Tr>
                      <Th>Data/Hora</Th>
                      <Th>Preparo (min)</Th>
                      <Th>Entrega (min)</Th>
                      <Th>Distância (km)</Th>
                      <Th>Hora</Th>
                      <Th>Bairro</Th>
                      <Th>Plataforma</Th>
                      <Th>Modo</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {(mostrarTodosPreparo 
                      ? outliersDetalhados.outliers_preparo 
                      : outliersDetalhados.outliers_preparo.slice(0, LIMITE_INICIAL)
                    ).map((outlier: any, index: number) => (
                      <Tr key={index}>
                        <Td>{outlier.data ? new Date(outlier.data).toLocaleString('pt-BR') : '-'}</Td>
                        <Td $isAtraso={true}>{outlier.tempo_preparo.toFixed(0)}</Td>
                        <Td>{outlier.tempo_entrega.toFixed(0)}</Td>
                        <Td>{outlier.distancia_km.toFixed(1)}</Td>
                        <Td>{outlier.hora !== null ? `${outlier.hora}:00` : '-'}</Td>
                        <Td>{outlier.bairro || '-'}</Td>
                        <Td>{outlier.platform || '-'}</Td>
                        <Td>{outlier.modo || '-'}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Tabela>
                {outliersDetalhados.outliers_preparo.length > LIMITE_INICIAL && (
                  <BotaoVerMais onClick={() => setMostrarTodosPreparo(!mostrarTodosPreparo)}>
                    {mostrarTodosPreparo ? 'Ver menos' : `Ver todos (${outliersDetalhados.outliers_preparo.length})`}
                  </BotaoVerMais>
                )}
              </TabelaContainer>
            )}

            {outliersDetalhados.outliers_entrega.length > 0 && (
              <TabelaContainer>
                <TabelaTitle>
                  Top Pedidos com Entrega &gt; 60 minutos
                  {outliersDetalhados.outliers_entrega.length > LIMITE_INICIAL && (
                    <ContadorTabela>
                      ({mostrarTodosEntrega ? outliersDetalhados.outliers_entrega.length : LIMITE_INICIAL} de {outliersDetalhados.outliers_entrega.length})
                    </ContadorTabela>
                  )}
                </TabelaTitle>
                <Tabela>
                  <thead>
                    <Tr>
                      <Th>Data/Hora</Th>
                      <Th>Preparo (min)</Th>
                      <Th>Entrega (min)</Th>
                      <Th>Distância (km)</Th>
                      <Th>Hora</Th>
                      <Th>Bairro</Th>
                      <Th>Plataforma</Th>
                      <Th>Modo</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {(mostrarTodosEntrega 
                      ? outliersDetalhados.outliers_entrega 
                      : outliersDetalhados.outliers_entrega.slice(0, LIMITE_INICIAL)
                    ).map((outlier: any, index: number) => (
                      <Tr key={index}>
                        <Td>{outlier.data ? new Date(outlier.data).toLocaleString('pt-BR') : '-'}</Td>
                        <Td>{outlier.tempo_preparo.toFixed(0)}</Td>
                        <Td $isAtraso={true}>{outlier.tempo_entrega.toFixed(0)}</Td>
                        <Td>{outlier.distancia_km.toFixed(1)}</Td>
                        <Td>{outlier.hora !== null ? `${outlier.hora}:00` : '-'}</Td>
                        <Td>{outlier.bairro || '-'}</Td>
                        <Td>{outlier.platform || '-'}</Td>
                        <Td>{outlier.modo || '-'}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Tabela>
                {outliersDetalhados.outliers_entrega.length > LIMITE_INICIAL && (
                  <BotaoVerMais onClick={() => setMostrarTodosEntrega(!mostrarTodosEntrega)}>
                    {mostrarTodosEntrega ? 'Ver menos' : `Ver todos (${outliersDetalhados.outliers_entrega.length})`}
                  </BotaoVerMais>
                )}
              </TabelaContainer>
            )}
          </SecaoGraficos>
        )}

        {/* Tabela de Atrasos */}
        {atrasos.length > 0 && (
          <SecaoGraficos>
            <SectionTitle>
              Pedidos com Atraso &gt; {thresholdAtraso} minutos
              {atrasos.length > LIMITE_INICIAL && (
                <ContadorTabela style={{ marginLeft: '0.5rem' }}>
                  ({mostrarTodosAtrasos ? atrasos.length : LIMITE_INICIAL} de {atrasos.length})
                </ContadorTabela>
              )}
            </SectionTitle>
            <TabelaContainer>
              <Tabela>
                <thead>
                  <Tr>
                    <Th>Data</Th>
                    <Th>Cliente</Th>
                    <Th>ETA (min)</Th>
                    <Th>Real (min)</Th>
                    <Th>Atraso (min)</Th>
                    <Th>Distância (km)</Th>
                    <Th>Plataforma</Th>
                  </Tr>
                </thead>
                <tbody>
                  {(mostrarTodosAtrasos ? atrasos : atrasos.slice(0, LIMITE_INICIAL)).map((atraso, index) => (
                    <Tr key={index}>
                      <Td>{atraso.data ? new Date(atraso.data).toLocaleDateString('pt-BR') : '-'}</Td>
                      <Td>{atraso.nome_cliente || '-'}</Td>
                      <Td>{atraso.eta_minutos.toFixed(0)}</Td>
                      <Td>{atraso.tempo_real_minutos.toFixed(0)}</Td>
                      <Td $isAtraso={true}>{atraso.atraso_minutos.toFixed(0)}</Td>
                      <Td>{atraso.distancia_km.toFixed(1)}</Td>
                      <Td>{atraso.platform || '-'}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Tabela>
              {atrasos.length > LIMITE_INICIAL && (
                <BotaoVerMais onClick={() => setMostrarTodosAtrasos(!mostrarTodosAtrasos)}>
                  {mostrarTodosAtrasos ? 'Ver menos' : `Ver todos (${atrasos.length})`}
                </BotaoVerMais>
              )}
            </TabelaContainer>
          </SecaoGraficos>
        )}
      </DashboardContainer>
    </Layout>
  );
};

export default OperacionalDashboard;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ErrorMessage = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 12px;
  border-radius: 8px;
`;

const FiltroContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FiltroLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
`;

const FiltroInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FiltroInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 100px;
  
  &:focus {
    outline: none;
    border-color: #792810;
    box-shadow: 0 0 0 3px rgba(121, 40, 16, 0.1);
  }
`;

const FiltroButton = styled.button`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #792810 0%, #5C1F0C 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(121, 40, 16, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
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

const LegendaCores = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
`;

const LegendaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #4a5568;
`;

const LegendaCor = styled.div<{ $cor: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$cor};
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

const ResumoOutliers = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 12px;
  border: 1px solid #fcd34d;
`;

const ResumoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ResumoLabel = styled.span`
  font-size: 0.875rem;
  color: #92400e;
  font-weight: 600;
`;

const ResumoValue = styled.span`
  font-size: 1.125rem;
  color: #78350f;
  font-weight: 700;
`;

const TabelaContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow-x: auto;
`;

const TabelaTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContadorTabela = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #718096;
`;

const BotaoVerMais = styled.button`
  margin-top: 1rem;
  padding: 0;
  background: none;
  border: none;
  color: #1D311F;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover {
    color: #2d4630;
  }
`;

const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #f8fafc;
  }
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td<{ $isAtraso?: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${props => props.$isAtraso ? '#ef4444' : '#1a202c'};
  font-weight: ${props => props.$isAtraso ? 600 : 400};
`;

