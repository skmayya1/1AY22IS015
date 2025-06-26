import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "./App.css";
import NavBar from './components/NavBar';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';

function App() {
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