import * as React from 'react';
import Paper from '@mui/material/Paper';
import {Breadcrumbs, Grid, Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {API_URL} from '../constant'
import axios from 'axios';
export default function ActionPanel({setAction}) {
  const [table, setTable] = React.useState("_CEL_P2P_ACTIVITIES_EN_parquet")
  const [column, setColumn] = React.useState()
  const [aggregate, setAggregate] = React.useState()
  const [newColName, setNewColName] = React.useState()
  const [columns, setColumns] = React.useState([])
  const handleChangeTable = (event) => {
    setTable(event.target.value);
  };

  const handleChangeColumn = (event) => {
    setColumn(event.target.value);
  };
  const handleChangeAggregate = (event) => {
    setAggregate(event.target.value);
  };
  const handleClick = (event) => {
    if (newColName != null && newColName !="" && newColName !=undefined)
    setAction({
      "table":table,
      "action":aggregate,
      "column":column,
      "newName":newColName
    })
    else {
    setAction({
      "table":table,
      "action":aggregate,
      "column":column,
    })  }
    //setTable()
    //setAction()
    //setNewColName()
  };
  const handleChangeNewName = (event) => {
    setNewColName(event.target.value);
  };
  React.useEffect(() => {
    axios.get(API_URL + "table/columns?type=all")
      .then(function (response) {
        setColumns(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])
  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <InputLabel id="table-input-label">Table</InputLabel>
        <Select
          labelId="table-input-label"
          id="table-input"
          value={table}
          onChange={handleChangeTable}
          disabled={true}
          label="table"
        >
          <MenuItem value="_CEL_P2P_ACTIVITIES_EN_parquet">_CEL_P2P_ACTIVITIES_EN_parquet</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <InputLabel id="column-input-label">Column</InputLabel>
        <Select
          labelId="column-input-label"

          id="column-input"
          value={column}
          onChange={handleChangeColumn}
          label="Columns"
        >
          {columns.map((col) => {


            return (<MenuItem value={col}>{col}</MenuItem>)
          })}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <InputLabel id="action-input-label">Action</InputLabel>
        <Select
          labelId="action-input-label"
          id="action-input"
          value={aggregate}
          onChange={handleChangeAggregate}
          label="Action"
        >
          <MenuItem value="avg">Average</MenuItem>
          <MenuItem value="sum">Sum</MenuItem>
          <MenuItem value="agg">Aggregate</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <TextField
          id="outlined-required"
          label="New Name"
    variant="standard"
          onChange={handleChangeNewName}
        />
      </FormControl>

      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <Button color="primary" variant="contained" onClick={handleClick}> Add </Button>
    </FormControl>
    </Paper>
  );
}
