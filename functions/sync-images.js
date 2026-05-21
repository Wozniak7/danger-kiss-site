const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

admin.initializeApp({
  projectId: "danger-kiss-cover",
  storageBucket: "danger-kiss-cover.firebasestorage.app"
});

const bucket = admin.storage().bucket();

const uploadImages = async () => {
  console.log("Iniciando upload de imagens...");
  const imagesDir = path.join(__dirname, "..", "public", "images");
  
  if (!fs.existsSync(imagesDir)) {
    console.log("Diretório de imagens não encontrado.");
    return;
  }

  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  console.log(`Encontradas ${imageFiles.length} imagens para upload.`);

  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    console.log(`Subindo: ${file}...`);
    try {
      await bucket.upload(filePath, {
        destination: `gallery/${file}`,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
    } catch (e) {
      console.error(`Erro ao subir ${file}:`, e.message);
    }
  }

  console.log("Upload de imagens concluído!");
};

uploadImages().catch(console.error);
