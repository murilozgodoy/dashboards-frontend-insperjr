import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

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
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuClick = (item: string) => {
    setActiveMenuItem(item);
    //fechar sidebar no mobile após clicar em um item
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
    console.log(`Navegando para: ${item}`);
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
