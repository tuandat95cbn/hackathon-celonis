import { Grid } from "@material-ui/core";
import MyTree from "./MyTree";
import { useState, useEffect } from "react";
import { API_URL } from "../../constant";
import axios from "axios";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        height: '90%'
    }
});
const FirstTab = ({cases}) => {
    const [treeData, setTreeData] = useState({});
    const classes = useStyles();
    useEffect(() => {
        const postBody = cases;
        axios.post(API_URL + 'cluster-ptree', postBody).then(res => (res.data)).then(res => {
            setTreeData(res);
        });
    }, []);
    return (
        <Grid container justifyContent={'center'} className={classes.root}>
            <MyTree data={treeData}/>
        </Grid>
    )
}

export default FirstTab;