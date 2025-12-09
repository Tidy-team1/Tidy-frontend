import './App.css';
import { useState } from 'react';
import Topbar from './component/Topbar.jsx';
import Login from './component/Login.jsx';
import Logo from './component/Logo.jsx';
import Upload from './component/Upload.jsx';
import SelectReview from './component/SelectReview.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReviewPage from './component/ReviewPage.jsx';
import CreateTeam from './component/CreateTeam.jsx';
import PersonalSpace from './component/PersonalSpace.jsx';
import TeamSpace from './component/TeamSpace.jsx';

function App() {
  let post = '불러온 API 저장';
  const [showLogin, setShowLogin] = useState(false);

  return (
    <BrowserRouter>
      <div className="app">
        <Topbar onLoginClick={() => setShowLogin(true)} />
        {showLogin && <Login onClose={() => setShowLogin(false)} />}{' '}
        {/*showLogin이 true일 때 <Login/>띄우기*/}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Logo />
                <Upload />
              </>
            }
          />
          <Route
            path="/createTeam"
            element={
              <>
                <Logo />
                <CreateTeam />
              </>
            }
          />
          <Route
            path="/select"
            element={
              <>
                <Logo />
                <SelectReview />
              </>
            }
          />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/personalSpace" element={<PersonalSpace />} />
          <Route path="/teamSpace" element={<TeamSpace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
