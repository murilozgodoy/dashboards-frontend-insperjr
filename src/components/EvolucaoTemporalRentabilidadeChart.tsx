import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface DadosTemporais {
  periodo: string;
  receita_bruta: number;
  comissoes: number;
  receita_liquida: number;
  margem_pct: number;
}

interface Props {
  data: DadosTemporais[];
  granularidade?: 'dia' | 'semana' | 'mes';
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const EvolucaoTemporalRentabilidadeChart: React.FC<Props> = ({ data, granularidade = 'mes' }) => {
  // Formatar período baseado na granularidade
  const formatPeriodo = (periodo: string) => {
    if (!periodo) return '';
    const date = new Date(periodo + 'T00:00:00');
    if (granularidade === 'dia') {
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else if (granularidade === 'semana') {
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else {
      // granularidade === 'mes'
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return `${meses[date.getMonth()]}/${date.getFullYear()}`;
    }
  };

  const formattedData = data.map(item => ({
    ...item,
    periodo_formatado: formatPeriodo(item.periodo)
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={formattedData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="periodo_formatado" 
          tick={{ fontSize: 12 }}
          angle={granularidade === 'dia' ? -45 : 0}
          textAnchor={granularidade === 'dia' ? 'end' : 'middle'}
          height={granularidade === 'dia' ? 80 : 30}
        />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(value) => currency.format(value)} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'receita_bruta' || name === 'comissoes' || name === 'receita_liquida') {
              return currency.format(value);
            }
            if (name === 'margem_pct') {
              return `${value.toFixed(2)}%`;
            }
            return value;
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          yAxisId="left" 
          dataKey="receita_bruta" 
          stroke={CHART_COLORS.amarelo} 
          name="Receita Bruta" 
          strokeWidth={2} 
          dot={false} 
        />
        <Line 
          type="monotone" 
          yAxisId="left" 
          dataKey="comissoes" 
          stroke={CHART_COLORS.vermelho} 
          name="Comissões" 
          strokeWidth={2} 
          dot={false} 
        />
        <Line 
          type="monotone" 
          yAxisId="left" 
          dataKey="receita_liquida" 
          stroke={CHART_COLORS.marrom} 
          name="Receita Líquida" 
          strokeWidth={2} 
          dot={false} 
        />
        <Line 
          type="monotone" 
          yAxisId="right" 
          dataKey="margem_pct" 
          stroke={CHART_COLORS.azul} 
          name="Margem %" 
          strokeWidth={2} 
          dot={false} 
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucaoTemporalRentabilidadeChart;

