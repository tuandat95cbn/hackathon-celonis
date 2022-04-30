import React, {useState, useEffect} from 'react';
import { useNavigate  } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
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

  let navigate = useNavigate();
  const handleClick = (event) => {
    navigate("/cluster");
  }
  useEffect(() => {
    if (column) setIsDisable(false)
    else setIsDisable(true)
  }, [column]);
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
          <InputLabel id="demo-simple-select-label">Data Set</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={column}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value="activity">Dataset 1</MenuItem>
            <MenuItem value="resources">Dataset 2</MenuItem>
          </Select>
          <Button disabled={isDisable} onClick={handleClick}>Go</Button>
        </FormControl>
      </Box>
    </div>
  )
}
