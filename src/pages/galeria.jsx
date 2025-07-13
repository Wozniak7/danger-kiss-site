import React from 'react';

function Galeria() {
    const imagens = [
        { id: 1, src: '/images/banda1.jpg', alt: 'Banda no palco' },
        { id: 2, src: '/images/banda2.jpg', alt: 'Guitarrista solo' },
        { id: 3, src: '/images/banda3.jpg', alt: 'Público vibrando' },
        // Adicione mais imagens aqui
    ];

    return (
        <div className="page-content">
            <h1>Nossa Galeria de Fotos</h1>
            <div className="gallery-grid">
                {imagens.map(imagem => (
                    <div key={imagem.id} className="gallery-item">
                        <img src={imagem.src} alt={imagem.alt} />
                    </div>
                ))}
            </div>
            <p>
                *Lembre-se de colocar as imagens na pasta `public/images/` para que sejam acessíveis.
            </p>
        </div>
    );
}

export default Galeria;