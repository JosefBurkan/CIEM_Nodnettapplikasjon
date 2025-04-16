import React from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import SamvirkeNettverk from './pages/SamvirkeNettverk/SamvirkeNettverk.jsx';
import Actors from './pages/Actors/Actors.jsx';
import ActorInfo from './pages/Actors/ActorInfo.jsx';
import GovActors from './pages/Actors/GovActors.jsx';
import VolActors from './pages/Actors/VolActors.jsx';
import AllActors from './pages/Actors/AllActors.jsx';
import PrivateActors from './pages/Actors/PrivateActors.jsx';
import LiveNettverk from './pages/SamvirkeNettverk/Live/LiveNettverk.jsx';
import CreateActor from './pages/Actors/CreateActor.jsx';
import DatabaseOrg from './pages/DatabaseSearch/DatabaseOrg';
import ActorsListWrapper from './pages/DatabaseSearch/ActorsListWrapper';
import NettverksArkiv from './pages/SamvirkeNettverk/Archive/NettverksArkiv.jsx';
import NewNetwork from './pages/SamvirkeNettverk/NewNetwork/NewNetwork.jsx';
import AboutActor from './pages/Actors/AboutActors/AboutActor.jsx';
import QRcodePage from './pages/SamvirkeNettverk/QRcode/QRcodePage.jsx';
import QRAccessPage from './pages/SamvirkeNettverk/QRcode/QRAccessPage.jsx';
import SivilSide from './pages/SamvirkeNettverk/SivilSide/SivilSide.jsx';


function Layout() {
    const location = useLocation();

    // Define routes where the NavBar should be hidden
    const hideNavBarRoutes = ['/qr-access', '/civilianPage'];
    const hideNavBar = hideNavBarRoutes.includes(location.pathname);

    return (
        <>
            {/* Conditionally render the NavBar */}
            {!hideNavBar && <NavBar />}
            <div className="pageContainer">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/samvirkeNettverk"
                        element={<SamvirkeNettverk />}
                    />
                    <Route path="/actors" element={<Actors />} />
                    <Route path="/qr-code" element={<QRcodePage />} />
                    <Route path="/qr-access" element={<QRAccessPage />} />
                    <Route path="/civilianPage" element={<SivilSide />} />
                    <Route path="/actorInfo" element={<ActorInfo />} />
                    <Route path="/actorsGov" element={<GovActors />} />
                    <Route path="/actorsVol" element={<VolActors />} />
                    <Route path="/actorsAll" element={<AllActors />} />
                    <Route path="/actorsPrivate" element={<PrivateActors />} />
                    <Route path="/sn/:networkId" element={<LiveNettverk />} />
                    <Route path="/newNetwork" element={<NewNetwork />} />
                    <Route path="/createActor" element={<CreateActor />} />
                    <Route path="/searchDatabase" element={<DatabaseOrg />} />
                    <Route
                        path="/searchDatabase/:category"
                        element={<ActorsListWrapper />}
                    />
                    <Route
                        path="/nettverks-arkiv"
                        element={<NettverksArkiv />}
                    />
                    <Route path="/actor/:id" element={<AboutActor />} />
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
                <Route path="/*" element={<Layout />} />
            </Routes>
        </Router>
    );
}

export default App;
