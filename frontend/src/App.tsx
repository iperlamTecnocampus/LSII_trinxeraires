import './App.css';

import { useAllVideos } from './useAllVideos';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { Profile } from './pages/Profile';
import { UploadPage } from './pages/UploadPage';
import { VideoPlayback } from './pages/VideoPlayback';

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
                <Route path="/profile" element={<Profile />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route
                  path="/watch/:videoId"
                  element={<VideoPlayback />}
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function ContentApp() {
  const { loading, message, value } = useAllVideos();

  switch (loading) {
    case 'loading':
      return <div>Loading...</div>;

    case 'error':
      return (
        <div>
          <h3>Error</h3>
          <p>{message}</p>
        </div>
      );

    case 'success':
      return (
        <>
          <strong>Videos availables:</strong>
          <ul>
            {value.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      );
  }

  return <div>Idle...</div>;
}

export default App;