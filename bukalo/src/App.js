
import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/home";
import Clusters from "./components/clusters";
import ClusterDetail from './components/ClusterDetail';

function App() {
  const [historyCluster,setHistoryCluster] = React.useState({"1":"cluster"})
  const [clusterParams,setClusterParams] = React.useState([])
  const handleAddClusterParam=(col, clusterId, isThird=false)=>{
    console.log(isThird)
    if (!isThird) setClusterParams(prev => [...prev,{"column":col,"clusterId":clusterId}])
    else {
      const newClusterParams=[...clusterParams]
      newClusterParams[newClusterParams.length-1]={"column":clusterParams[clusterParams.length-1]['column'],"clusterId":clusterId}
      newClusterParams.push({"column":col,"clusterId":"None"})
      setClusterParams(newClusterParams)
    }
  }
  return (
    <BrowserRouter>
      <Routes>
      <Route exact  path="/" element={<Home handleAddClusterParam={handleAddClusterParam}   />} />
      <Route path="cluster" element={<Clusters clusterParams={clusterParams} handleAddClusterParam={handleAddClusterParam}/>} />
      <Route path="test" element={<ClusterDetail />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
