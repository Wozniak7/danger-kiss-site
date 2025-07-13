import React from 'react';

function Sobre() {
    return (
        <div className="page-content">
            <h1>Sobre a Banda</h1>
            <p>
                Somos a "Nome da Banda Cover", uma banda apaixonada por rock que nasceu com o objetivo de reviver os clássicos que marcaram gerações. Com energia contagiante e fidelidade aos arranjos originais, levamos o melhor do rock para o seu evento.
            </p>
            <h2>Integrantes:</h2>
            <ul>
                <li>João (Vocal)</li>
                <li>Pedro (Guitarra)</li>
                <li>Maria (Baixo)</li>
                <li>Ana (Bateria)</li>
            </ul>
            {/* Adicione a história da banda, influências, etc. */}
        </div>
    );
}

export default Sobre;