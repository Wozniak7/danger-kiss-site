import React, { useState } from 'react';

function Agenda() {
    const [filter, setFilter] = useState('todos');

    const shows = [
        {
            id: 1,
            dia: '15',
            mes: 'AGO',
            ano: '2025',
            local: 'Bar do Rock',
            cidade: 'São Paulo, SP',
            tipo: 'show',
            status: 'confirmed',
            statusLabel: 'Confirmado',
            hora: '22h00',
        },
        {
            id: 2,
            dia: '01',
            mes: 'SET',
            ano: '2025',
            local: 'Casa de Shows Rock',
            cidade: 'Rio de Janeiro, RJ',
            tipo: 'show',
            status: 'confirmed',
            statusLabel: 'Confirmado',
            hora: '21h30',
        },
        {
            id: 3,
            dia: '20',
            mes: 'SET',
            ano: '2025',
            local: 'Festival da Cidade',
            cidade: 'Belo Horizonte, MG',
            tipo: 'festival',
            status: 'special',
            statusLabel: '🎪 Festival',
            hora: '20h00',
        },
        {
            id: 4,
            dia: '10',
            mes: 'OUT',
            ano: '2025',
            local: 'Pub Rock & Roll',
            cidade: 'Curitiba, PR',
            tipo: 'show',
            status: 'confirmed',
            statusLabel: 'Confirmado',
            hora: '22h30',
        },
        {
            id: 5,
            dia: '05',
            mes: 'NOV',
            ano: '2025',
            local: 'Arena Music Fest',
            cidade: 'Porto Alegre, RS',
            tipo: 'festival',
            status: 'special',
            statusLabel: '🎪 Festival',
            hora: '19h00',
        },
        {
            id: 6,
            dia: '20',
            mes: 'DEZ',
            ano: '2025',
            local: 'Réveillon Rock',
            cidade: 'Florianópolis, SC',
            tipo: 'especial',
            status: 'special',
            statusLabel: '🎆 Especial',
            hora: '23h00',
        },
    ];

    const filtered = filter === 'todos' ? shows : shows.filter(s => s.tipo === filter);

    return (
        <>
            <div className="page-hero">
                <div className="section-label">📅 Próximos Shows</div>
                <h1 className="text-gradient">AGENDA 2026</h1>
                <div className="separator centered" />
                <p>Encontre o show mais próximo de você e venha fazer parte dessa energia!</p>
            </div>

            <div className="section">
                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    {[
                        { key: 'todos', label: '🎸 Todos' },
                        { key: 'show', label: '🎤 Shows' },
                        { key: 'festival', label: '🎪 Festivais' },
                        { key: 'especial', label: '🎆 Especiais' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className="btn"
                            style={{
                                padding: '0.55rem 1.25rem',
                                fontSize: '0.8rem',
                                background: filter === f.key ? 'var(--gradient-fire)' : 'var(--color-surface)',
                                color: filter === f.key ? '#fff' : 'var(--color-text-muted)',
                                border: `1.5px solid ${filter === f.key ? 'transparent' : 'var(--color-border)'}`,
                                boxShadow: filter === f.key ? 'var(--shadow-glow)' : 'none',
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="shows-grid">
                    {filtered.map(show => (
                        <div key={show.id} className="show-card">
                            <div className="show-date-box">
                                <span className="show-day">{show.dia}</span>
                                <span className="show-month">{show.mes}</span>
                            </div>
                            <div className="show-info">
                                <div className="show-venue">{show.local}</div>
                                <div className="show-meta">
                                    <span className="show-city">📍 {show.cidade}</span>
                                    <span className="show-city">🕐 {show.hora}</span>
                                    <span className={`show-badge ${show.status}`}>{show.statusLabel}</span>
                                </div>
                            </div>
                            <div className="show-action">
                                <a
                                    href="#"
                                    className="btn btn-outline"
                                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.8rem' }}
                                    onClick={e => e.preventDefault()}
                                >
                                    Ingressos →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: 'var(--color-text-muted)',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎸</p>
                        <p>Nenhum show encontrado nessa categoria.</p>
                    </div>
                )}

                {/* Booking CTA */}
                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                            🎤 Quer nos Contratar?
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                            Entre em contato para verificar disponibilidade e solicitar orçamento.
                        </p>
                    </div>
                    <a href="mailto:booking@dangerkiss.com.br" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                        Solicitar Orçamento
                    </a>
                </div>
            </div>
        </>
    );
}

export default Agenda;