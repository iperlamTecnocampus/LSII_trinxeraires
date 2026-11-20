import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router';

import { RequireAuth } from './auth/RequireAuth';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { Profile } from './pages/Profile';
import { UploadPage } from './pages/UploadPage';
import { VideoPlayback } from './pages/VideoPlayback';
import { VideoStudioPage } from './pages/VideoStudioPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login without Header or Sidebar */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main application */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route index element={<Home />} />
                <Route path="/about" element={<Home />} />

                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />

                <Route path="/profile/:username" element={<Profile />} />

                <Route
                  path="/upload"
                  element={
                    <RequireAuth>
                      <UploadPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/studio"
                  element={
                    <RequireAuth>
                      <VideoStudioPage />
                    </RequireAuth>
                  }
                />
                <Route path="/watch/:videoId" element={<VideoPlayback />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
