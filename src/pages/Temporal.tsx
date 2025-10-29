import React from 'react';
import Layout from '../components/Layout';

const Temporal: React.FC = () => {
  return (
    <Layout title="Análise Temporal" subtitle="Evolução de receita e pedidos">
      <div style={{ background: 'white', borderRadius: 16, padding: 16, border: '1px solid #e2e8f0' }}>
        Em breve: gráficos temporais (linha, barras, heatmap).
      </div>
    </Layout>
  );
};

export default Temporal;


