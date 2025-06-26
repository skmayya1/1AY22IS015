import { useState, useEffect } from 'react';
import { ExternalLink, Globe, Clock, Eye } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

type Stats = {
  id: string;
  originalUrl: string;
  visits: number;
  referers: string[];
  timestamps: string[];
};

function StatsPage() {
  const [statsId, setStatsId] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleFetchStats = async (id?: string) => {
    setError('');
    setStats(null);
    const fetchId = id || statsId;
    if (!fetchId) {
      setError('Please enter a short URL ID.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shorturls/${fetchId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
      setStats(data);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError('Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setStatsId(id);
      handleFetchStats(id);
    }
  }, [location.search]);

  return (
    <div className="main-card">
      <div className="stats-section">
        <h3 className="stats-title">Get URL Statistics</h3>
        <div className="stats-row">
          <input
            type="text"
            placeholder="Enter short URL ID"
            className="stats-input"
            value={statsId}
            onChange={(e) => setStatsId(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={() => handleFetchStats()}
            disabled={loading}
            className="getstats-btn"
          >
            Get Stats
          </button>
        </div>
      </div>
      {error && (
        <div className="error-msg">
          <p>{error}</p>
        </div>
      )}
      {stats && (
        <div className="stats-card">
          <h3 className="stats-main-title">Statistics for {stats.id}</h3>
          <div className="stats-grid">
            <div className="stats-block stats-block-url">
              <h4 className="stats-block-title"><Globe className="icon-stats" />Original URL</h4>
              <p className="stats-block-value">{stats.originalUrl}</p>
            </div>
            <div className="stats-block stats-block-visits">
              <h4 className="stats-block-title"><Eye className="icon-stats" />Total Visits</h4>
              <p className="stats-block-value stats-block-visits-value">{stats.visits}</p>
            </div>
            {stats.referers && stats.referers.length > 0 && (
              <div className="stats-block stats-block-ref">
                <h4 className="stats-block-title"><ExternalLink className="icon-stats" />Referrers</h4>
                <div className="stats-block-list">
                  {stats.referers.map((referer, index) => (
                    <p key={index} className="stats-block-list-item">{referer || 'Direct access'}</p>
                  ))}
                </div>
              </div>
            )}
            {stats.timestamps && stats.timestamps.length > 0 && (
              <div className="stats-block stats-block-time">
                <h4 className="stats-block-title"><Clock className="icon-stats" />Recent Visits</h4>
                <div className="stats-block-list">
                  {stats.timestamps.slice(-5).map((timestamp, index) => (
                    <p key={index} className="stats-block-list-item">{new Date(timestamp).toLocaleString()}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPage; 