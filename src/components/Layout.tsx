import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showDate?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showDate = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const path = location.pathname.replace(/^\//, '') || 'home';
    const key = ['home','temporal','geografica','plataformas','operacional','rentabilidade'].includes(path) ? path : 'home';
    setActiveMenuItem(key);
  }, [location.pathname]);

  const handleMenuClick = (item: string) => {
    setActiveMenuItem(item);
    const path = `/${item}`;
    navigate(path);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleMobileMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    console.log('Sidebar collapsed:', !sidebarCollapsed);
  };

  return (
    <LayoutContainer>
      <Sidebar 
        activeItem={activeMenuItem} 
        onItemClick={handleMenuClick}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      <MainContent $sidebarCollapsed={sidebarCollapsed}>
        <Header 
          title={title} 
          subtitle={subtitle} 
          showDate={showDate}
          onMenuClick={handleMobileMenuClick}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;


const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const MainContent = styled.div<{ $sidebarCollapsed?: boolean }>`
  flex: 1;
  margin-left: ${props => props.$sidebarCollapsed ? '80px' : '280px'};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  margin-top: 80px;
  background: #f8fafc;
  min-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 80px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-top: 70px;
    min-height: calc(100vh - 70px);
  }
`;
