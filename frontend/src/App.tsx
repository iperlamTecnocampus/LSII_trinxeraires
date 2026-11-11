import './App.css';

import { useAllVideos } from './useAllVideos';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { UploadPage } from './pages/UploadPage';
import { VideoPlayback } from './pages/VideoPlayback';
import { VideoStudioPage } from './pages/VideoStudioPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/studio" element={<VideoStudioPage />} />
          <Route path="/watch/:videoId" element={<VideoPlayback />} />
        </Routes>
      </Layout>
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
