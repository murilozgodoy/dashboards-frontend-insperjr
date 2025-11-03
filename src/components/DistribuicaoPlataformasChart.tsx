import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

// Cores das plataformas (mesmas do gráfico "Plataformas Utilizadas por Bairro")
const CORES_PLATAFORMAS: { [key: string]: string } = {
  'ifood': '#EA1D2C',
  'rappi': '#FF6B00',
  'site_proprio': '#3b82f6',
  'whatsapp': '#25D366'
};

const getCorPlataforma = (nome: string): string => {
  const nomeLower = nome.toLowerCase().replace(/\s+/g, '_');
  // Tentar diferentes variações do nome
  if (nomeLower.includes('ifood')) return CORES_PLATAFORMAS['ifood'];
  if (nomeLower.includes('rappi')) return CORES_PLATAFORMAS['rappi'];
  if (nomeLower.includes('site') || nomeLower.includes('proprio')) return CORES_PLATAFORMAS['site_proprio'];
  if (nomeLower.includes('whatsapp') || nomeLower.includes('whats')) return CORES_PLATAFORMAS['whatsapp'];
  return '#718096'; // Cor padrão se não encontrar
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

interface Item {
  nome: string;
  pedidos?: number;
  receita?: number;
  pct: number;
}

interface Props {
  data: Item[];
  mode?: 'pie' | 'bar';
}

const DistribuicaoPlataformasChart: React.FC<Props> = ({ data, mode = 'pie' }) => {
  if (mode === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis 
            tickFormatter={(value) => {
              if (data[0]?.receita) {
                return `R$ ${(value / 1000).toFixed(0)}k`;
              }
              return value.toString();
            }}
          />
          <Tooltip 
            formatter={(value: any, name: string, props: any) => {
              const item = props.payload || {};
              if (item.receita !== undefined) {
                return [currency.format(item.receita), 'Receita'];
              } else if (item.pedidos !== undefined) {
                return [`${item.pedidos.toLocaleString('pt-BR')} pedidos`, 'Pedidos'];
              }
              return [value, name];
            }}
          />
          <Legend />
          <Bar dataKey={data[0]?.receita ? "receita" : "pedidos"} name={data[0]?.receita ? "Receita" : "Pedidos"}>
            {data.map((item, idx) => (
              <Cell key={idx} fill={getCorPlataforma(item.nome)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie 
          data={data} 
          dataKey="pct" 
          nameKey="nome" 
          outerRadius={110} 
          label={(entry: any) => `${(entry.pct * 100).toFixed(1)}%`}
        >
          {data.map((item, idx) => (
            <Cell key={idx} fill={getCorPlataforma(item.nome)} />
          ))}
        </Pie>
        <Tooltip formatter={(v: any) => `${(v * 100).toFixed(1)}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DistribuicaoPlataformasChart;


