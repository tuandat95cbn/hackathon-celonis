import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {API_URL} from '../constant'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import {DATA_SET} from '../constant';
const useStyles = makeStyles((theme) => ({
  box_center: {
    marginTop: '400px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
export default function Home({handleAddClusterParam}) {
  const classes = useStyles()
  const [column, setColumn] = React.useState('');
  const [isDisable, setIsDisable] = React.useState(true);
  const handleChange = (event) => {
    setColumn(event.target.value)
  }
  const [epls,setEpls] = React.useState()
  const [minpts,setMinpts] = React.useState()
  const [candidates, setCandidates] = React.useState([])
  let navigate = useNavigate();
  const handleClick = (event) => {
    handleAddClusterParam(column, "None")
    navigate("/cluster");
  }
  useEffect(() => {
    if (column) setIsDisable(false)
    else setIsDisable(true)
  }, [column]);
  const handleChangeEpls=(event)=>{
    setEpls(event.target.value)
  }
  const handleChangeMinpts=(event)=>{
    setMinpts(event.target.value)
  }
  useEffect(() => {
    axios.get(API_URL + "table/columns")
      .then(function (response) {
        setCandidates(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className={classes.box_center}>
      <Box sx={{
        width: 500,
        height: 500,
        backgroundColor: 'primary.white',
      }}
        justifyContent="center"
      >
        <Typography align="center" variant="h5" component="h5">
          Bukalo
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Column</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={column}
            label="Age"
            margin="normal"
            onChange={handleChange}
          >
            {candidates.map((candidate) =>
              <MenuItem key={"home" + candidate} value={candidate}>{candidate}</MenuItem>
            )

            }
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="epls"
            label="Epls"
            defaultValue={2}
            value={minpts}
            margin="normal"
            onChange={handleChangeMinpts}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="epls"
            label="Minpts"
            defaultValue={300}
            value={epls}
            margin="normal"
            onChange={handleChangeEpls}
          />
          <Button disabled={isDisable} onClick={handleClick}>Go</Button>
        </FormControl>
      </Box>
    </div>
  )
}
