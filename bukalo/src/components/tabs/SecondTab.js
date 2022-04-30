import { Grid } from "@material-ui/core"
import Donut from "./Donut"
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { API_URL } from '../../constant'
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tabs: {
        width: '100%'
    },
    donutContainer: {
        width: '500px',
        height: '500px'
    },
    formContainer: {
        marginTop: '20px'
    },
}));



const data = [
    {
        "id": "css",
        "label": "css",
        "value": 54
    },
    {
        "id": "lisp",
        "label": "lisp",
        "value": 414
    },
    {
        "id": "rust",
        "label": "rust",
        "value": 307
    },
    {
        "id": "hack",
        "label": "hack",
        "value": 260
    },
    {
        "id": "go",
        "label": "go",
        "value": 459
    },
    {
        "id": "sass",
        "label": "sass",
        "value": 245
    },
    {
        "id": "erlang",
        "label": "erlang",
        "value": 267
    },
    {
        "id": "test",
        "label": "test",
        "value": 900
    }
];

const SecondTab = () => {
    const classes = useStyles();
    const [column, setColumn] = useState('');
    const [candidates, setCandidates] = useState([]);

    const handleChange = (event) => {
        setColumn(event.target.value)
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
        <Grid container justifyContent={'center'}>
            <Grid item xs={7} className={classes.formContainer}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Column</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={column}
                        onChange={handleChange}
                    >
                        {
                            candidates.map((candidate) =>
                                <MenuItem value={candidate}>{candidate}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid container justifyContent={'center'}
                className={classes.donutContainer} xs={6}>
                <Donut data={data} />
            </Grid>
        </Grid>
    )
}

export default SecondTab