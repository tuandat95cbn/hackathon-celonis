import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Breadcrumbs, Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CustomizedBreadcrumbs from "./CustomizedBreadcumbs"
import ActionPanel from "./ActionPanel"
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../constant'
import { CircularProgress } from '@material-ui/core'
import ClusterDetail from './ClusterDetail';
import FurtherClustering from './FurtherClustering';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  drawer: {
    paddingLeft: 0
  }
});

const fakeCaseIDs = ["800000000007200001",
  "800000000007600002",
  "800000000008000003",
  "800000000008400004",
  "800000000008800005",
  "800000000009200006",
  "800000000009600007",
  "800000000010000008",
  "800000000010400009",
  "800000000010800010",
  "800000000011300001",
  "800000000011700002",
  "800000000027700001",
  "800000000028100002",
  "800000000028500003",
  "800000000028900004",
  "800000000029300005",
  "800000000029700006",
  "800000000030100007",
  "800000000030500008",
  "800000000030900009",
  "800000000031300010",
  "800000000031800001",
  "800000000032200002",
  "800000000047700010",
  "800000000048200001",
  "800000000048600002",
  "800000000049000003",
  "800000000049400004",
  "800000000049800005",
  "800000000050200006",
  "800000000051000008",
  "800000000051400009",
  "800000000051800010",
  "800000000052300001",
  "800000000052700002",
  "800000000068200010",
  "800000000068700001",
  "800000000069100002",
  "800000000069500003",
  "800000000069900004",
  "800000000070300005",
  "800000000070700006",
  "800000000071100007",
  "800000000071500008",
  "800000000071900009",
  "800000000072800001",
  "800000000073200002",
  "800000000089200001",
  "800000000089600002",
  "800000000090000003",
  "800000000090400004",
  "800000000090800005",
  "800000000091200006",
  "800000000091600007",
  "800000000092000008",
  "800000000092400009",
  "800000000093300001",
  "800000000093700002",
  "800000000109200010",
  "800000000109700001",
  "800000000110100002",
  "800000000110900004",
  "800000000111300005",
  "800000000111700006",
  "800000000112100007",
  "800000000112900009",
  "800000000113300010",
  "800000000113800001",
  "800000000114200002",
  "800000000130200001",
  "800000000130600002",
  "800000000131800005",
  "800000000132600007",
  "800000000133000008",
  "800000000133400009",
  "800000000133800010",
  "800000000134300001",
  "800000000134700002",
  "800000000150200010",
  "800000000150700001",
  "800000000151100002",
  "800000000151500003",
  "800000000152300005",
  "800000000152700006",
  "800000000153100007",
  "800000000153900009",
  "800000000154300010",
  "800000000154800001",
  "800000000155200002",
  "800000000170700010",
  "800000000171200001",
  "800000000171600002",
  "800000000172400004",
  "800000000172800005",
  "800000000173200006",
  "800000000173600007",
  "800000000174000008",
  "800000000174400009",
  "800000000174800010"
]


export default function Clusters({ clusterParams, handleAddClusterParam }) {
  console.log(clusterParams)
  const location = useLocation();
  const classes = useStyles();

  const [columns, setColumns] = React.useState([
    { id: 'cluster', label: 'Cluster', minWidth: 170 },
    { id: 'numCase', label: 'Total Case', minWidth: 100 },
  ]);
  const [actions, setActions] = React.useState([{
    "table": "EKPO_parquet",
    "column": "_CASE_KEY",
    "action": ""
  }])
  const [clusterId, setClusterId] = React.useState()
  const [mapColName, setMapColName] = React.useState()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(true)
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
      if (clusterParams[i]['clusterId'] == 'None')
        return clusterParams[i]['column']
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
          "cluster_id": e.clusterId
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
    console.log(breadcrumbs)
    generateBreadcrumb()
  }, [clusterParams])

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
        return { id: col, label: getColumnName(col), minWidth: 100 }
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
  const handleFurtherClustering = (col) => {
    handleAddClusterParam(col, clusterId, true)
  }
  const handleAddAction = (action) => {
    setActions(prev => [...prev, action])
  }
  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Link underline="hover" key="1" color="inherit">
      Start
    </Link>,
  ]);

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
            <ActionPanel setAction={handleAddAction} />
          </Grid>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
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
        </Grid>

        {clusterId ?
          <Grid container item xs={4} md={4} className={classes.drawer}>
            <ClusterDetail cases={fakeCaseIDs} />
            <FurtherClustering handleFurtherClustering={handleFurtherClustering} />
          </Grid>
          : ""}
      </Grid>
    );
}