import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HIDDEN_ROUTES = ['/admin', '/login'];

function Footer() {
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    if (HIDDEN_ROUTES.includes(location.pathname)) return null;

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-top">
                    <div>
                        <div className="footer-brand">⚡ DANGER KISS</div>
                        <p className="footer-desc">
                            A energia do rock clássico ao vivo. Covers fiéis com paixão e intensidade — do nacional ao internacional.
                        </p>
                        <div className="social-links">
                            {/* Instagram */}
                            <a href="https://www.instagram.com/dangerkisscover/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram" title="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a href="https://www.youtube.com/@dangerkisscover5240" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube" title="YouTube">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a href="https://www.facebook.com/dangerkisscover/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook" title="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>
                            {/* Spotify */}
                            {/* <a href="#" className="social-link" aria-label="Spotify" title="Spotify" onClick={e => e.preventDefault()}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M8 13.5a6.5 6.5 0 0 1 8 0"/>
                                    <path d="M7 10.5a9 9 0 0 1 10 0"/>
                                    <path d="M9 16.5a4 4 0 0 1 6 0"/>
                                </svg>
                            </a> */}
                        </div>
                    </div>

                    <div>
                        <div className="footer-col-title">Navegação</div>
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <Link to="/sobre">Sobre a Banda</Link>
                            <Link to="/agenda">Agenda de Shows</Link>
                            <Link to="/galeria">Galeria de Fotos</Link>
                        </div>
                    </div>

                    <div>
                        <div className="footer-col-title">Contato</div>
                        <div className="footer-links">
                            <a href="mailto:dangerkisscover@gmail.com">dangerkisscover@gmail.com</a>
                            <a href="tel:+5511967284008">+55 (11) 96728-4008</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copy">
                        © {currentYear} <span>Danger Kiss Cover</span>. Todos os direitos reservados.
                    </p>
                    <p className="footer-copy">
                        Feito com 🤘 e muito rock
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;