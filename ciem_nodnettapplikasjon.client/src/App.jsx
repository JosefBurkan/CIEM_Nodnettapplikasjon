import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './index.css'
import NavBar from './components/NavBar/NavBar.jsx';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App(){
  return(
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );

}
export default App

