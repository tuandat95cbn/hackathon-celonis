import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/home";
import Clusters from "./components/clusters";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact  path="/" element={<Home />} />
      <Route path="cluster" element={<Clusters />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
