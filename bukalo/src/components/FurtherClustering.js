import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    select_box: {
        width: '100%'
    },
}));

const FurtherClustering = () => {
    const classes = useStyles();
    const defaultAvailableColumns = [123, 456, 677, 3123, 1321, 13213];
    const [column, setColumn] = useState(defaultAvailableColumns[0]);
    const [isButtonDisable, setIsButtonDisable] = useState(false);
    const [availableColumns, setAvailableColumns] = useState(defaultAvailableColumns);

    const handleChange = (event) => {
        setColumn(event.target.value)
    }

    const handleClick = () => {

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
                            <MenuItem value={columnName}>{columnName}</MenuItem>
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
