import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import "./App.css";
import NavBar from './components/NavBar';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import { logger } from './utils/logger';

function App() {
  useEffect(() => {
    logger.info('app', 'Application initialized');
    return () => {
      logger.info('app', 'Application shutting down');
    };
  }, []);

  return (
    <Router>
      <div className="app-bg">
        <div className="app-container">
          <NavBar />
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;