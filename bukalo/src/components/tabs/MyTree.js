import Tree from 'react-d3-tree';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    position: 'relative'
  },
  rootNodeTree: {
    fill: 'black'
  }
});

const MyTree = ({ data }) => {
  const classes = useStyles();
  return (
    <Tree data={data} orientation="vertical" rootNodeClassName={classes.rootNodeTree}/>
  );
}

export default MyTree;