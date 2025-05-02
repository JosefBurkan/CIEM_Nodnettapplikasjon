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
import NodeNetworks from './pages/NodeNetworks/NodeNetworks.jsx';
import Actors from './pages/Actors/Actors.jsx';
import ActorInfo from './pages/Actors/ActorInfo.jsx';
import GovActors from './pages/Actors/GovActors.jsx';
import VolActors from './pages/Actors/VolActors.jsx';
import AllActors from './pages/Actors/AllActors.jsx';
import PrivateActors from './pages/Actors/PrivateActors.jsx';
import LiveNetwork from './pages/NodeNetworks/Live/LiveNetwork.jsx';
import CreateActor from './pages/Actors/CreateActor.jsx';
import DatabaseOrg from './pages/DatabaseSearch/DatabaseOrg';
import ActorsListWrapper from './pages/DatabaseSearch/ActorsListWrapper';
import NetworkArchive from './pages/NodeNetworks/Archive/NetworkArchive.jsx';
import NewNetwork from './pages/NodeNetworks/NewNetwork/NewNetwork.jsx';
import AboutActor from './pages/Actors/AboutActors/AboutActor.jsx';
import QRcodePage from './pages/NodeNetworks/QRcode/QRcodePage.jsx';
import CivilianForm from './pages/NodeNetworks/QRcode/CivilianForm.jsx';
import CivilianPage from './pages/NodeNetworks/CivilianPage/CivilianPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  const location = useLocation();
    const hideNavBarRoutes = ['/civilianForm', '/civilianPage', '/login'];
    const hideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <>
          {!hideNavBar && <NavBar />}
          <div className="pageContainer">
        <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
          <Route path="/nodeNetworks" element={<NodeNetworks />} />
                  <Route path="/actors" element={<Actors />} />
                  <Route path="/qr-code" element={<QRcodePage />} />
                  <Route path="/civilianForm" element={<CivilianForm />} />
                  <Route path="/civilianPage" element={<CivilianPage />} />
          <Route path="/actorInfo" element={<ActorInfo />} />
          <Route path="/actorsGov" element={<GovActors />} />
          <Route path="/actorsVol" element={<VolActors />} />
          <Route path="/actorsAll" element={<AllActors />} />
          <Route path="/actorsPrivate" element={<PrivateActors />} />
          <Route path="/liveNetwork/:networkId" element={<LiveNetwork />} />
          <Route path="/newNetwork" element={<NewNetwork />} />
          <Route path="/createActor" element={<CreateActor />} />
          <Route path="/searchDatabase" element={<DatabaseOrg />} />
          <Route path="/searchDatabase/:category" element={<ActorsListWrapper />} />
          <Route path="/networkArchive" element={<NetworkArchive />} />
          <Route path="/actor/:id" element={<AboutActor />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
              <ToastContainer />
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
