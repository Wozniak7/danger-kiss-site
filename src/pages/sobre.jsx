import React from 'react';

function Sobre() {
    const membros = [
        { icon: '🎤', name: 'Rodrigo Stanley', role: 'Vocal Principal', desc: 'Uma voz única que captura a essência de cada clássico do rock.' },
        { icon: '🎸', name: 'Stefano Frehley', role: 'Guitarra Solo', desc: 'Riffs poderosos e solos emocionantes que fazem a plateia enlouquecer.' },
        { icon: '🥁', name: 'Paulo Carr', role: 'Bateria', desc: 'A base rítmica irresistível que mantém todo mundo na energia máxima.' },
        { icon: '🎸', name: 'Gabriel Simmons', role: 'Baixo & Backing', desc: 'Grooves profundos que sustentam toda a estrutura sonora da banda.' }
    ];

    const valores = [
        { icon: '🔥', title: 'Energia Pura', desc: 'Cada show é uma experiência única, repleta de adrenalina e emoção do início ao fim.' },
        { icon: '🎵', title: 'Fidelidade Musical', desc: 'Reproduzimos os arranjos originais com máxima fidelidade, honrando os clássicos.' },
        { icon: '🤘', title: 'Conexão Real', desc: 'Mais que tocar músicas — criamos momentos que marcam para sempre quem está no público.' },
    ];

    return (
        <>
            <div className="page-hero">
                <div className="section-label">A Banda</div>
                <h1 className="text-gradient">DANGER KISS COVER</h1>
                <div className="separator centered" />
                <p>Paixão pelo rock, energia no palco e fidelidade aos clássicos que marcaram gerações.</p>
            </div>

            <div className="section">
                <div className="about-grid">
                    <div className="about-content">
                        <div className="section-label">Nossa Missão</div>
                        <h2 className="section-title">Por Que Existimos</h2>
                        <div className="separator" />
                        <p className="about-desc">
                            A Danger Kiss Cover nasceu do amor incondicional pelo rock — aquele gênero que moveu gerações, quebrou barreiras e transformou vidas. Somos uma banda formada por músicos apaixonados que dedicam suas vidas a reviver os maiores momentos do rock nacional e internacional.
                        </p>
                        <p className="about-desc">
                            Com mais de 10 anos de estrada e centenas de shows realizados, nossa missão é simples: levar a emoção do rock ao vivo para onde você estiver. Seja em um bar íntimo, festival de grande porte ou evento corporativo — a Danger Kiss entrega sempre o máximo.
                        </p>
                        <p className="about-desc">
                            A Danger Kiss é uma banda cover do Kiss, formada por músicos apaixonados que dedicam suas vidas a reviver os maiores momentos do rock nacional e internacional.
                        </p>
                    </div>
                    <div className="about-visual">
                        <div style={{ position: 'relative' }}>
                            <div className="about-img-glow" />
                            <div className="about-img-wrapper">
                                <img src="/images/gallery_8.jpg" alt="Danger Kiss ao vivo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MEMBERS */}
            <div style={{ background: 'var(--color-bg-2)', padding: '5rem 5%' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="section-header centered">
                        <div className="section-label">Quem Somos</div>
                        <h2 className="section-title">Os Integrantes</h2>
                        <div className="separator centered" />
                    </div>
                    <div className="members-grid">
                        {membros.map((m, i) => (
                            <div key={i} className="member-card">
                                <span className="member-emoji">{m.icon}</span>
                                <div className="member-card-name">{m.name}</div>
                                <div className="member-card-role">{m.role}</div>
                                <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* VALUES */}
            <div style={{ padding: '5rem 5%' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="section-header centered">
                        <div className="section-label">O que nos move</div>
                        <h2 className="section-title">Nossa Essência</h2>
                        <div className="separator centered" />
                    </div>
                    <div className="values-grid">
                        {valores.map((v, i) => (
                            <div key={i} className="value-card">
                                <div className="value-icon">{v.icon}</div>
                                <div className="value-title">{v.title}</div>
                                <p className="value-desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTATO CTA */}
            <div className="cta-banner">
                <div className="cta-banner-content">
                    <h2>Quer Contratar a Danger Kiss?</h2>
                    <p>Entre em contato para orçamentos e disponibilidade para shows, eventos e festivais.</p>
                    <a href="mailto:contato@dangerkiss.com.br" className="btn-white" style={{
                        display: 'inline-block',
                        padding: '0.85rem 2rem',
                        borderRadius: '6px',
                        fontFamily: 'Oswald, sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        background: '#fff',
                        color: '#c0392b',
                        border: 'none',
                        textDecoration: 'none'
                    }}>
                        📧 contato@dangerkiss.com.br
                    </a>
                </div>
            </div>
        </>
    );
}

export default Sobre;