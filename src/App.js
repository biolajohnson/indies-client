import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ContentPage from './pages/ContentPage';
import ArtistPage from './pages/ArtistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OnboardingReturnPage from './pages/OnboardingReturnPage';

function Nav() {
  const { filmmaker, logout } = useAuth();
  return (
    <nav style={{ borderBottom: '1px solid #eee', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', color: '#222' }}>
        Indies
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem' }}>
        {filmmaker ? (
          <>
            <Link to="/dashboard" style={{ color: '#222', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#777', fontSize: '0.9rem' }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#222', textDecoration: 'none' }}>Log in</Link>
            <Link to="/register" style={{ padding: '0.4rem 0.9rem', background: '#222', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/content/:id" element={<ContentPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboard/complete" element={<OnboardingReturnPage />} />
          <Route path="/onboard/refresh" element={<OnboardingReturnPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
