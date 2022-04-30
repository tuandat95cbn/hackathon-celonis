
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
  return (
    <BrowserRouter>
      <Routes>
      <Route exact  path="/" element={<Home  />} />
      <Route path="cluster" element={<Clusters historyCluster={historyCluster} setHistoryCluster={setHistoryCluster} />} />
      <Route path="test" element={<ClusterDetail />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
