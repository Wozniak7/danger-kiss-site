import React, { useState, useCallback, useEffect } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

// const defaultPhotos = [
//     { id: 1, src: '/images/gallery_1.jpg', alt: 'Danger Kiss no palco', label: 'Show ao Vivo' },
//     { id: 2, src: '/images/gallery_2.jpg', alt: 'Público vibrando', label: 'Público Incrível' },
//     { id: 3, src: '/images/gallery_3.jpg', alt: 'Baterista em ação', label: 'Diego na Bateria' },
//     { id: 4, src: '/images/gallery_4.jpg', alt: 'Guitarra solo', label: 'Rafael na Guitarra' },
//     { id: 5, src: '/images/gallery_5.jpg', alt: 'Banda completa', label: 'Danger Kiss ao Vivo' },
//     { id: 6, src: '/images/gallery_6.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 7, src: '/images/gallery_7.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 8, src: '/images/gallery_8.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 9, src: '/images/gallery_9.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 10, src: '/images/gallery_10.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 11, src: '/images/gallery_11.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 12, src: '/images/gallery_12.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 13, src: '/images/gallery_13.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 14, src: '/images/gallery_14.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 15, src: '/images/gallery_15.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 16, src: '/images/gallery_16.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 17, src: '/images/gallery_17.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 18, src: '/images/gallery_18.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 19, src: '/images/gallery_19.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 20, src: '/images/gallery_20.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 21, src: '/images/gallery_21.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 22, src: '/images/gallery_22.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 23, src: '/images/gallery_23.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 24, src: '/images/gallery_24.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 25, src: '/images/gallery_25.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 26, src: '/images/gallery_26.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 27, src: '/images/gallery_27.jpg', alt: 'Festival', label: 'Festival 2024' },
//     { id: 28, src: '/images/gallery_28.jpg', alt: 'Festival', label: 'Festival 2024' },
// ];

function Galeria() {
    const [photos, setPhotos] = useState([]);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/images`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data.map((img, i) => ({
                        id: i + 1,
                        src: img.src,
                        alt: img.filename,
                        label: 'Show ao Vivo'
                    }));
                    setPhotos(mapped);
                }
            })
            .catch(() => {}); // fallback to default
    }, []);

    const openLightbox = useCallback((photo) => setLightbox(photo), []);
    const closeLightbox = useCallback(() => setLightbox(null), []);

    const handleKey = useCallback((e) => {
        if (e.key === 'Escape') closeLightbox();
        if (lightbox && e.key === 'ArrowRight') {
            const idx = photos.findIndex(p => p.id === lightbox.id);
            setLightbox(photos[(idx + 1) % photos.length]);
        }
        if (lightbox && e.key === 'ArrowLeft') {
            const idx = photos.findIndex(p => p.id === lightbox.id);
            setLightbox(photos[(idx - 1 + photos.length) % photos.length]);
        }
    }, [lightbox, closeLightbox, photos]);

    React.useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    // For lightbox src — prefix API if it's a backend image
    const resolveUrl = (src) => {
        if (!src) return src;
        if (src.startsWith('/images/')) return src; // served by Vite from public/
        return src;
    };

    return (
        <>
            <div className="page-hero">
                <div className="section-label">📸 Fotos & Vídeos</div>
                <h1 className="text-gradient">GALERIA</h1>
                <div className="separator centered" />
                <p>Reviva os melhores momentos dos nossos shows pelo Brasil.</p>
            </div>

            <div className="section">
                <div className="gallery-grid-modern">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="gallery-item-modern"
                            onClick={() => openLightbox(photo)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && openLightbox(photo)}
                            aria-label={`Ver foto: ${photo.label}`}
                        >
                            <img src={resolveUrl(photo.src)} alt={photo.alt} loading="lazy" />
                            <div className="gallery-item-overlay">
                                <span className="gallery-item-label">{photo.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '3rem', padding: '2rem',
                    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        🎬 Acompanhe nossos shows completos nas redes sociais!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="https://www.instagram.com/dangerkisscover/" className="btn btn-outline" onClick={e => e.preventDefault()}>
                            📸 Instagram
                        </a>
                        <a href="https://www.youtube.com/@dangerkisscover5240" className="btn btn-primary" onClick={e => e.preventDefault()}>
                            ▶ YouTube
                        </a>
                        <a href="https://www.facebook.com/dangerkisscover/" className="btn btn-outline" onClick={e => e.preventDefault()}>
                            📘 Facebook
                        </a>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX */}
            {lightbox && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Fechar">✕</button>
                    <img
                        src={resolveUrl(lightbox.src)}
                        alt={lightbox.alt}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {['ArrowLeft', 'ArrowRight'].map((dir, i) => {
                        const idx = photos.findIndex(p => p.id === lightbox.id);
                        const target = i === 0
                            ? photos[(idx - 1 + photos.length) % photos.length]
                            : photos[(idx + 1) % photos.length];
                        return (
                            <button
                                key={dir}
                                onClick={(e) => { e.stopPropagation(); setLightbox(target); }}
                                style={{
                                    position: 'absolute', top: '50%',
                                    [i === 0 ? 'left' : 'right']: '1.5rem',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff', width: '44px', height: '44px',
                                    borderRadius: '50%', fontSize: '1.1rem',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {i === 0 ? '‹' : '›'}
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default Galeria;