import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/navbar';
import Home from './pages/home';
import Sobre from './pages/sobre';
import Galeria from './pages/galeria';
import Agenda from './pages/agenda';
import Login from './pages/login';
import Admin from './pages/admin';
import Footer from './components/footer';
import './index.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;