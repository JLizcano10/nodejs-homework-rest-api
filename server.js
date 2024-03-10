const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.Promise = global.Promise;
const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;
const fs = require("fs").promises;

const createFolderIsNotExist = async (folder) => {
  try {
    await fs.mkdir(folder, { recursive: true });
    console.log(`Directory created successfully: ${folder}`);
  } catch (error) {
    console.error(`Error creating directory: ${folder}`, error);
  }
};

// Rutas de los directorios que deseas crear si no existen
const uploadDir = "./tmp";
const storeAvatar = "./public/avatars";

// Crear directorios necesarios si no existen
createFolderIsNotExist(uploadDir);
createFolderIsNotExist(storeAvatar);

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
