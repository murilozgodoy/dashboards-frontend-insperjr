import React from 'react';
import styled from 'styled-components';
import { FiCalendar, FiMenu } from 'react-icons/fi';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showDate?: boolean;
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showDate = true,
  onMenuClick,
  sidebarCollapsed = false
}) => {
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('pt-BR', options);
  };

  const formatDate = (date: string) => {
    return date.charAt(0).toUpperCase() + date.slice(1);
  };

  return (
    <HeaderContainer $sidebarCollapsed={sidebarCollapsed}>
      <HeaderLeft>
        <TitleSection>
          <MainTitle>{title}</MainTitle>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleSection>
      </HeaderLeft>

      <HeaderRight>
        <button 
          onClick={onMenuClick}
          style={{
            display: 'none',
            width: '44px',
            height: '44px',
            background: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4a5568',
            marginRight: '1rem',
            fontSize: '1.25rem',
            transition: 'all 0.2s ease'
          }}
          className="mobile-menu-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#edf2f7';
            e.currentTarget.style.borderColor = '#cbd5e0';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f7fafc';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <FiMenu />
        </button>

        {showDate && (
          <DateSection>
            <CalendarIcon>
              <FiCalendar />
            </CalendarIcon>
            <DateText>{formatDate(getCurrentDate())}</DateText>
          </DateSection>
        )}

        <ActionsSection>
        </ActionsSection>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;


const HeaderContainer = styled.div<{ $sidebarCollapsed?: boolean }>`
  height: 80px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: ${props => props.$sidebarCollapsed ? '80px' : '280px'};
  right: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;

  @media (max-width: 768px) {
    left: 0;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    height: 70px;
    padding: 0.75rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.10rem;
`;

const MainTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
  font-weight: 350;
  line-height: 1.4;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CalendarIcon = styled.div`
  color: #3b82f6;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
`;

const DateText = styled.span`
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

