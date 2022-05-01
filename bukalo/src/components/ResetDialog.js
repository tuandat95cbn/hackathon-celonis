import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {API_URL} from '../constant'
import axios from 'axios';
import TextField from '@mui/material/TextField';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ResetDialog({open, handleReset, handleClose}) {
  const handleSubmit = () => {
    handleReset(column, epls, minpts)
    handleClose()
  };

  const [column, setColumn] = React.useState('');
  const [epls, setEpls] = React.useState()
  const [minpts, setMinpts] = React.useState()
  const [candidates, setCandidates] = React.useState([])
  const [isDisable, setIsDisable] = React.useState(true);
  const handleChangeEpls = (event) => {
    setEpls(event.target.value)
  }
  const handleChangeMinpts = (event) => {
    setMinpts(event.target.value)
  }
  const handleChange = (event) => {
    setColumn(event.target.value)
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
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle> Please enter column, epls, and minpts:</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
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
          </FormControl>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isDisable} onClick={handleSubmit}>Submit</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

