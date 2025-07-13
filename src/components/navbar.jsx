import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/agenda">Agenda</Link></li>
                <li><Link to="/galeria">Galeria</Link></li>
                <li><Link to="/sobre">Sobre</Link></li>
                <li><Link to="/login">Login (Admin)</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;