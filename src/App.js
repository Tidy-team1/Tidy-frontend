import './App.css';
import { useState } from 'react';
import Topbar from './component/Topbar.jsx';
import Login from './component/Login.jsx';
import Logo from './component/Logo.jsx';
import Upload from './component/Upload.jsx';
import SelectReview from './component/SelectReview.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReviewPage from './component/ReviewPage.jsx';

function App() {
  let post = '불러온 API 저장';
  const [showLogin, setShowLogin] = useState(false);

  return (
    <BrowserRouter>
      <div className="app">
        <Topbar onLoginClick={() => setShowLogin(true)} />
        {showLogin && <Login onClose={() => setShowLogin(false)} />}{' '}
        {/*showLogin && <Login/>은 showLogin이 true일 때 <Login/>을 띄운다는 걸 의미*/}
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
            path="/select"
            element={
              <>
                <Logo />
                <SelectReview />
              </>
            }
          />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
