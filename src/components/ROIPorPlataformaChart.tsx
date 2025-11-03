import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface PlataformaROI {
  plataforma: string;
  investimento: number;
  retorno: number;
  roi_pct: number;
  payback_meses: number;
}

interface Props {
  data: PlataformaROI[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const ROIPorPlataformaChart: React.FC<Props> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.roi_pct - a.roi_pct);

  return (
    <Container>
      <ChartSection>
        <ChartTitle>ROI % por Plataforma</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="plataforma" 
              tick={{ fontSize: 12 }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
            <Bar dataKey="roi_pct" name="ROI %" fill={CHART_COLORS.amarelo}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS.amarelo} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      <TableSection>
        <TableTitle>Ranking de ROI</TableTitle>
        <Table>
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Investimento</th>
              <th>Retorno</th>
              <th>ROI %</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td><PlatformName>{item.plataforma}</PlatformName></td>
                <td>{currency.format(item.investimento)}</td>
                <td>{currency.format(item.retorno)}</td>
                <td>
                  <ROICell roi={item.roi_pct}>
                    {item.roi_pct.toFixed(2)}%
                  </ROICell>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableSection>
    </Container>
  );
};

export default ROIPorPlataformaChart;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ChartTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const TableSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TableTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead {
    background: #f8fafc;
  }

  th {
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 2px solid #e2e8f0;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    color: #4a5568;
  }

  tbody tr:hover {
    background: #f8fafc;
  }
`;

const PlatformName = styled.span`
  font-weight: 600;
  color: #1a202c;
`;

const ROICell = styled.span<{ roi: number }>`
  font-weight: 600;
  color: ${props => {
    if (props.roi > 100) return '#22c55e';
    if (props.roi > 50) return '#3b82f6';
    if (props.roi > 0) return '#f59e0b';
    return '#ef4444';
  }};
`;

