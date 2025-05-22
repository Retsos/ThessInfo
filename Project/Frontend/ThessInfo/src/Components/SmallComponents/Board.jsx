import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { useData } from '../DataContext';
import LoadingInd from '../SmallComponents/loadingcomp';
import styles from './Board.module.css';

const headCells = [
  { id: 'area', label: 'Περιοχή' },
  {
    id: 'complianceValue',
    getLabel: (tabValue) => {
      switch (tabValue) {
        case 0: return 'Τιμή Συμμόρφωσης';
        case 1: return 'Ανακυκλώσιμα (kg/Κάτοικο)';
        case 2: return 'Τιμή Συμμόρφωσης';
        default: return 'Τιμή';
      }
    }
  },
];

export default function Board() {
  const [tabValue, setTabValue] = React.useState(0);
  const { airData, waterData, recyclingData, loading } = useData();
  const [orderBy, setOrderBy] = React.useState('area');
  const [order, setOrder] = React.useState('asc');

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const transformData = data => {
    if (!data) return [];
    return Object.entries(data)
      .filter(([key]) => key !== 'name')
      .map(([area, obj]) => ({
        area: area.replace(/_/g, ' '),
        complianceValue: obj.compliant_count,
      }));
  };

  const rawData = React.useMemo(() => {
    switch (tabValue) {
      case 0: return waterData;
      case 1: return recyclingData;
      case 2: return airData;
      default: return null;
    }
  }, [tabValue, airData, waterData, recyclingData]);

  const rows = React.useMemo(() => {
    const arr = transformData(rawData);
    return arr.sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'area') {
        return isAsc
          ? a.area.localeCompare(b.area)
          : b.area.localeCompare(a.area);
      } else {
        return isAsc
          ? a.complianceValue - b.complianceValue
          : b.complianceValue - a.complianceValue;
      }
    });
  }, [rawData, orderBy, order]);

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
        <div className='d-flex justify-content-center align-items-center'>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="scrollable prevent tabs example"
          >
            <Tab label="Ποιότητα Νερού" />
            <Tab label="Ανακύκλωσιμα σε kg/Κάτοικο" />
            <Tab label="Ποιότητα Αέρα" />
          </Tabs>
        </div>
      </Box>

      {loading ? (
        <LoadingInd />
      ) : (
        <TableContainer component={Paper} className={styles.tableWrapper}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                {headCells.map(cell => (
                  <TableCell
                    key={cell.id}
                    align="center"
                    sortDirection={orderBy === cell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === cell.id}
                      direction={orderBy === cell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(cell.id)}
                    >
                      {typeof cell.getLabel === 'function'
                        ? cell.getLabel(tabValue)
                        : cell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell align="center">{row.area}</TableCell>
                  <TableCell align="center">{row.complianceValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}