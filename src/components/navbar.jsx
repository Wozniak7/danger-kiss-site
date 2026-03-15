import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar${scrolled || location.pathname !== '/' ? ' scrolled' : ''}`}>
            <Link to="/" className="navbar-brand">
                ⚡ DANGER KISS
            </Link>

            <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
                <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                <Link to="/sobre" className={isActive('/sobre') ? 'active' : ''}>Sobre</Link>
                <Link to="/agenda" className={isActive('/agenda') ? 'active' : ''}>Agenda</Link>
                <Link to="/galeria" className={isActive('/galeria') ? 'active' : ''}>Galeria</Link>
                <Link to="/login" className={`btn btn-primary navbar-cta${isActive('/login') ? ' active' : ''}`}>
                    Admin
                </Link>
            </div>

            <div
                className="navbar-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
                <span style={{ opacity: menuOpen ? 0 : 1 }} />
                <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </div>
        </nav>
    );
}

export default Navbar;