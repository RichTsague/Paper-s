const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;
const HOST = '0.0.0.0';

// Configurer le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Définir les routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
