import { Link as RouterLink, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();
  return (
    <nav className="nav-bar">
      <RouterLink to="/" className={`nav-link${location.pathname === '/' ? ' nav-link-active' : ''}`}>Shortener</RouterLink>
      <span className="nav-sep">/</span>
      <RouterLink to="/stats" className={`nav-link${location.pathname === '/stats' ? ' nav-link-active' : ''}`}>Stats</RouterLink>
    </nav>
  );
}

export default NavBar; 