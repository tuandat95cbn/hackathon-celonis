import Grid from "@material-ui/core/Grid";
import * as React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CaseStat from "./CaseStat";
import clsx from "clsx";
import TimeDistribution from "./TimeDistribution";
import Typography from "@material-ui/core/Typography";
import MyTree from "./MyTree";
import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../../constant";
import {CircularProgress} from '@material-ui/core'

const useStyles = makeStyles({
    borderTop: {
        borderTop: "3px solid #F5F5F5"
    },
    borderLeft: {
        borderLeft: "3px solid #F5F5F5"
    },
    borderRight: {
        borderRight: "3px solid #F5F5F5"
    },
    borderBottom: {
        borderBottom: "3px solid #F5F5F5"
    },
    root: {
        height: '80vh'
    },
    small: {
        height: '33.33333%'
    },
    graphContainer: {
        height: '40%',
        position: 'relative'
    },
    nonGraphContainer: {
        height: '60%'
    },
    graphText: {
        top: 5,
        position: 'absolute',
    },
    treeTitle: {
        height: '10%'
    },
    treeContainer: {
        height: '90%'
    }
});

const total_cases = 279000;
const total_events = 1310947;
const total_variants = 21;

// const timeData = [
//     {
//         "id": "japan",
//         "color": "hsl(175, 70%, 50%)",
//         "data": [
//             {
//                 "x": 1,
//                 "y": 8
//             },
//             {
//                 "x": 2,
//                 "y": 57
//             },
//             {
//                 "x": 3,
//                 "y": 222
//             },
//             {
//                 "x": 4,
//                 "y": 274
//             },
//             {
//                 "x": 5,
//                 "y": 284
//             },
//             {
//                 "x": 6,
//                 "y": 190
//             },
//             {
//                 "x": 7,
//                 "y": 188
//             },
//             {
//                 "x": 8,
//                 "y": 208
//             },
//             {
//                 "x": 9,
//                 "y": 292
//             },
//             {
//                 "x": 10,
//                 "y": 114
//             },
//             {
//                 "x": 11,
//                 "y": 190
//             },
//             {
//                 "x": 12,
//                 "y": 270
//             }
//         ]
//     }
// ];

// const treeData = {
//     name: 'CEO',
//     children: [
//         {
//             name: 'Manager',
//             attributes: {
//                 department: 'Production',
//             },
//             children: [
//                 {
//                     name: 'Foreman',
//                     attributes: {
//                         department: 'Fabrication',
//                     },
//                     children: [
//                         {
//                             name: 'Worker',
//                         },
//                     ],
//                 },
//                 {
//                     name: 'Foreman',
//                     attributes: {
//                         department: 'Assembly',
//                     },
//                     children: [
//                         {
//                             name: 'Worker',
//                         },
//                     ],
//                 },
//             ],
//         },
//     ],
// };
const ThirdTab = ({cases}) => {
    const [isLoading, setIsLoading] = React.useState(0)
    const classes = useStyles();
    const [casesNumber, setCases] = useState(0);
    const [eventsNumber, setEvents] = useState(0);
    const [variantsNumber, setVariants] = useState(0);
    const [treeData, setTreeData] = useState({});

    useEffect(() => {
        const postBody = cases;
        axios.post(API_URL + '/stat/basic', postBody).then(res => (res.data)).then(res => {
            setCases(res.cases);
            setEvents(res.events);
            setVariants(res.variants);
            setIsLoading(prev => prev + 1)
        });
    }, [cases]);

    useEffect(() => {
        const postBody = cases;
        axios.post(API_URL + '/stat/most-com-var', postBody).then(res => (res.data)).then(res => {
            let var_arr = res.variant;
            var_arr.push('END');
            var_arr.unshift('START');
            let x = {};
            let setTree = x;
            for (let i = 0; i < var_arr.length; i++) {
                setTree["name"] = var_arr[i];
                if (i < var_arr.length - 1) {
                    setTree["children"] = [{}];
                    setTree = setTree.children[0];
                }
            }
            setTreeData(x)
            setIsLoading(prev => prev + 1)
        });
    }, [cases]);
    React.useEffect(() => {
        setIsLoading(0)
    }, [cases])
    if (isLoading < 2) return (
        <div style={{'width': "100%", "textAlign": 'center', marginTop: 30}}>
            <CircularProgress />
        </div>

    )
    else
        return (
            <Grid container direction={'row'} className={classes.root}>
                <Grid container className={classes.nonGraphContainer}>
                    <Grid container item xs={6}>
                        <Grid item xs={12} className={clsx(classes.borderBottom, classes.borderTop, classes.small)}>
                            <CaseStat data={casesNumber / total_cases} text={casesNumber + ' cases of ' + total_cases + ' cases'} />
                        </Grid>
                        <Grid item xs={12} className={clsx(classes.borderBottom, classes.small)}>
                            <CaseStat data={eventsNumber / total_events} text={`${eventsNumber} events of ${total_events} events`} />
                        </Grid>
                        <Grid item xs={12} className={clsx(classes.borderBottom, classes.small)}>
                            <CaseStat data={variantsNumber / total_variants} text={`${variantsNumber} variants of ${total_variants} variants`} />
                        </Grid>
                    </Grid>
                    <Grid item xs={6} className={clsx(classes.borderLeft, classes.borderTop, classes.borderBottom)}>
                        <Grid container justifyContent={'center'} className={classes.treeTitle}>
                            <Typography>Most Common Variant</Typography>
                        </Grid>
                        <Grid item xs={12} className={clsx(classes.treeContainer)}>
                            <MyTree data={treeData} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className={clsx(classes.borderBottom, classes.graphContainer)}>
                    <Grid container item xs={12} justifyContent={'center'} className={classes.graphText}>
                        <Typography>Average Throughput Time: 20 days</Typography>
                    </Grid>
                    <TimeDistribution cases={cases} />
                </Grid>
            </Grid>
        )
}

export default ThirdTab;
