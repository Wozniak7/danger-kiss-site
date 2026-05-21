import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_only_for_dev';

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const SHOWS_FILE = path.join(DATA_DIR, 'shows.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images (for admin uploads preview)
app.use('/images', express.static(IMAGES_DIR));

// Multer config - save uploads to public/images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, IMAGES_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `gallery_upload_${Date.now()}${ext}`;
        cb(null, name);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Somente imagens são permitidas.'));
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Helpers
const readJSON = (file, fallback = []) => {
    try {
        if (!fs.existsSync(file)) return fallback;
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch { return fallback; }
};
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');

// Auth
const users = [
    { username: process.env.ADMIN_USERNAME || 'admin', password: process.env.ADMIN_PASSWORD }
];

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

app.get('/', (req, res) => res.send('Backend da Danger Kiss está no ar!'));

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido!', token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas.' });
    }
});

// Public: Get shows
app.get('/api/shows', (req, res) => {
    const shows = readJSON(SHOWS_FILE, []);
    res.json(shows);
});

// Public: Get content/texts
app.get('/api/content', (req, res) => {
    const content = readJSON(CONTENT_FILE, {});
    res.json(content);
});

// Public: List images in gallery
app.get('/api/images', (req, res) => {
    try {
        const files = fs.readdirSync(IMAGES_DIR);
        const images = files
            .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
            .map(f => ({ filename: f, src: `/images/${f}` }));
        res.json(images);
    } catch (e) {
        res.json([]);
    }
});

// ─── PROTECTED ROUTES ────────────────────────────────────────────────────────

// Verify token
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.user.username}!` });
});

// Shows CRUD
app.post('/api/shows', authenticateToken, (req, res) => {
    const shows = readJSON(SHOWS_FILE, []);
    const maxId = shows.length > 0 ? Math.max(...shows.map(s => s.id)) : 0;
    const newShow = { id: maxId + 1, ...req.body };
    shows.push(newShow);
    writeJSON(SHOWS_FILE, shows);
    res.status(201).json(newShow);
});

app.put('/api/shows/:id', authenticateToken, (req, res) => {
    const shows = readJSON(SHOWS_FILE, []);
    const idx = shows.findIndex(s => s.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Show não encontrado.' });
    shows[idx] = { ...shows[idx], ...req.body, id: shows[idx].id };
    writeJSON(SHOWS_FILE, shows);
    res.json(shows[idx]);
});

app.delete('/api/shows/:id', authenticateToken, (req, res) => {
    let shows = readJSON(SHOWS_FILE, []);
    const idx = shows.findIndex(s => s.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Show não encontrado.' });
    shows.splice(idx, 1);
    writeJSON(SHOWS_FILE, shows);
    res.json({ message: 'Show removido.' });
});

// Content update
app.put('/api/content', authenticateToken, (req, res) => {
    const content = req.body;
    writeJSON(CONTENT_FILE, content);
    res.json({ message: 'Conteúdo salvo com sucesso!', content });
});

// Image upload
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    res.json({
        message: 'Imagem enviada com sucesso!',
        filename: req.file.filename,
        src: `/images/${req.file.filename}`
    });
});

// Delete image
app.delete('/api/images/:filename', authenticateToken, (req, res) => {
    const filename = req.params.filename;
    // Security: only allow filenames without path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ message: 'Nome de arquivo inválido.' });
    }
    const filePath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Arquivo não encontrado.' });
    fs.unlinkSync(filePath);
    res.json({ message: 'Imagem removida com sucesso.' });
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});