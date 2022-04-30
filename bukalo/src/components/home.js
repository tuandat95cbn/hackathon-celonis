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
import {DATA_SET} from '../constant';
const useStyles = makeStyles((theme) => ({
  box_center: {
    marginTop: '400px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
export default function Home() {
  const classes = useStyles()
  const [column, setColumn] = React.useState('');
  const [isDisable, setIsDisable] = React.useState(true);
  const handleChange = (event) => {
    setColumn(event.target.value)
  }
  const [candidates, setCandidates] = React.useState([])
  let navigate = useNavigate();
  const handleClick = (event) => {
    navigate("/cluster", {state: {"column": column}});
  }
  useEffect(() => {
    if (column) setIsDisable(false)
    else setIsDisable(true)
  }, [column]);

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
            onChange={handleChange}
          >
            {candidates.map((candidate) =>
              <MenuItem value={candidate}>{candidate}</MenuItem>
            )

            }
          </Select>
          <Button disabled={isDisable} onClick={handleClick}>Go</Button>
        </FormControl>
      </Box>
    </div>
  )
}
