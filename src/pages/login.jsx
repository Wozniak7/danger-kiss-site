import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                navigate('/admin');
            } else {
                setError('Usuário ou senha incorretos.');
            }
        } catch {
            setError('Erro ao conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-wrap">
            <div className="auth-card">
                <div className="auth-logo">⚡ DANGER KISS</div>
                <div className="auth-title">Área Restrita</div>
                <p className="auth-subtitle">Acesso exclusivo para administradores da banda.</p>

                {error && (
                    <div style={{
                        background: 'rgba(192,57,43,0.15)',
                        border: '1px solid rgba(192,57,43,0.4)',
                        color: '#e74c3c',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        marginBottom: '1.25rem',
                        textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder="Seu usuário"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : '🔐 Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;