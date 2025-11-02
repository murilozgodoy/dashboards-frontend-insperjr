import React, { useMemo, useState } from 'react';
import { apiService } from '../services/api';
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
  const [preset, setPreset] = useState<'mes'|'periodo'|'ano'|'diario'>('mes');
  const [dailyDate, setDailyDate] = useState<string>('');
  const [monthValue, setMonthValue] = useState<string>(''); // YYYY-MM
  const [dateBounds, setDateBounds] = useState<{ min: string | null; max: string | null }>({ min: null, max: null });
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');

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

  const computeRange = useMemo(() => {
    const now = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (preset === 'mes') {
      const refMonth = monthValue || (dateBounds.max ? dateBounds.max.slice(0,7) : `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`);
      const [y,m] = refMonth.split('-').map(Number);
      const start = new Date(y, (m||1)-1, 1);
      const end = new Date(y, (m||1), 0);
      return { inicio: start.toISOString().slice(0,10), fim: end.toISOString().slice(0,10), granularidade: 'dia' as const };
    }
    if (preset === 'periodo') {
      const startStr = periodStart || (dateBounds.min ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0,10));
      const endStr = periodEnd || (dateBounds.max ?? now.toISOString().slice(0,10));
      return { inicio: startStr, fim: endStr, granularidade: 'dia' as const };
    }
    if (preset === 'ano') {
      const refYear = dateBounds.max ? Number(dateBounds.max.slice(0,4)) : now.getFullYear();
      const start = new Date(refYear, 0, 1);
      const end = new Date(refYear, 11, 31);
      return { inicio: start.toISOString().slice(0,10), fim: end.toISOString().slice(0,10), granularidade: 'mes' as const };
    }
    // diário
    const ref = dailyDate ? new Date(dailyDate + 'T00:00:00') : startOfDay(now);
    const start = ref;
    const end = ref;
    return { inicio: start.toISOString().slice(0,10), fim: end.toISOString().slice(0,10), granularidade: 'dia' as const };
  }, [preset, dailyDate, monthValue, periodStart, periodEnd, dateBounds.max, dateBounds.min]);

  React.useEffect(() => {
    // pegar limites do dataset para preencher mês/dia default
    apiService.getHomeDateBounds()
      .then((b) => {
        setDateBounds(b);
        if (b?.max) {
          setMonthValue(b.max.slice(0,7));
          setDailyDate(b.max);
          setPeriodEnd(b.max);
        }
        if (b?.min) setPeriodStart(b.min);
      })
      .catch(() => {});
  }, []);

  const applyRange = () => {
    const detail = { 
      mode: preset, 
      inicio: computeRange.inicio, 
      fim: computeRange.fim,
      granularidade: computeRange.granularidade
    };
    window.dispatchEvent(new CustomEvent('dateRangeChange', { detail }));
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
            <select 
              value={preset}
              onChange={(e) => setPreset(e.target.value as any)}
              style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 8px', background: 'white', color: '#334155' }}
            >
              <option value="mes">Mês inteiro</option>
              <option value="periodo">Selecione o período</option>
              <option value="ano">Este ano</option>
              <option value="diario">Diário</option>
            </select>
            {preset === 'mes' && (
              <input 
                type="month" 
                value={monthValue}
                onChange={(e) => setMonthValue(e.target.value)}
                style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 8px', background: 'white', color: '#334155' }}
              />
            )}
            {preset === 'periodo' && (
              <>
                <input 
                  type="date" 
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 8px', background: 'white', color: '#334155' }}
                />
                <input 
                  type="date" 
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 8px', background: 'white', color: '#334155' }}
                />
              </>
            )}
            {preset === 'diario' && (
              <input 
                type="date" 
                value={dailyDate} 
                onChange={(e) => setDailyDate(e.target.value)}
                style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 8px', background: 'white', color: '#334155' }}
              />
            )}
            <AplicarButton onClick={applyRange}>
              Aplicar
            </AplicarButton>
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
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CalendarIcon = styled.div`
  color: #792810;
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

const AplicarButton = styled.button`
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
    box-shadow: 0 4px 12px rgba(121, 40, 16, 0.3);
  }
`;

