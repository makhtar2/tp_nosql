use boutique;

// --- DÉBUT SEED MONGODB ---

// 1. Nettoyage
print("Nettoyage des collections...");
db.produits.drop();
db.clients.drop();
db.commandes.drop();

// 2. Seeding Produits (TP1)
print("Seeding de la collection 'produits'...");
db.produits.insertMany([
  { "sku": "PRD-001", "nom": "Casque Bluetooth", "categorie": "audio", "prix": 79.99, "stock": 120, "tags": ["sans-fil", "bluetooth"], "fournisseur": { "nom": "TechCorp", "pays": "FR" }, "avis": [] },
  { "sku": "PRD-002", "nom": "Barre de son", "categorie": "audio", "prix": 59.99, "stock": 45, "tags": ["promo", "filaire"], "fournisseur": { "nom": "SoundPro", "pays": "FR" } },
  { "sku": "PRD-003", "nom": "Casque premium", "categorie": "audio", "prix": 149.99, "stock": 0, "tags": ["sans-fil"], "fournisseur": { "nom": "AudioMax", "pays": "DE" } },
  { "sku": "PRD-004", "nom": "Enceinte Bluetooth", "categorie": "audio", "prix": 45.00, "stock": 80, "tags": ["promo", "sans-fil"], "fournisseur": { "nom": "SoundPro", "pays": "FR" } },
  { "sku": "PRD-005", "nom": "Ecouteurs filaires", "categorie": "audio", "prix": 15.00, "stock": 150, "tags": ["budget"], "fournisseur": { "nom": "LogiCorp", "pays": "FR" } },
  { "sku": "PRD-006", "nom": "Smartphone X1", "categorie": "telephonie", "prix": 499.99, "stock": 25, "tags": ["haut-de-gamme"], "fournisseur": { "nom": "SmartPhonia", "pays": "CN" } },
  { "sku": "PRD-007", "nom": "Chargeur Rapide", "categorie": "telephonie", "prix": 29.99, "stock": 200, "tags": ["promo", "accessoire"], "fournisseur": { "nom": "PowerUp", "pays": "FR" } }
]);

// 3. Seeding Clients (TP2)
print("Seeding de la collection 'clients'...");
db.clients.insertMany([
  { _id: ObjectId("60c72b2f9b1d8b2bad871101"), nom: "Martin", ville: "Lyon", segment: "premium", email: "martin@email.fr" },
  { _id: ObjectId("60c72b2f9b1d8b2bad871102"), nom: "Bernard", ville: "Paris", segment: "standard", email: "bernard@email.fr" },
  { _id: ObjectId("60c72b2f9b1d8b2bad871103"), nom: "Thomas", ville: "Marseille", segment: "premium", email: "thomas@email.fr" },
  { _id: ObjectId("60c72b2f9b1d8b2bad871104"), nom: "Petit", ville: "Lyon", segment: "standard", email: "petit@email.fr" },
  { _id: ObjectId("60c72b2f9b1d8b2bad871105"), nom: "Durand", ville: "Paris", segment: "premium", email: "durand@email.fr" }
]);

// 4. Seeding Commandes (TP2)
print("Seeding de la collection 'commandes'...");
db.commandes.insertMany([
  {
    _id: ObjectId("60c72b2f9b1d8b2bad872201"),
    client_id: ObjectId("60c72b2f9b1d8b2bad871101"),
    date: ISODate("2026-01-10T10:00:00Z"),
    lignes: [
      { sku: "PRD-001", qte: 2, prix_unitaire: 79.99 },
      { sku: "PRD-002", qte: 1, prix_unitaire: 59.99 }
    ],
    statut: "livree",
    montant_total: 219.97
  },
  {
    _id: ObjectId("60c72b2f9b1d8b2bad872202"),
    client_id: ObjectId("60c72b2f9b1d8b2bad871102"),
    date: ISODate("2026-01-15T14:30:00Z"),
    lignes: [
      { sku: "PRD-004", qte: 1, prix_unitaire: 45.00 }
    ],
    statut: "livree",
    montant_total: 45.00
  },
  {
    _id: ObjectId("60c72b2f9b1d8b2bad872203"),
    client_id: ObjectId("60c72b2f9b1d8b2bad871101"),
    date: ISODate("2026-02-05T09:15:00Z"),
    lignes: [
      { sku: "PRD-005", qte: 5, prix_unitaire: 15.00 }
    ],
    statut: "livree",
    montant_total: 75.00
  },
  {
    _id: ObjectId("60c72b2f9b1d8b2bad872204"),
    client_id: ObjectId("60c72b2f9b1d8b2bad871103"),
    date: ISODate("2026-02-12T18:00:00Z"),
    lignes: [
      { sku: "PRD-001", qte: 1, prix_unitaire: 79.99 },
      { sku: "PRD-003", qte: 1, prix_unitaire: 149.99 }
    ],
    statut: "livree",
    montant_total: 229.98
  },
  {
    _id: ObjectId("60c72b2f9b1d8b2bad872205"),
    client_id: ObjectId("60c72b2f9b1d8b2bad871104"),
    date: ISODate("2026-03-01T11:00:00Z"),
    lignes: [
      { sku: "PRD-002", qte: 2, prix_unitaire: 59.99 }
    ],
    statut: "en_cours",
    montant_total: 119.98
  },
  {
    _id: ObjectId("60c72b2f9b1d8b2bad872206"),
    client_id: ObjectId("60c72b2f9b1d8b2bad871105"),
    date: ISODate("2026-03-22T15:45:00Z"),
    lignes: [
      { sku: "PRD-001", qte: 3, prix_unitaire: 79.99 }
    ],
    statut: "livree",
    montant_total: 239.97
  }
]);

print("Seeding terminé avec succès pour MongoDB !");
