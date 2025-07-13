import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para acessar esta página.');
            navigate('/login');
        } else {
            // Opcional: Verificar o token com o backend para garantir que ainda é válido
            verifyToken(token);
        }
    }, [navigate]);

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                localStorage.removeItem('token');
                alert('Sessão expirada ou inválida. Faça login novamente.');
                navigate('/login');
            } else {
                const data = await response.json();
                setMessage(data.message || 'Bem-vindo à área administrativa!');
            }
        } catch (error) {
            console.error('Erro ao verificar token:', error);
            localStorage.removeItem('token');
            alert('Erro ao verificar sua sessão. Faça login novamente.');
            navigate('/login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Você foi desconectado.');
        navigate('/');
    };

    return (
        <div className="page-content">
            <h1>Área Administrativa</h1>
            <p>{message}</p>
            {/* Aqui você pode adicionar funcionalidades de administração:
          - Gerenciar agenda (adicionar/editar/remover shows)
          - Gerenciar galeria (upload/remover fotos)
          - Editar textos do site
      */}
            <p>Esta é uma área restrita para administradores da banda.</p>
            <button onClick={handleLogout}>Sair</button>
        </div>
    );
}

export default Admin;