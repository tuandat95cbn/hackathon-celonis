import Grid from "@material-ui/core/Grid";
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";

const useStyles = makeStyles({
    root: {
        position: 'relative'
    },
    text: {
        position: 'absolute',
        top: 10,
        left: 20
    }
});


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    position: 'absolute',
    top: 50,
    left: 20,
    width: 200,
    height: 15,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

const CaseStat = ({data, text}) => {
    const classes = useStyles();
    const [percentage, setPercentage] = useState(data * 100);

    useEffect(() => {
        if (percentage < 1) {
            setPercentage(1);
        }
    }, []);

    return (
        <Grid container className={classes.root}>
            <Typography className={classes.text}>{text}</Typography>
            <BorderLinearProgress variant="determinate" value={percentage} />
        </Grid>
    );
}

export default CaseStat;