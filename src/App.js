import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContentPage from './pages/ContentPage';
import ArtistPage from './pages/ArtistPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content/:id" element={<ContentPage />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
