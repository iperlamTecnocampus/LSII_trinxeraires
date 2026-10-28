import './App.css';
import { useAllVideos } from './useAllVideos';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';
import { Profile } from './pages/Profile';
import { VideoPlayback } from './pages/VideoPlayback';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Layout>
        {/* Routes */}
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/watch/:videoId" element={<VideoPlayback />}/>
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
          <h3>Error</h3> <p>{message}</p>
        </div>
      );
    case 'success':
      return (
        <>
          <strong>Videos availables:</strong>
          <ul>
            {value.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </>
      );
  }
  return <div>Idle...</div>;
}

export default App;
