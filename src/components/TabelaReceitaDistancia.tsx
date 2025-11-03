import React from 'react';
import styled from 'styled-components';

interface BairroData {
  bairro: string;
  receita: number;
  distancia_media?: number;
}

interface Props {
  data: BairroData[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const TabelaReceitaDistancia: React.FC<Props> = ({ data }) => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>Bairro</th>
            <th>Receita</th>
            <th>Distância Média</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td><BairroName>{item.bairro}</BairroName></td>
              <td>{currency.format(item.receita)}</td>
              <td>{item.distancia_media !== undefined ? `${item.distancia_media.toFixed(2)} km` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TabelaReceitaDistancia;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
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

const BairroName = styled.span`
  font-weight: 600;
  color: #1a202c;
`;

