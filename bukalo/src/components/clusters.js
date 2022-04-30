import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {Breadcrumbs, Grid, Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CustomizedBreadcrumbs from "./CustomizedBreadcumbs"
import ActionPanel from "./ActionPanel"

const columns = [
  {id: 'cluster', label: 'Cluster', minWidth: 170},
  {id: 'numCase', label: 'Total Case', minWidth: 100},
];

const clusterData = {
  "cluster_1": ["800000001732200000.00", "800000001732100000.00", "800000001732100000.00"],
  "cluster_2": ["800000001732100000.00",
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"],
  "cluster_3": ["800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"
    , "800000001732100000.00"]

}
const rows = Object.keys(clusterData).map((key)=>{
  return {"cluster":key,"numCase": clusterData[key].length}
}) ;

console.log(rows)
export default function Clusters(historyCluster) {
  console.log(historyCluster)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (url) => {
    console.log(url)

  }
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick("/")}>
      Start
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/material-ui/getting-started/installation/"
      onClick={handleClick("/1")}
    >
      Core
    </Link>,
    <Typography key="3" color="text.primary">
      Breadcrumb
    </Typography>,
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={8}>
      <Grid item xs={12} md={12}>
        <CustomizedBreadcrumbs breadcrumbs={breadcrumbs} />
      </Grid>
      <Grid item xs={12} md={12}>
        <ActionPanel/>
      </Grid>
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
          <TableContainer sx={{maxHeight: 440}}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{minWidth: column.minWidth}}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      <Grid item xs={4} md={4}>
        Neeu neeue
      </Grid>
    </Grid>
  );
}
