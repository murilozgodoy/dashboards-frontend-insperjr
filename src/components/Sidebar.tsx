import React from 'react';
import styled from 'styled-components';
import { 
  FiHome, 
  FiTrendingUp, 
  FiShoppingCart, 
  FiUsers, 
  FiBarChart,
  FiDollarSign,
  FiSidebar
} from 'react-icons/fi';
import logo from '../assets/logo.png';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  isOpen?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick, isCollapsed }) => (
  <SidebarItemContainer $isActive={isActive} onClick={onClick} $isCollapsed={isCollapsed}>
    <IconWrapper $isActive={isActive}>
      {icon}
    </IconWrapper>
    {!isCollapsed && <Label>{label}</Label>}
  </SidebarItemContainer>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  activeItem = 'dashboard', 
  onItemClick, 
  isOpen = false,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: 'home', icon: <FiHome />, label: 'Home' },
    { id: 'temporal', icon: <FiTrendingUp />, label: 'Temporal' },
    { id: 'geografica', icon: <FiBarChart />, label: 'Geográfica' },
    { id: 'plataformas', icon: <FiShoppingCart />, label: 'Plataformas' },
    { id: 'operacional', icon: <FiUsers />, label: 'Operacional' },
    { id: 'rentabilidade', icon: <FiDollarSign />, label: 'Rentabilidade' }
  ];

  return (
    <SidebarContainer className={`${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <LogoContainer>
        <LogoImage src={logo} alt="Kaiserhaus Logo" />
        {!isCollapsed && (
          <LogoText>
            <CompanyName>Kaiserhaus</CompanyName>
            <CompanySubtitle>Dashboard</CompanySubtitle>
          </LogoText>
        )}
      </LogoContainer>

      <CollapseButton onClick={onToggleCollapse}>
        <FiSidebar />
      </CollapseButton>

      <MenuSection>
        <MenuList>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.id}
              onClick={() => onItemClick?.(item.id)}
              isCollapsed={isCollapsed}
            />
          ))}
        </MenuList>
      </MenuSection>
    </SidebarContainer>
  );
};

export default Sidebar;


const SidebarContainer = styled.div`
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1a1d29 0%, #2d3748 100%);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease, transform 0.3s ease;

  &.collapsed {
    width: 80px;
  }

  @media (max-width: 768px) {
    width: 280px;
    transform: translateX(-100%);
    
    &.open {
      transform: translateX(0);
    }

    &.collapsed {
      width: 80px;
    }
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const LogoContainer = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const CompanyName = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
`;

const CompanySubtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
`;

const MenuSection = styled.div`
  flex: 1;
  padding: 1.5rem 0;
`;

const MenuTitle = styled.h3`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 1.5rem;
  text-align: center;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SidebarItemContainer = styled.div<{ $isActive?: boolean; $isCollapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  margin: 0 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isActive 
    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
    : 'transparent'
  };
  box-shadow: ${props => props.$isActive 
    ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
    : 'none'
  };
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};

  &:hover {
    background: ${props => props.$isActive 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
      : 'rgba(255, 255, 255, 0.05)'
    };
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    margin: 0 0.5rem;
  }
`;

const IconWrapper = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isActive ? 'white' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 1.25rem;
  transition: color 0.2s ease;
`;

const Label = styled.span`
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: -0.025em;
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: -12px;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 1001;

  &:hover {
    background: #1d4ed8;
    transform: scale(1.1);
  }

  svg {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
