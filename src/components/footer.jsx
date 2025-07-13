import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer>
            <p>&copy; {currentYear} Sua Banda Cover. Todos os direitos reservados.</p>
        </footer>
    );
}

export default Footer;