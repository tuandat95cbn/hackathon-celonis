import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import CaseStat from "./CaseStat";
import clsx from "clsx";
import TimeDistribution from "./TimeDistribution";
import Typography from "@material-ui/core/Typography";
import MyTree from "./MyTree";

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

const timeData = [
    {
        "id": "japan",
        "color": "hsl(175, 70%, 50%)",
        "data": [
            {
                "x": 1,
                "y": 8
            },
            {
                "x": 2,
                "y": 57
            },
            {
                "x": 3,
                "y": 222
            },
            {
                "x": 4,
                "y": 274
            },
            {
                "x": 5,
                "y": 284
            },
            {
                "x": 6,
                "y": 190
            },
            {
                "x": 7,
                "y": 188
            },
            {
                "x": 8,
                "y": 208
            },
            {
                "x": 9,
                "y": 292
            },
            {
                "x": 10,
                "y": 114
            },
            {
                "x": 11,
                "y": 190
            },
            {
                "x": 12,
                "y": 270
            }
        ]
    }
];

const treeData = {
    name: 'CEO',
    children: [
        {
            name: 'Manager',
            attributes: {
                department: 'Production',
            },
            children: [
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Fabrication',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Assembly',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};
const ThirdTab = () => {
    const classes = useStyles();
    return (
        <Grid container direction={'row'} className={classes.root}>
            <Grid container className={classes.nonGraphContainer}>
                <Grid container item xs={6}>
                    <Grid item xs={12} className={clsx(classes.borderBottom, classes.borderTop, classes.small)}>
                        <CaseStat data={30} />
                    </Grid>
                    <Grid item xs={12} className={clsx(classes.borderBottom, classes.small)}>
                        <CaseStat data={30} />
                    </Grid>
                    <Grid item xs={12} className={clsx(classes.borderBottom, classes.small)}>
                        <CaseStat data={30} />
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
                <TimeDistribution data={timeData} />
            </Grid>
        </Grid>
    )
}

export default ThirdTab;