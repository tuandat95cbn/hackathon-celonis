import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {Paper} from '@mui/material';
import React, {useState, useEffect} from 'react';
import {Grid} from '@mui/material';
import {makeStyles} from '@material-ui/core/styles';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {API_URL} from '../constant'
import Typography from '@mui/material/Typography';
import axios from 'axios';
const useStyles = makeStyles((theme) => ({
    root: {
        height: '10%'
    },
    select_box: {
        width: '100%'
    },
}));

const FurtherClustering = ({handleFurtherClustering}) => {
    const classes = useStyles();
    const [column, setColumn] = useState('');
    const [isButtonDisable, setIsButtonDisable] = useState(false);
    const [availableColumns, setAvailableColumns] = useState([]);

    const [epls, setEpls] = React.useState()
    const [minpts, setMinpts] = React.useState()
    const handleChangeEpls = (event) => {
        setEpls(event.target.value)
    }
    const handleChangeMinpts = (event) => {
        setMinpts(event.target.value)
    }
    const handleChange = (event) => {
        setColumn(event.target.value)
    }

    React.useEffect(() => {
        axios.get(API_URL + "table/columns")
            .then(function (response) {
                setAvailableColumns(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])
    useEffect(() => {
        if (column) setIsButtonDisable(false)
        else setIsButtonDisable(true)
    }, [column]);
    const handleClick = () => {
        handleFurtherClustering(column, epls, minpts)
    }

    return (
        <Grid container justifyContent={'center'} alignContent={'space-around'} className={classes.root}>
            <Typography align="center" variant="h5" component="h5">
                Further Clustering
            </Typography>

            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Column</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={column}
                        onChange={handleChange}
                        className={classes.select_box}
                    >
                        {
                            availableColumns.map((columnName) => (
                                <MenuItem key={"further" + columnName} value={columnName}>{columnName}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id="epls"
                        label="Epls"
                        defaultValue={2}
                        value={epls}
                        margin="normal"
                        onChange={handleChangeEpls}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id="minpts"
                        label="Minpts"
                        defaultValue={300}
                        value={minpts}
                        margin="normal"
                        onChange={handleChangeMinpts}
                    />
                </FormControl>
            </Grid>
            <Grid container item xs={4} justifyContent={'center'}>
                <Button disabled={isButtonDisable} variant="contained" color="primary" onClick={handleClick}>Cluster</Button>
            </Grid>
        </Grid>
    )
}

export default FurtherClustering
