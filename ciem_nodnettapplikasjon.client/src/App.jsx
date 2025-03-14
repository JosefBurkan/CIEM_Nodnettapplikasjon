import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './index.css'
import NavBar from './components/NavBar/NavBar.jsx';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import KHN from './pages/KHN/KHNnettverk.jsx';
import Actors from './pages/Actors/Actors.jsx';
import ActorsList from './pages/Actors/ActorsList.jsx';
import ActorInfo from './pages/Actors/ActorInfo.jsx';

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
          <Route path="/KHN" element={<KHN/>}/>
          <Route path="/actors" element={<Actors/>}/> 
          <Route path="/actorsList" element={<ActorsList/>}/>
          <Route path="/actorInfo" element={<ActorInfo/>}/>
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

export default App;