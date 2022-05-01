import { Grid } from "@mui/material";
import { Tabs } from "@mui/material";
import { Tab } from "@material-ui/core";
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import SecondTab from "./tabs/SecondTab";
import ThirdTab from "./tabs/ThirdTab";
import FirstTab from "./tabs/FirstTab";

const useStyles = makeStyles((theme) => ({
    tabs: {
        width: '100%',
        height: '50px'
    },
    root: {
        height: '90%'
    }
}));

const ClusterDetail = ({cases}) => {
    const classes = useStyles();
    const [value, setValue] = useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Grid container justifyContent={'center'} alignContent={'flex-start'} className={classes.root}>
            <Grid container>
                <Tabs value={value} onChange={handleChange} variant={'fullWidth'} className={classes.tabs}>
                    <Tab label="Basic Stats" value={1} />
                    <Tab label="Process Tree" value={2} />
                </Tabs>
            </Grid>
            {
                function () {
                    if (value === 3) {
                        return (
                            <FirstTab cases={cases}/>
                         )
                    } else if (value === 3) {
                        return (
                            <SecondTab/>
                        )
                    } else {
                        return (
                            <ThirdTab cases={cases} />
                        )
                    }
                }()
            }
        </Grid>
    )
}

export default ClusterDetail;
