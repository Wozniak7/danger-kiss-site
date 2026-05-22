const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const busboy = require("busboy");
const path = require("path");
const bcrypt = require("bcryptjs");

admin.initializeApp({
    projectId: "danger-kiss-cover",
    storageBucket: "danger-kiss-cover.firebasestorage.app"
});

// Getter dinâmico para evitar overhead no carregamento global
let db;
const getDb = () => {
    if (!db) db = admin.firestore();
    return db;
};

let bucket;
const getBucket = () => {
    if (!bucket) bucket = admin.storage().bucket();
    return bucket;
}

const app = express();
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;
const SECRET = JWT_SECRET || (process.env.FUNCTIONS_EMULATOR === 'true' ? 'fallback_secret_only_for_dev' : null);
if (!SECRET) {
    console.error("ERRO CRÍTICO: JWT_SECRET ausente em ambiente de produção!");
}
const ACTIVE_SECRET = SECRET || require('crypto').randomBytes(64).toString('hex');

const allowedOrigins = [
    'http://localhost:5173', 'http://localhost:3000', 
    'https://danger-kiss-cover.web.app', 'https://danger-kiss-cover.firebaseapp.com'
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Acesso bloqueado pelo CORS'));
        }
    }
}));
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, ACTIVE_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Rate Limiters Customizados (evita setInterval que causa timeout no Firebase Deploy)
const createLimiter = (windowMs, max, message) => {
    const hits = new Map();
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        if (!hits.has(ip)) {
            hits.set(ip, { count: 1, resetTime: now + windowMs });
            return next();
        }
        const data = hits.get(ip);
        if (now > data.resetTime) {
            data.count = 1;
            data.resetTime = now + windowMs;
            return next();
        }
        data.count++;
        if (data.count > max) {
            return res.status(429).json({ error: message });
        }
        next();
    };
};

const loginLimiter = createLimiter(15 * 60 * 1000, 5, "Muitas tentativas de login. Tente novamente em 15 minutos.");
const subscribeLimiter = createLimiter(60 * 60 * 1000, 3, "Muitas tentativas de inscrição. Tente novamente mais tarde.");

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

app.get("/api/", (req, res) => res.send("Danger Kiss API via Cloud Functions!"));

// Newsletter / Agenda Subscribe
app.post("/api/subscribe", subscribeLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "E-mail é obrigatório." });

    try {
        const snapshot = await getDb().collection("shows").get();
        let shows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        shows.sort((a, b) => {
            const numVal = (s) => parseInt(s.ano || 0)*10000 + (s.mes?1:0)*100 + parseInt(s.dia || 0);
            return numVal(a) - numVal(b);
        });

        let showsHtml = "";
        if (shows.length === 0) {
            showsHtml = "<p>No momento não temos shows marcados, mas fique ligado que em breve anunciaremos novas datas!</p>";
        } else {
            showsHtml = "<ul style='list-style-type: none; padding: 0;'>";
            shows.forEach(s => {
                showsHtml += `<li style='margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #444;'>
                    <strong style='color: #e50914;'>${s.dia}/${s.mes}/${s.ano}</strong><br/>
                    ${s.local} - ${s.cidade}
                </li>`;
            });
            showsHtml += "</ul>";
        }

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #fff; background-color: #111; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px;">
                <h1 style="color: #e50914; text-align: center; margin-bottom: 5px;">⚡ DANGER KISS ⚡</h1>
                <h2 style="text-align: center; color: #ddd; margin-top: 0;">Rock on! 🤘</h2>
                <hr style="border: 1px solid #333; margin: 20px 0;" />
                <p>Olá!</p>
                <p>Obrigado por se inscrever para receber as novidades da Danger Kiss. Aqui está a nossa agenda atualizada de próximos shows:</p>
                <div style="background-color: #222; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    ${showsHtml}
                </div>
                <p>Esperamos te ver na primeira fila cantando com a gente!</p>
                <p style="color: #999; font-size: 0.9em;">Um abraço,<br/><strong>Banda Danger Kiss Cover</strong></p>
            </div>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"Danger Kiss" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: "🤘 Agenda de Shows - Danger Kiss",
            html: htmlContent
        });

        res.json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
        console.error("Erro interno ao enviar e-mail:", error.message);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Login + Bootstrap Admin
