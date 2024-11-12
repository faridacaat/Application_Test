const express = require('express'); // Importer Express
const cors = require('cors'); // Importer CORS pour gérer les requêtes cross-origin
const oracledb = require('oracledb'); // Importer OracleDB pour la base de données
require('dotenv').config({ path: 'connexion.env' }); // Charger les variables d'environnement

const app = express(); // Initialiser Express
const port = 5000; // Définir le port du serveur

// Middleware CORS
app.use(cors());

// Configuration de connexion à la base de données Oracle
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`
};

// Route pour récupérer les utilisateurs
app.get('/api/utilisateurs', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT NOM, PRENOM, COD_STRU, COMPTE_UTIL, LIBELLE FROM SMS.UTILISATEUR');
    
    // Transformer chaque ligne en objet JSON avec des clés pour chaque champ
    const utilisateurs = result.rows.map(row => ({
      nom: row[0],
      prenom: row[1],
      cod_stru: row[2],
      compte_util: row[3],
      libelle: row[4]
    }));

    res.json(utilisateurs); // Retourne un tableau d'objets JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
