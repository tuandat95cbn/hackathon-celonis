import Tree from 'react-d3-tree';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
      position: 'relative'
  },
  text: {
      position: 'absolute',
      top: 5,
      left: 20,
      height: '10%'
  },
  tree: {
    position:'absolute',
    bottom:0,
    height: 200,
    //height: '85%'
  },
});

const MyTree = ({data}) => {
    const classes = useStyles();
    return (
         <Tree data={data} orientation="vertical"/> 
    );
}

export default MyTree;