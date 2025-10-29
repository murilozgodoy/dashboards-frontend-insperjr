import React from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue' 
}) => {
  const isPositive = change && change.value > 0;
  const isNegative = change && change.value < 0;

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <IconWrapper color={color}>
          {icon}
        </IconWrapper>
      </CardHeader>
      
      <CardContent>
        <CardValue>{value}</CardValue>
        
        {change && (
          <ChangeIndicator $isPositive={isPositive} $isNegative={isNegative}>
            <ChangeIcon>
              {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
            </ChangeIcon>
            <ChangeText>
              {isPositive ? '+' : ''}{change.value}% {change.period}
            </ChangeText>
          </ChangeIndicator>
        )}
      </CardContent>
    </CardContainer>
  );
};

export default KPICard;


const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #718096;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: ${props => {
    switch (props.color) {
      case 'blue':
        return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
      case 'green':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'orange':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'red':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default:
        return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    }
  }};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ChangeIndicator = styled.div<{ $isPositive?: boolean; $isNegative?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => {
    if (props.$isPositive) return '#10b981';
    if (props.$isNegative) return '#ef4444';
    return '#718096';
  }};
`;

const ChangeIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
`;

const ChangeText = styled.span`
  font-size: 0.875rem;
`;
