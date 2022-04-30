import { Grid } from "@mui/material";
import { Tabs } from "@mui/material";
import { Tab } from "@material-ui/core";
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tabs: {
        width: '100%'
    }
}));

const ClusterDetail = () => {
    const classes = useStyles();
    const [value, setValue] = useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Grid container>
            <Grid container>
                <Tabs value={value} onChange={handleChange} variant={'fullWidth'} className={classes.tabs}>
                    <Tab label="Item1" value={1}/>
                    <Tab label="Item2"  value={2}/>
                    <Tab label="Item3"  value={3}/>
                </Tabs>
            </Grid>
            <div>
                Item {value}
            </div>
        </Grid>
    )
}

export default ClusterDetail;