import { useState } from 'react';
import { Copy, BarChart3, ExternalLink, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

function ShortenerPage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setError('');
    setShortUrl(null);
    setCreatedId(null);
    if (!originalUrl) {
      setError('Please enter a URL.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shorturls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create short URL');
      setShortUrl(data.shortUrl);
      setCreatedId(data.id);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError('Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="main-card">
      <div className="input-section">
        <label className="input-label">Enter your long URL</label>
        <div className="input-row">
          <div className="input-icon-wrap">
            <Globe className="input-icon" />
            <input
              type="url"
              placeholder="https://example.com/very-long-url"
              className="url-input"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="shorten-btn"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </div>
      {shortUrl && (
        <div className="shorturl-result">
          <div className="shorturl-row">
            <h3 className="shorturl-title">Your short URL is ready!</h3>
            <button
              onClick={() => navigate(`/stats?id=${createdId}`)}
              className="stats-btn"
            >
              <BarChart3 className="icon-bar" />
              View Stats
            </button>
          </div>
          <div className="shorturl-link-row">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shorturl-link"
            >
              {shortUrl}
            </a>
            <button
              onClick={copyToClipboard}
              className="copy-btn"
              title="Copy to clipboard"
            >
              <Copy className="icon-copy" />
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="open-btn"
              title="Open in new tab"
            >
              <ExternalLink className="icon-ext" />
            </a>
          </div>
          {copied && (
            <p className="copied-msg">✓ Copied to clipboard!</p>
          )}
        </div>
      )}
      {error && (
        <div className="error-msg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default ShortenerPage; 