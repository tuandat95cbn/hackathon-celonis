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
import {CircularProgress} from '@material-ui/core'
import ClusterDetail from './ClusterDetail';
import FurtherClustering from './FurtherClustering';
import {makeStyles} from '@material-ui/core';
import Button from '@mui/material/Button';
import ResetDialog from "./ResetDialog"

const useStyles = makeStyles({
  drawer: {
    paddingLeft: 0
  }
});



export default function Clusters({clusterParams, handleAddClusterParam, handleResetCluster}) {
  const classes = useStyles();

  const [columns, setColumns] = React.useState([
    {id: 'cluster', label: 'Cluster', minWidth: 170},
    {id: 'numCase', label: 'Total Case', minWidth: 100},
  ]);
  const [actions, setActions] = React.useState([{
    "table": "EKPO_parquet",
    "column": "_CASE_KEY",
    "action": ""
  }])
  const [clusterId, setClusterId] = React.useState()
  const [currentClusterCase, setCurrentClusterCase] = React.useState([])
  const [mapColName, setMapColName] = React.useState()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(true)
  const [openResetDialog, setOpenResetDialog] = React.useState(false)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [clusterData, setClusterData] = React.useState()
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [rows, setRows] = React.useState([])
  const getCurrentClusterCol = () => {
    for (let i = 0; i < clusterParams.length; i++) {
      if (clusterParams[i]['clusterId'] == 'None') {
        if (clusterParams[i]['epls'] != undefined && clusterParams[i]['minpts'] != undefined)
          return clusterParams[i]['column'] + "?epls=" + clusterParams[i]['epls'] + "&minpts=" + clusterParams[i]['minpts']
        else return clusterParams[i]['column']
      }
    }
    return null
  }
  React.useEffect(() => {
    setIsLoading(true)
    if (clusterParams.length <= 1)
      axios.get(API_URL + "table/cluster/" + getCurrentClusterCol())
        .then(function (response) {
          setClusterData(response.data);
          setIsLoading(false)
        })
        .catch(function (error) {
          console.log(error);
        });
    else {
      let data = clusterParams.slice(0, -1)
      data = data.map((e) => {
        return {
          "column": e.column,
          "cluster_id": e.clusterId,
          "epls": e.epls,
          "minpts": e.minpts,
        }
      })
      axios.post(API_URL + "cluster-further/" + getCurrentClusterCol(), data)
        .then(function (response) {
          setClusterData(response.data);
          setIsLoading(false)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [clusterParams])

  React.useEffect(() => {
    generateBreadcrumb()
  }, [clusterParams])

  React.useEffect(() => {
    if (clusterId!= undefined){
      console.log(clusterId)
      console.log(clusterData["Case_ID"][clusterId])
    setCurrentClusterCase(clusterData["Case_ID"][clusterId])

  }}, [clusterId])
  React.useEffect(() => {
    if (actions.length > 1) {
      let map = {}
      actions.forEach((act) => {
        if (Object.hasOwn(act, "newName")) {
          map[act["column"]] = act["newName"]
        }
      })
      setMapColName(map)
      setIsLoading(true)
      let data = actions
      axios.post(API_URL + "table/add-column/" + getCurrentClusterCol(), data)
        .then(function (response) {
          setClusterData(response.data);
          setIsLoading(false)
        })
        .catch(function (error) {
          console.log(error);
        });

    }
  }, [actions])
  const getColumnName = (col) => {
    if (mapColName)
      if (Object.hasOwn(mapColName, col))
        return mapColName[col]
    return col
  }
  React.useEffect(() => {
    if (clusterData) {
      let cols = Object.keys(clusterData)
      cols.push("cluster")
      setColumns(cols.map((col) => {
        return {id: col, label: getColumnName(col), minWidth: 100}
      }))
      cols.pop()
      let l_rows = Object.keys(clusterData[cols[0]]).map((cluster) => {
        const r = {
          "cluster": cluster,
        }
        r[cols[0]] = clusterData[cols[0]][cluster]
        for (let i = 0; i < cols.length; i++) {
          if (Array.isArray(clusterData[cols[i]][cluster]))
            r[cols[i]] = new Set(clusterData[cols[i]][cluster]).size
          else r[cols[i]] = clusterData[cols[i]][cluster]
        }
        return r
      })
      setRows(
        l_rows
      )
        //setRows(Object.keys(clusterData).map((key) => {
        //  return {"cluster": key, "numCase": clusterData[key].length}
        //}
        ;
    }
  }, [clusterData])
  const handleClick = (url) => {
    console.log(url)

  }
  const handleFurtherClustering = (col, epls, minpts) => {
    console.log(col, epls, minpts)
    handleAddClusterParam(col, clusterId, true, epls, minpts)
    setClusterId()
  }
  const handleAddAction = (action) => {
    setActions(prev => [...prev, action])
  }
  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Link underline="hover" key="1" color="inherit">
      Start
    </Link>,
  ]);

  const handleReset = (col, e, m) => {
    handleResetCluster(col, "None", e, m)
  }
  const handleOpenDialog = () => {
    setOpenResetDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenResetDialog(false)
  }
  const handleClusterSelect = (clusterId) => {
    setClusterId(clusterId)
  }

  const generateBreadcrumb = () => {
    let newBreadcrumbs = [<Link underline="hover" key="1" color="inherit">
      Start
    </Link>,]
    for (let i = 0; i < clusterParams.length; i++) {

      newBreadcrumbs.push(
        <Link
          underline="hover"
          key={2 * i}
          color="inherit"
        >
          {clusterParams[i]['column']}
        </Link>)
      if (clusterParams[i]['clusterId'] !== 'None')
        newBreadcrumbs.push(
          <Link
            underline="hover"
            key={2 * i + 1}
            color="inherit"
          //href={"/" + name}
          //onClick={handleClick("/" + name)}
          >
            Cluster-{clusterParams[i]['clusterId']}
          </Link>
        );
    }

    setBreadcrumbs(newBreadcrumbs)
  }
  if (isLoading) return (
    <div style={{'width': "100%", "textAlign": 'center', marginTop: 30}}>
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
            {clusterParams.length <= 1 ?
              <ActionPanel setAction={handleAddAction} /> : ""}
          </Grid>
          <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 700}}>
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
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.cluster} onClick={() => handleClusterSelect(row['cluster'])}>
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
          <Button disabled={false} variant="contained" color="primary" onClick={handleOpenDialog}>Reset</Button>
        </Grid>

        {clusterId ?
          <Grid container item xs={4} md={4} className={classes.drawer}>
            <ClusterDetail cases={currentClusterCase} clusterId={clusterId} />
            <FurtherClustering handleFurtherClustering={handleFurtherClustering} />
          </Grid>
          : ""}
        <ResetDialog open={openResetDialog} handleReset={handleReset} handleClose={handleCloseDialog} />
      </Grid>
    );
}
