import {Grid} from "@material-ui/core";
import MyTree from "./MyTree";
import * as React from 'react';
import {CircularProgress} from '@material-ui/core'
import {useState, useEffect} from "react";
import {API_URL} from "../../constant";
import axios from "axios";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        height: '90%'
    }
});
const FirstTab = ({cases}) => {
    const [isLoading, setIsLoading] = React.useState(0)
    const [treeData, setTreeData] = useState({});
    const classes = useStyles();
    useEffect(() => {
        const postBody = cases;
        axios.post(API_URL + 'cluster-ptree', postBody).then(res => (res.data)).then(res => {
            setTreeData(res);
            setIsLoading(prev => prev + 1)
        });
    }, [cases]);
    React.useEffect(() => {
        setIsLoading(0)
    }, [cases])

    if (isLoading < 1) return (
        <div style={{'width': "100%", "textAlign": 'center', marginTop: 30}}>
            <CircularProgress />
        </div>

    )
    return (
        <Grid container justifyContent={'center'} className={classes.root}>
            <MyTree data={treeData} />
        </Grid>
    )
}

export default FirstTab;
