import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
//import NavBar from "./components/NavBar";
import "./index.css";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Handle invalid routes */}
      </Routes>
    </Router>
  );
}

export default App;
