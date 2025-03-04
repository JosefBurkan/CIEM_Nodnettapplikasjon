import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './index.css'
import NavBar from './components/NavBar/NavBar.jsx';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Actors from './pages/Actors/Actors.jsx';

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/actors" element={<Actors />} />
            </Routes>
        </Router>
    );
}
export default App
