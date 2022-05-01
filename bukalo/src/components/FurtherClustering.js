import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {Paper} from '@mui/material';
import React, {useState, useEffect} from 'react';
import {Grid} from '@mui/material';
import {makeStyles} from '@material-ui/core/styles';

import {API_URL} from '../constant'
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
        handleFurtherClustering(column)
    }

    return (
        <Grid container justifyContent={'center'} alignContent={'space-around'} className={classes.root}>
            <Grid item xs={12}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={column}
                    onChange={handleChange}
                    className={classes.select_box}
                >
                    {
                        availableColumns.map((columnName) => (
                            <MenuItem key={"further"+columnName} value={columnName}>{columnName}</MenuItem>
                        ))
                    }
                </Select>
            </Grid>
            <Grid container item xs={4} justifyContent={'center'}>
                <Button disabled={isButtonDisable} variant="contained" color="primary" onClick={handleClick}>Cluster</Button>
            </Grid>
        </Grid>
    )
}

export default FurtherClustering
