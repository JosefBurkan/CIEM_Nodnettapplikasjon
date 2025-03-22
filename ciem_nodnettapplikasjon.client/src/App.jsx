import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import KHSnettverk from './pages/KHN/KHNnettverk.jsx';
import Actors from './pages/Actors/Actors.jsx';
import ActorsList from './components/ActorsList/ActorsList.jsx';
import ActorInfo from './pages/Actors/ActorInfo.jsx';
import GovActors from './pages/Actors/GovActors.jsx';
import VolActors from './pages/Actors/VolActors.jsx';
import AllActors from './pages/Actors/AllActors.jsx';
import PrivateActors from './pages/Actors/PrivateActors.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function Layout() {
  const location = useLocation();
  const hideNavBar = location.pathname === "/"; // Hide NavBar on Login Page
  return (
    <>
      {!hideNavBar && <NavBar />}
      <div className="pageContainer">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/krisehandterings-nettverk" element={<KHSnettverk />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actorsList" element={<ActorsList />} />
          <Route path="/actorInfo" element={<ActorInfo />} />
          <Route path="/actorsGov" element={<GovActors />} />
          <Route path="/actorsVol" element={<VolActors />} />
          <Route path="/actorsAll" element={<AllActors />} />
          <Route path="/actorsPrivate" element={<PrivateActors />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                {/* Any other routes */}
            </Routes>
        </Router>
    );
}


export default App;
