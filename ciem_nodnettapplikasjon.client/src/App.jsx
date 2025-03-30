import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import KHSnettverk from './pages/KHN/KHNnettverk.jsx';
import Actors from './pages/Actors/Actors.jsx';
import ActorInfo from './pages/Actors/ActorInfo.jsx';
import GovActors from './pages/Actors/GovActors.jsx';
import VolActors from './pages/Actors/VolActors.jsx';
import AllActors from './pages/Actors/AllActors.jsx';
import PrivateActors from './pages/Actors/PrivateActors.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import LiveKHN from './pages/KHN/Live/LiveKHN.jsx';
import NewActor from './pages/Actors/NewActor.jsx';
import CreateActor from './pages/Actors/CreateActor.jsx';
import DatabaseOrg from './pages/DatabaseSearch/DatabaseOrg';
import ActorsListWrapper from './pages/DatabaseSearch/ActorsListWrapper';
import NettverksArkiv from './pages/KHN/Archive/NettverksArkiv.jsx';
import NewNetwork from './pages/KHN/NewNetwork/NewNetwork.jsx';


function Layout() {
  const location = useLocation();
  const hideNavBar = location.pathname === "/"; 
  return (
    <>
      {!hideNavBar && <NavBar />}
      <div className="pageContainer">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/krisehandterings-nettverk" element={<KHSnettverk />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actorInfo" element={<ActorInfo />} />
          <Route path="/actorsGov" element={<GovActors />} />
          <Route path="/actorsVol" element={<VolActors />} />
          <Route path="/actorsAll" element={<AllActors />} />
          <Route path="/actorsPrivate" element={<PrivateActors />} />
                  <Route path="/liveKHN" element={<LiveKHN />} />
          <Route path="/actorNew" element={<NewActor/>} />
          <Route path = "newNetwork" element={<NewNetwork />} />
          <Route path="/createActor" element={<CreateActor/>} />
                  <Route path="*" element={<Navigate to="/dashboard"/>} />
                  <Route path="/searchDatabase" element={<DatabaseOrg/>} />
                  <Route path="/searchDatabase/:category" element={<ActorsListWrapper />} />
                  <Route path="/nettverks-arkiv" element={<NettverksArkiv />} />
        </Routes>
      </div>
    </>
  );
}



function App() {
  return (
    < Router >
      
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
      </Routes>
        </Router >
    );
}


export default App;
