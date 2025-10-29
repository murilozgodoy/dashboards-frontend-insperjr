import React from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import KPICard from './KPICard';
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiTrendingUp, 
  FiUsers 
} from 'react-icons/fi';

const Dashboard: React.FC = () => {
  //aqqi coloquei dados aleatorios, ja que depois vao ser trocados pelos dados da api
  const kpiData = [
    {
      title: 'Receita Total',
      value: 'R$ 45.231',
      change: { value: 12.5, period: 'vs. mês anterior' },
      icon: <FiDollarSign />,
      color: 'green' as const
    },
    {
      title: 'Pedidos',
      value: '1.234',
      change: { value: 8.2, period: 'neste mês' },
      icon: <FiShoppingCart />,
      color: 'blue' as const
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 36,65',
      change: { value: -2.4, period: 'por pedido' },
      icon: <FiTrendingUp />,
      color: 'orange' as const
    },
    {
      title: 'Clientes',
      value: '892',
      change: { value: 5.3, period: 'ativos' },
      icon: <FiUsers />,
      color: 'purple' as const
    }
  ];

  return (
    <Layout 
      title="Visão Geral" 
      subtitle="Acompanhe as principais métricas do Kaiserhaus"
    >
      <DashboardContainer>
        <KPISection>
          <SectionTitle>Métricas Principais</SectionTitle>
          <KPIGrid>
            {kpiData.map((kpi, index) => (
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
