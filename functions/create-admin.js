const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

admin.initializeApp({
  projectId: "danger-kiss-cover"
});
const db = admin.firestore();

async function createAdmin() {
  const password = process.argv[2] || 'senha123'; // Senha de fallback apenas para teste local caso omitida
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await db.collection('users').doc('admin').set({
    username: 'admin',
    passwordHash: hash
  });
  console.log("Usuário 'admin' criado/atualizado com sucesso no Firestore!");
}

createAdmin().catch(console.error);
