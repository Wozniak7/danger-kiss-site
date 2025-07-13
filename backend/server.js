import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET; 

app.use(cors()); 
app.use(express.json()); 

const users = [
    { username: 'admin', password: 'e?HG4C$y!;Yf\oI$' } 
];

// Rota de Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Gera um token JWT
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido!', token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas.' });
    }
});

// Middleware para verificar token (para rotas protegidas)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Se não há token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido ou expirado
        req.user = user;
        next();
    });
};

// Rota protegida (exemplo para o Admin)
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.user.username}! Seu token é válido.` });
});

// Rota raiz para Vercel detectar o servidor
app.get('/', (req, res) => {
    res.send('Backend da Banda Cover está no ar!');
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});