app.post("/api/login", loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    try {
        const _db = getDb();
        let userDoc = await _db.collection("users").doc(username).get();
        
        // BOOTSTRAP: Se o admin não existir e usarmos a senha padrão do .env, cria ele automaticamente no banco e faz login.
        const adminUser = process.env.ADMIN_USERNAME || 'admin';
        const adminPass = process.env.ADMIN_PASSWORD;
        if (!userDoc.exists && username === adminUser && adminPass && password === adminPass) {
            console.log("Realizando bootstrap do usuário admin...");
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            await _db.collection('users').doc('admin').set({
                username: 'admin',
                passwordHash: hash
            });
            userDoc = await _db.collection("users").doc(username).get();
        }

        if (!userDoc.exists) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        
        const userData = userDoc.data();
        const isValid = await bcrypt.compare(password, userData.passwordHash);
        
        if (isValid) {
            const token = jwt.sign({ username }, ACTIVE_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login bem-sucedido!', token });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas.' });
        }
    } catch (e) {
        console.error("Erro interno:", e.message);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

app.get("/api/shows", async (req, res) => {
    try {
        const snapshot = await getDb().collection("shows").get();
        // Since mes is a string like "JAN", we skip complex sorting for now or sort them roughly
        const shows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        shows.sort((a, b) => {
            const numVal = (s) => parseInt(s.ano || 0)*10000 + (s.mes?1:0)*100 + parseInt(s.dia || 0); // Rough sort
            return numVal(a) - numVal(b);
        });
        res.json(shows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Content
app.get("/api/content", async (req, res) => {
    try {
        const doc = await getDb().collection("content").doc("site").get();
        res.json(doc.exists ? doc.data() : {});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Images Gallery
app.get("/api/images", async (req, res) => {
    try {
        const [files] = await getBucket().getFiles({ prefix: 'gallery/' });
        const images = files
            .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))
            .map(file => {
                const filename = file.name.replace('gallery/', '');
                return {
                    filename: filename,
                    src: `https://firebasestorage.googleapis.com/v0/b/${getBucket().name}/o/${encodeURIComponent(file.name)}?alt=media`
                };
            });
        res.json(images);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ─── PROTECTED ROUTES ────────────────────────────────────────────────────────

app.get("/api/verify-token", authenticateToken, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.user.username}!` });
});

app.post("/api/shows", authenticateToken, async (req, res) => {
    try {
        const newShow = req.body;
        const ref = await getDb().collection("shows").add(newShow);
        res.status(201).json({ id: ref.id, ...newShow });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put("/api/shows/:id", authenticateToken, async (req, res) => {
    try {
        await getDb().collection("shows").doc(req.params.id).set(req.body, { merge: true });
        res.json({ id: req.params.id, ...req.body });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete("/api/shows/:id", authenticateToken, async (req, res) => {
    try {
        await getDb().collection("shows").doc(req.params.id).delete();
        res.json({ message: 'Show removido.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put("/api/content", authenticateToken, async (req, res) => {
    try {
        await getDb().collection("content").doc("site").set(req.body, { merge: true });
        res.json({ message: 'Conteúdo salvo com sucesso!', content: req.body });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Image Upload
app.post("/api/upload", authenticateToken, (req, res) => {
    const bb = busboy({ headers: req.headers });
    const uploadPromises = [];
    let uploadedFile = null;

    bb.on("file", (name, file, info) => {
        const { filename, mimeType } = info;
        const ext = path.extname(filename).toLowerCase();
        const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        
        if (!allowedExts.includes(ext)) {
            stream.resume();
            return;
        }

        const newFilename = `gallery_upload_${Date.now()}${ext}`;
        const cloudFile = getBucket().file(`gallery/${newFilename}`);
        
        const stream = cloudFile.createWriteStream({
            metadata: { contentType: mimeType }
        });

        const p = new Promise((resolve, reject) => {
            stream.on("finish", () => {
                uploadedFile = {
                    filename: newFilename,
                    src: `https://firebasestorage.googleapis.com/v0/b/${getBucket().name}/o/${encodeURIComponent('gallery/' + newFilename)}?alt=media`
                };
                resolve();
            });
            stream.on("error", reject);
        });
        
        uploadPromises.push(p);
        file.pipe(stream);
    });

    bb.on("close", async () => {
        try {
            await Promise.all(uploadPromises);
            if (uploadedFile) {
                res.json({ message: "Imagem enviada!", ...uploadedFile });
            } else {
                res.status(400).json({ message: "Nenhum arquivo processado." });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    bb.on("error", (e) => res.status(500).json({ error: e.message }));

    if (req.rawBody) {
        bb.end(req.rawBody);
    } else {
        req.pipe(bb);
    }
});

// Delete Image
app.delete("/api/images/:filename", authenticateToken, async (req, res) => {
    try {
        const file = getBucket().file(`gallery/${req.params.filename}`);
        await file.delete();
        res.json({ message: 'Imagem removida com sucesso.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Initial Setup/Migration Endpoint
app.post("/api/setup-data", async (req, res) => {
    try {
        const fs = require("fs");
        const path = require("path");

        // Migrar Shows
        const showsPath = path.join(__dirname, "data", "shows.json");
        if (fs.existsSync(showsPath)) {
            const shows = JSON.parse(fs.readFileSync(showsPath, "utf-8"));
            for (const show of shows) {
                const { id, ...data } = show;
                await getDb().collection("shows").doc(String(id)).set(data);
            }
        }

        // Migrar Conteúdo
        const contentPath = path.join(__dirname, "data", "content.json");
        if (fs.existsSync(contentPath)) {
            const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
            await getDb().collection("content").doc("site").set(content);
        }

        res.json({ message: "Dados migrados com sucesso!" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

exports.api = onRequest({ region: "us-central1" }, app);
