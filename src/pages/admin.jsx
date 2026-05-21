import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

const MESES = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

const defaultShow = {
    dia: '', mes: 'JAN', ano: new Date().getFullYear().toString(),
    local: '', cidade: '', tipo: 'show', status: 'confirmed',
    statusLabel: 'Confirmado', hora: ''
};

const tipoOptions = [
    { value: 'show', label: '🎤 Show' },
    { value: 'festival', label: '🎪 Festival' },
    { value: 'especial', label: '🎆 Especial' },
];

const statusOptions = [
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'special', label: 'Especial' },
    { value: 'pending', label: 'A confirmar' },
];

function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [msg]);
    if (!msg) return null;
    return (
        <div style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
            background: type === 'error' ? '#c0392b' : '#27ae60',
            color: '#fff', padding: '1rem 1.5rem', borderRadius: '10px',
            fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'fadeInUp 0.3s ease',
            display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
            <span>{type === 'error' ? '✗' : '✓'}</span>
            {msg}
        </div>
    );
}

function ShowModal({ show, onSave, onClose }) {
    const [form, setForm] = useState(show || defaultShow);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTipoChange = (e) => {
        const tipo = e.target.value;
        const opt = tipoOptions.find(t => t.value === tipo);
        setForm(prev => ({ ...prev, tipo, statusLabel: opt ? opt.label.replace(/^[^\w]+/, '') : tipo }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                background: 'var(--color-surface)', borderRadius: '16px',
                border: '1px solid var(--color-border)', padding: '2rem',
                maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                    {show ? '✏️ Editar Show' : '➕ Novo Show'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={labelStyle}>Dia</label>
                            <input style={inputStyle} name="dia" value={form.dia} onChange={handleChange} placeholder="15" maxLength={2} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Mês</label>
                            <select style={inputStyle} name="mes" value={form.mes} onChange={handleChange}>
                                {MESES.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Ano</label>
                            <input style={inputStyle} name="ano" value={form.ano} onChange={handleChange} placeholder="2025" maxLength={4} required />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Local / Venue</label>
                        <input style={inputStyle} name="local" value={form.local} onChange={handleChange} placeholder="Bar do Rock" required />
                    </div>
                    <div>
                        <label style={labelStyle}>Cidade, Estado</label>
                        <input style={inputStyle} name="cidade" value={form.cidade} onChange={handleChange} placeholder="São Paulo, SP" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={labelStyle}>Horário</label>
                            <input style={inputStyle} name="hora" value={form.hora} onChange={handleChange} placeholder="22h00" required />
                        </div>
                        <div>
                            <label style={labelStyle}>Tipo</label>
                            <select style={inputStyle} name="tipo" value={form.tipo} onChange={handleTipoChange}>
                                {tipoOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Status</label>
                        <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
                            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button type="button" onClick={onClose} style={btnSecondaryStyle}>Cancelar</button>
                        <button type="submit" style={btnPrimaryStyle}>💾 Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── TAB: Textos ─────────────────────────────────────────────────────────────
function TabTextos({ token }) {
    const [content, setContent] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/content`)
            .then(r => r.json())
            .then(setContent)
            .catch(() => setToast({ msg: 'Erro ao carregar conteúdo.', type: 'error' }));
    }, []);

    const handleChange = (section, key, value) => {
        setContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    };

    const save = async () => {
        setSaving(true);
        try {
            const r = await fetch(`${API}/api/content`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(content)
            });
            if (!r.ok) throw new Error();
            setToast({ msg: 'Textos salvos com sucesso!', type: 'success' });
        } catch {
            setToast({ msg: 'Erro ao salvar textos.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (!content) return <div style={loadingStyle}>Carregando...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            <Section title="🎸 Página Inicial — Hero">
                <Field label="Eyebrow (texto acima do título)" value={content.hero?.eyebrow} onChange={v => handleChange('hero', 'eyebrow', v)} />
                <Field label="Subtítulo (ex: Cover · Rock Nacional)" value={content.hero?.subtitle} onChange={v => handleChange('hero', 'subtitle', v)} />
                <Field label="Descrição" textarea value={content.hero?.desc} onChange={v => handleChange('hero', 'desc', v)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <Field label="Nº de Shows" value={content.hero?.statShows} onChange={v => handleChange('hero', 'statShows', v)} />
                    <Field label="Anos de Estrada" value={content.hero?.statAnos} onChange={v => handleChange('hero', 'statAnos', v)} />
                    <Field label="Integrantes" value={content.hero?.statIntegrantes} onChange={v => handleChange('hero', 'statIntegrantes', v)} />
                </div>
            </Section>

            <Section title="🏠 Página Inicial — Seção Sobre">
                <Field label="Parágrafo 1" textarea value={content.home?.aboutDesc1} onChange={v => handleChange('home', 'aboutDesc1', v)} />
                <Field label="Parágrafo 2" textarea value={content.home?.aboutDesc2} onChange={v => handleChange('home', 'aboutDesc2', v)} />
            </Section>

            <Section title="📖 Página Sobre — Missão">
                <Field label="Parágrafo 1" textarea value={content.sobre?.missaoDesc1} onChange={v => handleChange('sobre', 'missaoDesc1', v)} />
                <Field label="Parágrafo 2" textarea value={content.sobre?.missaoDesc2} onChange={v => handleChange('sobre', 'missaoDesc2', v)} />
                <Field label="Parágrafo 3" textarea value={content.sobre?.missaoDesc3} onChange={v => handleChange('sobre', 'missaoDesc3', v)} />
            </Section>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={save} disabled={saving} style={{ ...btnPrimaryStyle, fontSize: '0.95rem', padding: '0.85rem 2.5rem' }}>
                    {saving ? '⏳ Salvando...' : '💾 Salvar Todos os Textos'}
                </button>
            </div>
        </div>
    );
}

// ─── TAB: Shows/Agenda ───────────────────────────────────────────────────────
function TabAgenda({ token }) {
    const [shows, setShows] = useState([]);
    const [modal, setModal] = useState(null); // null | 'new' | show object
    const [toast, setToast] = useState(null);

    const load = () => {
        fetch(`${API}/api/shows`)
            .then(r => r.json())
            .then(setShows)
            .catch(() => setToast({ msg: 'Erro ao carregar shows.', type: 'error' }));
    };

    useEffect(load, []);

    const save = async (form) => {
        const isEdit = modal && modal !== 'new';
        const url = isEdit ? `${API}/api/shows/${modal.id}` : `${API}/api/shows`;
        const method = isEdit ? 'PUT' : 'POST';
        try {
            const r = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            if (!r.ok) throw new Error();
            setModal(null);
            load();
            setToast({ msg: isEdit ? 'Show atualizado!' : 'Show adicionado!', type: 'success' });
        } catch {
            setToast({ msg: 'Erro ao salvar show.', type: 'error' });
        }
    };

    const remove = async (id) => {
        if (!window.confirm('Remover este show?')) return;
        try {
            const r = await fetch(`${API}/api/shows/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!r.ok) throw new Error();
            load();
            setToast({ msg: 'Show removido.', type: 'success' });
        } catch {
            setToast({ msg: 'Erro ao remover show.', type: 'error' });
        }
    };

    return (
        <div>
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            {modal && (
                <ShowModal
                    show={modal === 'new' ? null : modal}
                    onSave={save}
                    onClose={() => setModal(null)}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>{shows.length} show(s) cadastrado(s)</p>
                <button onClick={() => setModal('new')} style={btnPrimaryStyle}>➕ Novo Show</button>
            </div>

            {shows.length === 0 ? (
                <div style={emptyStyle}>Nenhum show cadastrado. Clique em "Novo Show" para adicionar.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {shows.map(show => (
                        <div key={show.id} style={showRowStyle}>
                            <div style={showDateBadge}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{show.dia}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>{show.mes}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>{show.local}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                    📍 {show.cidade} &nbsp;·&nbsp; 🕐 {show.hora} &nbsp;·&nbsp;
                                    <span style={{ color: show.status === 'special' ? '#e17055' : '#00b894' }}>
                                        {show.statusLabel}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                <button onClick={() => setModal(show)} style={btnEditStyle}>✏️ Editar</button>
                                <button onClick={() => remove(show.id)} style={btnDeleteStyle}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── TAB: Galeria ────────────────────────────────────────────────────────────
function TabGaleria({ token }) {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const fileRef = useRef();

    const load = () => {
        fetch(`${API}/api/images`)
            .then(r => r.json())
            .then(setImages)
            .catch(() => setToast({ msg: 'Erro ao carregar imagens.', type: 'error' }));
    };

    useEffect(load, []);

    const handleUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        let success = 0, fail = 0;
        for (const file of files) {
            const fd = new FormData();
            fd.append('image', file);
            try {
                const r = await fetch(`${API}/api/upload`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd
                });
                if (r.ok) success++;
                else fail++;
            } catch { fail++; }
        }
        setUploading(false);
        load();
        if (fail === 0) setToast({ msg: `${success} imagem(ns) enviada(s)!`, type: 'success' });
        else setToast({ msg: `${success} enviada(s), ${fail} falhou/falharam.`, type: 'error' });
        fileRef.current.value = '';
    };

    const remove = async (filename) => {
        if (!window.confirm(`Remover "${filename}"?`)) return;
        try {
            const r = await fetch(`${API}/api/images/${filename}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!r.ok) throw new Error();
            load();
            setToast({ msg: 'Imagem removida.', type: 'success' });
        } catch {
            setToast({ msg: 'Erro ao remover imagem.', type: 'error' });
        }
    };

    return (
        <div>
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            {/* Upload area */}
            <div style={{
                border: '2px dashed var(--color-border)', borderRadius: '12px',
                padding: '2rem', textAlign: 'center', marginBottom: '2rem',
                background: 'var(--color-surface)', cursor: 'pointer',
                transition: 'border-color 0.2s'
            }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                    e.preventDefault();
                    const dt = { target: { files: e.dataTransfer.files } };
                    handleUpload(dt);
                }}
            >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📷</div>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.88rem' }}>
                    Arraste imagens aqui ou clique para selecionar
                </p>
                <label style={{ ...btnPrimaryStyle, cursor: 'pointer', display: 'inline-flex' }}>
                    {uploading ? '⏳ Enviando...' : '📤 Selecionar Imagens'}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{images.length} imagem(ns) na galeria</p>
            </div>

            {images.length === 0 ? (
                <div style={emptyStyle}>Nenhuma imagem encontrada na pasta.</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '1rem'
                }}>
                    {images.map(img => (
                        <div key={img.filename} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#000' }}>
                            <img
                                src={`${API}${img.src}`}
                                alt={img.filename}
                                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', opacity: 0.85 }}
                            />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                                padding: '0.5rem 0.4rem 0.4rem'
                            }}>
                                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', wordBreak: 'break-all', marginBottom: '0.3rem' }}>
                                    {img.filename}
                                </div>
                                <button
                                    onClick={() => remove(img.filename)}
                                    style={{
                                        background: '#c0392b', border: 'none', color: '#fff',
                                        borderRadius: '4px', padding: '0.2rem 0.5rem',
                                        fontSize: '0.7rem', cursor: 'pointer', width: '100%'
                                    }}
                                >
                                    🗑️ Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Section({ title, children }) {
    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>{children}</div>
        </div>
    );
}

function Field({ label, value, onChange, textarea }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            {textarea ? (
                <textarea
                    value={value || ''} onChange={e => onChange(e.target.value)}
                    rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-body)' }}
                />
            ) : (
                <input value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle} />
            )}
        </div>
    );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 600,
    color: 'var(--color-text-muted)', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: '0.35rem',
    fontFamily: 'var(--font-heading)'
};
const inputStyle = {
    width: '100%', background: 'var(--color-bg)', border: '1.5px solid var(--color-border)',
    borderRadius: '8px', padding: '0.6rem 0.85rem', color: 'var(--color-text)',
    fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s'
};
const btnPrimaryStyle = {
    background: 'var(--gradient-fire)', border: 'none', color: '#fff',
    padding: '0.65rem 1.5rem', borderRadius: '8px', fontFamily: 'var(--font-heading)',
    fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em',
    cursor: 'pointer', textTransform: 'uppercase', display: 'flex',
    alignItems: 'center', gap: '0.4rem', transition: 'opacity 0.2s',
};
const btnSecondaryStyle = {
    background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
    color: 'var(--color-text-muted)', padding: '0.65rem 1.5rem',
    borderRadius: '8px', fontFamily: 'var(--font-heading)', fontWeight: 700,
    fontSize: '0.85rem', letterSpacing: '0.05em', cursor: 'pointer', textTransform: 'uppercase'
};
const btnEditStyle = {
    background: 'rgba(255,255,255,0.07)', border: '1px solid var(--color-border)',
    color: 'var(--color-text)', padding: '0.4rem 0.85rem',
    borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer'
};
const btnDeleteStyle = {
    background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)',
    color: '#c0392b', padding: '0.4rem 0.65rem',
    borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer'
};
const showRowStyle = {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
    borderRadius: '10px', padding: '1rem 1.25rem', transition: 'border-color 0.2s'
};
const showDateBadge = {
    background: 'var(--gradient-fire)', borderRadius: '8px',
    padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column',
    alignItems: 'center', color: '#fff', minWidth: '52px', flexShrink: 0
};
const emptyStyle = {
    textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)',
    background: 'var(--color-surface)', borderRadius: '12px',
    border: '1px solid var(--color-border)', fontSize: '0.9rem'
};
const loadingStyle = { textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' };

// ─── MAIN ADMIN ───────────────────────────────────────────────────────────────
const tabs = [
    { key: 'textos', label: '📝 Textos' },
    { key: 'agenda', label: '📅 Agenda' },
    { key: 'galeria', label: '🖼️ Galeria' },
];

function Admin() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [activeTab, setActiveTab] = useState('textos');

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (!t) {
            alert('Você precisa estar logado para acessar esta página.');
            navigate('/login');
            return;
        }
        // Verify token
        fetch(`${API}/api/verify-token`, { headers: { Authorization: `Bearer ${t}` } })
            .then(r => {
                if (!r.ok) {
                    localStorage.removeItem('token');
                    alert('Sessão expirada. Faça login novamente.');
                    navigate('/login');
                } else {
                    setToken(t);
                }
            })
            .catch(() => {
                // Backend offline, allow with stored token for local dev
                setToken(t);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!token) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>Verificando sessão...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px', flexShrink: 0, background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)', padding: '2rem 0',
                display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh'
            }}>
                <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.08em', background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        DANGER KISS
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginTop: '2px', textTransform: 'uppercase' }}>
                        Painel Admin
                    </div>
                </div>

                <nav style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                width: '100%', textAlign: 'left', padding: '0.75rem 1rem',
                                borderRadius: '8px', border: 'none', cursor: 'pointer',
                                fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600,
                                transition: 'all 0.15s',
                                background: activeTab === tab.key ? 'rgba(192,57,43,0.15)' : 'transparent',
                                color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                borderLeft: `3px solid ${activeTab === tab.key ? 'var(--color-primary)' : 'transparent'}`,
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', padding: '0.7rem', background: 'transparent',
                        border: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)',
                        borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                        cursor: 'pointer', fontWeight: 600
                    }}>
                        🚪 Sair
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', maxWidth: '960px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                        {tabs.find(t => t.key === activeTab)?.label}
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {activeTab === 'textos' && 'Edite os textos exibidos nas páginas do site.'}
                        {activeTab === 'agenda' && 'Gerencie os shows e eventos da banda.'}
                        {activeTab === 'galeria' && 'Adicione ou remova fotos da galeria.'}
                    </p>
                </div>

                {activeTab === 'textos' && <TabTextos token={token} />}
                {activeTab === 'agenda' && <TabAgenda token={token} />}
                {activeTab === 'galeria' && <TabGaleria token={token} />}
            </main>
        </div>
    );
}

export default Admin;