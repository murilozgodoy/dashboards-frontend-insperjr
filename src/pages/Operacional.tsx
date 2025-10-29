import React from 'react';
import Layout from '../components/Layout';

const Operacional: React.FC = () => {
  return (
    <Layout title="Operacional" subtitle="Tempos, precisão de ETA e eficiência">
      <div style={{ background: 'white', borderRadius: 16, padding: 16, border: '1px solid #e2e8f0' }}>
        Em breve: tempos de preparo/entrega, precisão do ETA, outliers.
      </div>
    </Layout>
  );
};

export default Operacional;


