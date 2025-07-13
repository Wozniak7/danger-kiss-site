import React from 'react';

function Agenda() {
    const proximosShows = [
        { id: 1, data: '2025-08-15', local: 'Bar do Zé', cidade: 'São Paulo' },
        { id: 2, data: '2025-09-01', local: 'Casa de Shows Rock', cidade: 'Rio de Janeiro' },
        { id: 3, data: '2025-09-20', local: 'Festival da Cidade', cidade: 'Belo Horizonte' },
    ];

    return (
        <div className="page-content">
            <h1>Agenda de Shows</h1>
            {proximosShows.length > 0 ? (
                <ul>
                    {proximosShows.map(show => (
                        <li key={show.id}>
                            <strong>{show.data}</strong> - {show.local}, {show.cidade}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Não há shows agendados no momento. Fique ligado para novidades!</p>
            )}
        </div>
    );
}

export default Agenda;