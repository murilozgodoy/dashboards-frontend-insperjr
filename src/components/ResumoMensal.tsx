import React from 'react';

interface Props {
  melhorDia?: string | null;
  horarioPico?: string | null;
  plataformaMaisUsada?: string | null;
  bairroTop?: string | null;
  mes?: string;
}

const Item: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
    <span style={{ color: '#64748b' }}>{label}</span>
    <strong style={{ color: '#0f172a' }}>{value ?? '-'}</strong>
  </div>
);

const ResumoMensal: React.FC<Props> = ({ melhorDia, horarioPico, plataformaMaisUsada, bairroTop, mes }) => {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,.1)', border: '1px solid #e2e8f0' }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1f2937' }}>Resumo do Mês {mes ? `(${mes})` : ''}</h3>
        <p style={{ margin: 0, color: '#64748b' }}>Principais destaques</p>
      </div>
      <Item label="Melhor dia da semana" value={melhorDia ?? undefined} />
      <Item label="Horário de pico" value={horarioPico ?? undefined} />
      <Item label="Plataforma mais usada" value={plataformaMaisUsada ?? undefined} />
      <Item label="Bairro com mais pedidos/receita" value={bairroTop ?? undefined} />
    </div>
  );
};

export default ResumoMensal;


