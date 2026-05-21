const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Subistitua pelo caminho para sua chave de serviço se necessário
// Ou apenas rode em um ambiente onde o Application Default Credentials está disponível
admin.initializeApp({
  projectId: "danger-kiss-cover"
});

const db = admin.firestore();

const migrate = async () => {
  console.log("Iniciando migração...");

  // Migrar Shows
  const showsPath = path.join(__dirname, "..", "backend", "data", "shows.json");
  if (fs.existsSync(showsPath)) {
    const shows = JSON.parse(fs.readFileSync(showsPath, "utf-8"));
    console.log(`Migrando ${shows.length} shows...`);
    for (const show of shows) {
      // Usar o ID do JSON como ID do doc ou deixar o Firestore gerar
      const { id, ...data } = show;
      await db.collection("shows").doc(String(id)).set(data);
    }
    console.log("Shows migrados!");
  }

  // Migrar Conteúdo
  const contentPath = path.join(__dirname, "..", "backend", "data", "content.json");
  if (fs.existsSync(contentPath)) {
    const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
    console.log("Migrando conteúdo do site...");
    await db.collection("content").doc("site").set(content);
    console.log("Conteúdo migrado!");
  }

  console.log("Migração concluída com sucesso!");
};

migrate().catch(console.error);
