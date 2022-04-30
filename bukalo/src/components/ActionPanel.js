import * as React from 'react';
import Paper from '@mui/material/Paper';
import {Breadcrumbs, Grid, Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function ActionPanel({}) {
  const [table,setTable] = React.useState()
  const [column,setColumn] = React.useState()
  const [aggregate,setAggregate] = React.useState()
  const [newColName,setNewColName] = React.useState()

  const handleChangeTable = (event) => {
    setTable(event.target.value);
  };
  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <InputLabel id="table-input-label">Table</InputLabel>
        <Select
          labelId="table-input-label"
          id="table-input"
          value={table}
          onChange={handleChangeTable}
          label="table"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
    </FormControl>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <InputLabel id="column-input-label">Column</InputLabel>
        <Select
    labelId="column-input-label"

    id="column-input"
          value={table}
          onChange={handleChangeTable}
          label="Columns"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
    </FormControl>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <InputLabel id="action-input-label">Action</InputLabel>
        <Select
          labelId="action-input-label"
          id="action-input"
          value={table}
          onChange={handleChangeTable}
          label="Action"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
    </FormControl>
      <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
        <InputLabel id="newname-input-label">New Name</InputLabel>
        <Select
          labelId="newname-input-label"
          id="newname-input"
          value={table}
          onChange={handleChangeTable}
          label="New Name"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}
