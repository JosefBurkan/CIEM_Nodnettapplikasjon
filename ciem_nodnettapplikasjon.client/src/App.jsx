import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import KHSnettverk from './pages/KHS/KHSnettverk.jsx';
import Actors from './pages/Actors/Actors.jsx';

function Layout() {
  const location = useLocation();
  const hideNavBar = location.pathname === "/"; // Hide NavBar on Login Page

  return (
    <>
      {!hideNavBar && <NavBar />} {/* Hide NavBar when on Login */}
      <div className="pageContainer">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/krisehandterings-nettverk" element={<KHSnettverk />} /> {/* ✅ Fixed route */}
          <Route path="/actors" element={<Actors />} />
          <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Redirect invalid paths to Dashboard */}
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
