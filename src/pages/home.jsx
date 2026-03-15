import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const proximosShows = [
        { data: 'AGO 15', local: 'Bar do Rock', cidade: 'São Paulo' },
        { data: 'SET 01', local: 'Casa de Shows', cidade: 'Rio de Janeiro' },
        { data: 'SET 20', local: 'Festival da Cidade', cidade: 'Belo Horizonte' },
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) setSubscribed(true);
    };

    return (
        <>
            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        Banda Cover de Rock
                    </div>
                    <h1 className="hero-title text-gradient">
                        DANGER<br />KISS
                    </h1>
                    <p className="hero-subtitle">Cover · Rock Nacional & Internacional</p>
                    <p className="hero-desc">
                        A Danger Kiss é uma banda cover do Kiss, formada por músicos apaixonados que dedicam suas vidas a reviver os maiores momentos do rock nacional e internacional.
                    </p>
                    <div className="hero-actions">
                        <Link to="/agenda" className="btn btn-primary">
                            🎸 Ver Próximos Shows
                        </Link>
                        <Link to="/sobre" className="btn btn-outline">
                            Sobre a Banda
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div>
                            <div className="hero-stat-number">+1000</div>
                            <div className="hero-stat-label">Shows Realizados</div>
                        </div>
                        <div>
                            <div className="hero-stat-number">10+</div>
                            <div className="hero-stat-label">Anos de Estrada</div>
                        </div>
                        <div>
                            <div className="hero-stat-number">4</div>
                            <div className="hero-stat-label">Integrantes</div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <div className="scroll-mouse" />
                    <span>Scroll</span>
                </div>
            </section>

            {/* ===== SHOWS STRIP ===== */}
            <div className="shows-strip">
                <div className="shows-strip-inner">
                    <span className="shows-strip-label">🔥 Próximos Shows</span>
                    {proximosShows.map((show, i) => (
                        <div key={i} className="shows-strip-item">
                            <span className="shows-strip-date">{show.data}</span>
                            <div>
                                <div className="shows-strip-venue">{show.local}</div>
                                <div className="shows-strip-city">{show.cidade}</div>
                            </div>
                        </div>
                    ))}
                    <Link to="/agenda" className="btn btn-outline" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        Ver Todos
                    </Link>
                </div>
            </div>

            {/* ===== ABOUT SECTION ===== */}
            <div style={{ background: 'var(--color-bg)' }}>
                <div className="section">
                    <div className="about-grid">
                        <div className="about-visual">
                            <div style={{ position: 'relative' }}>
                                <div className="about-img-glow" />
                                <div className="about-img-wrapper">
                                    <img src="/images/gallery_3.jpg" alt="Danger Kiss no palco" />
                                </div>
                                <div className="about-badge">
                                    <span className="about-badge-num">10+</span>
                                    <span className="about-badge-text">Anos de Rock</span>
                                </div>
                            </div>
                        </div>

                        <div className="about-content">
                            <div className="section-label">Nossa História</div>
                            <h2 className="section-title">
                                A Essência do Rock Ao Vivo
                            </h2>
                            <div className="separator" />
                            <p className="about-desc">
                                Nascemos do amor pelo rock e da vontade de revelar toda a força dessa música ao vivo. A Danger Kiss Cover é a fusão perfeita entre técnica, emoção e energia pura — do clássico ao moderno, do nacional ao internacional.
                            </p>
                            <p className="about-desc">
                                Com mais de 1000 shows realizados, levamos o melhor do rock para bares, casas de show, festivais e eventos corporativos em todo o Brasil.
                            </p>

                            <div className="band-members">
                                {[
                                    { icon: '🎤', name: 'Rodrigo Stanley', role: 'Vocal' },
                                    { icon: '🎸', name: 'Stefano Frehley', role: 'Guitarra' },
                                    { icon: '🎸', name: 'Gabriel Simmons', role: 'Baixo' },
                                    { icon: '🥁', name: 'Paulo Carr', role: 'Bateria' },
                                ].map((m, i) => (
                                    <div key={i} className="band-member-card">
                                        <span className="member-icon">{m.icon}</span>
                                        <div>
                                            <div className="member-name">{m.name}</div>
                                            <div className="member-role">{m.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <Link to="/sobre" className="btn btn-primary">
                                    Conhecer a Banda →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== GALLERY PREVIEW ===== */}
            <div style={{ background: 'var(--color-bg-2)', padding: '6rem 5%' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="section-header centered">
                        <div className="section-label">📸 Galeria</div>
                        <h2 className="section-title">Momentos Inesquecíveis</h2>
                        <div className="separator centered" />
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        marginTop: '2rem'
                    }}>
                        {['/images/gallery_18.jpg', '/images/gallery_24.jpg', '/images/gallery_6.jpg'].map((src, i) => (
                            <div key={i} className="gallery-item-modern">
                                <img src={src} alt={`Show ${i + 1}`} />
                                <div className="gallery-item-overlay">
                                    <span className="gallery-item-label">🔥 Show ao Vivo</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Link to="/galeria" className="btn btn-outline">
                            Ver Galeria Completa
                        </Link>
                    </div>
                </div>
            </div>

            {/* ===== CTA BANNER ===== */}
            <div className="cta-banner">
                <div className="cta-banner-content">
                    <h2>Fique Por Dentro dos Shows!</h2>
                    <p>Cadastre seu email e receba em primeira mão as novidades sobre shows, setlists e muito mais.</p>
                    {!subscribed ? (
                        <form className="cta-input-group" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn-white">Quero!</button>
                        </form>
                    ) : (
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>
                            🤘 Inscrição confirmada! Rock on!
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;