# 🗂️ Guide de Présentation — TP1 MongoDB CRUD & Requêtes
> **À lire en priorité** : Ce document a été conçu pour t'aider à présenter ton TP1 de manière fluide et professionnelle devant le professeur. Suis les étapes une à une.

---

## 🚀 Étape 1 : Préparation de l'environnement (Avant la présentation)

Pour faire la démonstration, tu as besoin que MongoDB tourne et d'être connecté au shell `mongosh`. Deux méthodes sont possibles selon ta configuration :

### Option A : Lancer via Docker (Méthode officielle du TP)
1. Si un MongoDB local tourne sur ta machine, il faut libérer le port `27017` :
   ```bash
   sudo systemctl stop mongod
   ```
2. Lance ou démarre le conteneur Docker MongoDB :
   ```bash
   docker start mongo-tp1 || docker run -d --name mongo-tp1 -p 27017:27017 mongo:7
   ```
3. Connecte-toi au shell interactif `mongosh` dans le conteneur :
   ```bash
   docker exec -it mongo-tp1 mongosh
   ```

### Option B : Utiliser le MongoDB local (Alternative rapide)
Si Docker pose problème ou si le MongoDB système est déjà actif, connecte-toi simplement en local :
```bash
mongosh
```

---

## 📦 Étape 2 : Initialisation du jeu de données (À exécuter dans mongosh)

Une fois connecté à `mongosh` (tu devrais voir le prompt `test>`), copie-colle le bloc suivant pour créer la base de données `boutique` et insérer les **produits de départ** requis pour le TP :

```javascript
use boutique

db.produits.insertMany([
  { "sku": "PRD-001", "nom": "Casque Bluetooth", "categorie": "audio", "prix": 79.99, "stock": 120, "tags": ["sans-fil", "bluetooth"], "fournisseur": { "nom": "TechCorp", "pays": "FR" } },
  { "sku": "PRD-002", "nom": "Barre de son", "categorie": "audio", "prix": 59.99, "stock": 45, "tags": ["promo", "filaire"], "fournisseur": { "nom": "SoundPro", "pays": "FR" } },
  { "sku": "PRD-003", "nom": "Casque premium", "categorie": "audio", "prix": 149.99, "stock": 0, "tags": ["sans-fil"], "fournisseur": { "nom": "AudioMax", "pays": "DE" } },
  { "sku": "PRD-004", "nom": "Enceinte Bluetooth", "categorie": "audio", "prix": 45.00, "stock": 80, "tags": ["promo", "sans-fil"], "fournisseur": { "nom": "SoundPro", "pays": "FR" } },
  { "sku": "PRD-005", "nom": "Ecouteurs filaires", "categorie": "audio", "prix": 15.00, "stock": 150, "tags": ["budget"], "fournisseur": { "nom": "LogiCorp", "pays": "FR" } }
])
```

---

## 💻 Étape 3 : Déroulement pas-à-pas de la présentation

Exécute chaque requête de ton fichier `tp1_crud.js` dans le shell devant le professeur et donne les explications suivantes :

### 🔹 PARTIE 1 : Opérations CRUD de base

#### 1. Insertion de 3 produits informatique (Create)
* **Commande :**
  ```javascript
  db.produits.insertMany([
    { sku: "PRD-101", nom: "Souris sans fil", categorie: "informatique", prix: 25.99, stock: 50, fournisseur: { nom: "LogiCorp", pays: "FR" } },
    { sku: "PRD-102", nom: "Clavier mecanique", categorie: "informatique", prix: 85.00, stock: 30, fournisseur: { nom: "KeyMaster", pays: "DE" } },
    { sku: "PRD-103", nom: "Ecran 27 pouces", categorie: "informatique", prix: 199.99, stock: 15, fournisseur: { nom: "VisionPro", pays: "CN" } }
  ]);
  ```
* **Explication orale :** *"On utilise `insertMany` pour insérer un tableau de documents JSON. MongoDB génère automatiquement un identifiant unique `_id` de type ObjectId pour chaque document."*

#### 2. Recherche filtrée : Produits audio < 100€ (Read)
* **Commande :**
  ```javascript
  db.produits.find({ categorie: "audio", prix: { $lt: 100 } });
  ```
* **Explication orale :** *"On effectue une recherche avec `find`. On applique deux critères : la catégorie exacte et un opérateur de comparaison `$lt` (Less Than) pour filtrer les prix inférieurs à 100€."*

#### 3. Projection : Afficher uniquement nom, prix et stock
* **Commande :**
  ```javascript
  db.produits.find({}, { _id: 0, nom: 1, prix: 1, stock: 1 });
  ```
* **Explication orale :** *"La projection permet de ne récupérer que les champs nécessaires. Ici, on met les champs à `1` pour les inclure, et on désactive explicitement `_id: 0` car il est renvoyé par défaut."*

#### 4. Mise à jour collective : Réduction de 10% sur l'audio (Update)
* **Commande :**
  ```javascript
  db.produits.updateMany({ categorie: "audio" }, { $mul: { prix: 0.9 } });
  ```
* **Explication orale :** *"Pour modifier plusieurs documents, on utilise `updateMany`. L'opérateur `$mul` permet de multiplier le prix actuel par 0.9 pour appliquer la réduction de 10% de manière atomique, sans avoir à lire et réécrire la donnée en deux étapes."*

#### 5. Incrémentation de stock pour PRD-001 (Update)
* **Commande :**
  ```javascript
  db.produits.updateOne({ sku: "PRD-001" }, { $inc: { stock: 5 } });
  ```
