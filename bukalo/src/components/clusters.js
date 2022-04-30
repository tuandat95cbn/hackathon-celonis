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
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {API_URL} from '../constant'
import { CircularProgress } from '@material-ui/core'
import ClusterDetail from './ClusterDetail';
import FurtherClustering from './FurtherClustering';

const columns = [
  {id: 'cluster', label: 'Cluster', minWidth: 170},
  {id: 'numCase', label: 'Total Case', minWidth: 100},
];


export default function Clusters(historyCluster) {
  const location = useLocation();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading,setIsLoading]= React.useState(true)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [clusterData, setClusterData] = React.useState()
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [rows, setRows] = React.useState([])

  React.useEffect(() => {
    setIsLoading(true)
    axios.get(API_URL + "table/cluster/" + location.state.column)
      .then(function (response) {
        addBreadcrumbs(location.state.column)
        setClusterData(response.data["Case_ID"]);
        setIsLoading(false)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  React.useEffect(() => {
    if (clusterData)
      setRows(Object.keys(clusterData).map((key) => {
        return {"cluster": key, "numCase": clusterData[key].length}
      }));

  }, [clusterData])
  const handleClick = (url) => {
    console.log(url)

  }
  const [breadcrumbs, setBreadcrumbs] =React.useState( [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick("/")}>
      Start
    </Link>,
  ]);

  const addBreadcrumbs=(column)=>{
    console.log(column)
    let col=(
          <Link
      underline="hover"
      key={breadcrumbs.length}
      color="inherit"
      href={"/"+column}
      onClick={handleClick("/"+column)}
    >
      {column}
    </Link>
    );
    setBreadcrumbs(prev=>[...prev,col])
  }
  if (isLoading) return (
    <div style={{ 'width': "100%", "textAlign": 'center', marginTop: 30 }}>
              <CircularProgress />
              <Typography variant='subtitle1' >Processing ...</Typography>
            </div>
  );
  else
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={8}>
        <Grid item xs={12} md={12}>
          <CustomizedBreadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item xs={12} md={12}>
          <ActionPanel />
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
      <ClusterDetail/>
      <FurtherClustering/>
      </Grid>
    </Grid>
  );
}