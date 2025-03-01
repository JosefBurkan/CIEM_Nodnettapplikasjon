import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './index.css'
import NavBar from './components/NavBar/NavBar.jsx';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

function Layout(){
  const location = useLocation();
  const hideNavBar = location.pathname === "/";
  return(
    <>
      {!hideNavBar && <NavBar/>} {/* Skjuler NavBar når brukeren på Login siden */}
    <div className="pageContainer">
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/khn" element={<Dashboard/>}/>
          <Route path="*" element={<Navigate to="/dashboard"/>}/> {/* Sender brukeren til Dashboard ved ugyldig URL*/}
        </Routes>
    </div>
    </>
  );
}

function App(){

  return(
    <Router>
      <Layout/>
    </Router>
  );
}

export default App