* **Explication orale :** *"On utilise `updateOne` pour cibler un produit unique via son SKU. L'opérateur `$inc` ajoute 5 unités au stock actuel. C'est une opération atomique idéale pour éviter les conflits d'accès concurrents sur les stocks."*

#### 6. Suppression des produits en rupture (Delete)
* **Commande :**
  ```javascript
  db.produits.deleteMany({ stock: 0 });
  ```
* **Explication orale :** *"On supprime définitivement tous les documents répondant au filtre de stock égal à 0 avec `deleteMany` (comme notre produit PRD-003)."*

---

### 🔹 PARTIE 2 : Requêtes avancées

#### 1. Filtre sur document imbriqué (Fournisseur en France)
* **Commande :**
  ```javascript
  db.produits.find({ "fournisseur.pays": "FR" });
  ```
* **Explication orale :** *"MongoDB supporte les structures imbriquées. Pour interroger un sous-document, on utilise la notation pointée `"fournisseur.pays"`. Les guillemets sont obligatoires ici."*

#### 2. Recherche dans un tableau (Tag "promo")
* **Commande :**
  ```javascript
  db.produits.find({ tags: "promo" });
  ```
* **Explication orale :** *"Pour interroger un tableau, il suffit de passer la valeur recherchée. MongoDB comprend automatiquement qu'il doit parcourir les éléments du tableau `tags` pour trouver la correspondance."*

#### 3. Top 5 des produits les plus chers
* **Commande :**
  ```javascript
  db.produits.find().sort({ prix: -1 }).limit(5);
  ```
* **Explication orale :** *"On chaîne les méthodes : `sort({ prix: -1 })` trie par ordre décroissant (1 pour croissant) et `limit(5)` restreint le résultat aux 5 premiers éléments."*

#### 4. Nombre de produits par catégorie (Agrégation)
* **Commande :**
  ```javascript
  db.produits.aggregate([{ $group: { _id: "$categorie", total: { $sum: 1 } } }]);
  ```
* **Explication orale :** *"Pour faire des statistiques, on utilise le framework d'agrégation. L'étape `$group` regroupe les documents par le champ `$categorie` (le symbole `$` indique qu'on fait référence à la valeur du champ), et on incrémente de 1 avec `$sum` pour compter."*

#### 5. Intervalle de prix et tri alphabétique
* **Commande :**
  ```javascript
  db.produits.find({ prix: { $gte: 50, $lte: 150 } }).sort({ nom: 1 });
  ```
* **Explication orale :** *"On combine `$gte` (Greater Than or Equal) et `$lte` (Less Than or Equal) pour définir une plage de prix, puis on trie alphabétiquement par le nom (`nom: 1`)."*

---

### 🔹 PARTIE 3 : Modélisation des avis clients (Embedding)

#### 1. Explication théorique du choix (Le point le plus important !)
Le professeur te demandera pourquoi tu as choisi d'intégrer les avis directement (Embedding) plutôt que de créer une collection `avis` séparée (Référencement).
* **Ta réponse :**
  > *"Puisque chaque produit a peu d'avis (< 20) et qu'on affiche toujours le produit et ses avis ensemble, **l'Embedding (Imbrication)** est le meilleur choix.*
  > *Le principe fondamental de MongoDB est **'les données accédées ensemble doivent être stockées ensemble'**. Cela évite de faire des jointures (`$lookup`), ce qui améliore considérablement les performances de lecture. De plus, avec moins de 20 avis par produit, on reste très loin de la limite de taille des documents MongoDB qui est de 16 Mo."*

#### 2. Insertion de 2 avis pour le produit "PRD-001"
* **Commande :**
  ```javascript
  db.produits.updateOne(
    { sku: "PRD-001" },
    { $push: { avis: { $each: [
      { utilisateur: "Alice", note: 5, commentaire: "Super produit !" },
      { utilisateur: "Bob", note: 4, commentaire: "Tres bien." }
    ]}}}
  );
  ```
* **Explication orale :** *"On utilise `$push` combiné avec `$each` pour ajouter plusieurs sous-documents d'un coup dans le tableau `avis` du produit ciblé."*

#### 3. Vérification visuelle
* **Commande :**
  ```javascript
  db.produits.findOne({ sku: "PRD-001" }, { nom: 1, avis: 1 });
  ```
* **Explication orale :** *"On vérifie avec un `findOne` et une projection que les avis d'Alice et Bob sont bien imbriqués au sein du document du produit."*

---

## 🧠 Étape 4 : Questions pièges potentielles du professeur

| Question | Réponse recommandée |
| :--- | :--- |
| **Pourquoi MongoDB et pas MySQL/PostgreSQL ?** | *"MongoDB est une base NoSQL orientée documents. Elle offre un schéma flexible (pas besoin de définir des tables strictes à l'avance), ce qui permet d'évoluer rapidement et de stocker des données semi-structurées de manière naturelle sous forme de JSON (BSON en interne)."* |
| **Quelle est la différence entre `$set` et `$inc` ?** | *"`$set` remplace la valeur d'un champ par une nouvelle valeur fixe. `$inc` ajoute ou soustrait une valeur relative par rapport à la valeur existante (très utile pour la gestion de stocks ou de compteurs)."* |
| **Qu'est-ce que le BSON ?** | *"C'est le format binaire de JSON utilisé par MongoDB en interne pour stocker les documents. Il permet des parcours de données plus rapides et supporte des types supplémentaires comme les dates et les ObjectIds."* |
| **Pourquoi le champ `_id` est-il important ?** | *"Chaque document MongoDB doit posséder un champ `_id` unique qui sert de clé primaire. S'il n'est pas spécifié à l'insertion, MongoDB génère automatiquement un ObjectId de 12 octets contenant un timestamp, un identifiant machine, un PID et un compteur."* |
