use boutique;

// --- INITIALISATION DU JEU DE DONNÉES (MOCK DATA) ---
db.produits.drop();
db.produits.insertMany([
  { "sku": "PRD-001", "nom": "Casque Bluetooth", "categorie": "audio", "prix": 79.99, "stock": 120, "tags": ["sans-fil", "bluetooth"], "fournisseur": { "nom": "TechCorp", "pays": "FR" } },
  { "sku": "PRD-002", "nom": "Barre de son", "categorie": "audio", "prix": 59.99, "stock": 45, "tags": ["promo", "filaire"], "fournisseur": { "nom": "SoundPro", "pays": "FR" } },
  { "sku": "PRD-003", "nom": "Casque premium", "categorie": "audio", "prix": 149.99, "stock": 0, "tags": ["sans-fil"], "fournisseur": { "nom": "AudioMax", "pays": "DE" } },
  { "sku": "PRD-004", "nom": "Enceinte Bluetooth", "categorie": "audio", "prix": 45.00, "stock": 80, "tags": ["promo", "sans-fil"], "fournisseur": { "nom": "SoundPro", "pays": "FR" } },
  { "sku": "PRD-005", "nom": "Ecouteurs filaires", "categorie": "audio", "prix": 15.00, "stock": 150, "tags": ["budget"], "fournisseur": { "nom": "LogiCorp", "pays": "FR" } }
]);

// PARTIE 1 — CRUD

// 1. Insertion de 3 produits informatique (Create)
db.produits.insertMany([
  { sku: "PRD-101", nom: "Souris sans fil", categorie: "informatique", prix: 25.99, stock: 50, fournisseur: { nom: "LogiCorp", pays: "FR" } },
  { sku: "PRD-102", nom: "Clavier mecanique", categorie: "informatique", prix: 85.00, stock: 30, fournisseur: { nom: "KeyMaster", pays: "DE" } },
  { sku: "PRD-103", nom: "Ecran 27 pouces", categorie: "informatique", prix: 199.99, stock: 15, fournisseur: { nom: "VisionPro", pays: "CN" } }
]);

db.produits.find({ categorie: "audio", prix: { $lt: 100 } });

db.produits.find({}, { _id: 0, nom: 1, prix: 1, stock: 1 });

db.produits.updateMany({ categorie: "audio" }, { $mul: { prix: 0.9 } });

db.produits.updateOne({ sku: "PRD-001" }, { $inc: { stock: 5 } });

db.produits.deleteMany({ stock: 0 });

// PARTIE 2 — REQUÊTES AVANCÉES

db.produits.find({ "fournisseur.pays": "FR" });

db.produits.find({ tags: "promo" });

db.produits.find().sort({ prix: -1 }).limit(5);

db.produits.aggregate([{ $group: { _id: "$categorie", total: { $sum: 1 } } }]);

db.produits.find({ prix: { $gte: 50, $lte: 150 } }).sort({ nom: 1 });

// PARTIE 3 — EMBEDDING DES AVIS

db.produits.updateOne(
  { sku: "PRD-001" },
  { $push: { avis: { $each: [
    { utilisateur: "Alice", note: 5, commentaire: "Super produit !" },
    { utilisateur: "Bob", note: 4, commentaire: "Tres bien." }
  ]}}}
);

db.produits.findOne({ sku: "PRD-001" }, { nom: 1, avis: 1 });
