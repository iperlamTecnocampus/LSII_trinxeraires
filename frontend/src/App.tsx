import './App.css';
import { useAllVideos } from './useAllVideos';
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import { Home } from "./pages/Home"

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route index element={<Home />} />
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
