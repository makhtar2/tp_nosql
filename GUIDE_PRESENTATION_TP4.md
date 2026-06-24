# 🗂️ Guide de Présentation — TP4 Neo4j & Cypher
> **À lire en priorité** : Ce document a été conçu pour t'aider à présenter ton TP4 de manière fluide et professionnelle devant le professeur. Suis les étapes une à une.

---

## 🚀 Étape 1 : Préparation de l'environnement (Avant la présentation)

Pour faire la démonstration, tu as besoin que Neo4j tourne sur Docker. 

1. Démarre le conteneur Docker Neo4j :
   ```bash
   docker start neo4j-tp4 || docker run -d --name neo4j-tp4 -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password123 neo4j:5
   ```
2. Ouvre ton navigateur internet à l'adresse suivante :
   👉 **[http://localhost:7474](http://localhost:7474)**
3. Connecte-toi avec les identifiants :
   * **Username** : `neo4j`
   * **Password** : `password123`

---

## 📦 Étape 2 : Chargement du graphe (À exécuter dans la console Neo4j)

Copie et exécute ce premier bloc pour réinitialiser la base et charger tous les nœuds et relations requis :

```cypher
MATCH (n) DETACH DELETE n;

CREATE (:Interet {nom: "Sport"});
CREATE (:Interet {nom: "Musique"});
CREATE (:Interet {nom: "Tech"});
CREATE (:Interet {nom: "Voyage"});

CREATE (:Personne {nom: "Alice",   age: 28, ville: "Paris"});
CREATE (:Personne {nom: "Bob",     age: 32, ville: "Lyon"});
CREATE (:Personne {nom: "Charlie", age: 25, ville: "Paris"});
CREATE (:Personne {nom: "Diana",   age: 29, ville: "Marseille"});
CREATE (:Personne {nom: "Eve",     age: 35, ville: "Lille"});
CREATE (:Personne {nom: "Franck",  age: 40, ville: "Lyon"});
CREATE (:Personne {nom: "Grace",   age: 22, ville: "Paris"});
CREATE (:Personne {nom: "Hugo",    age: 31, ville: "Bordeaux"});

MATCH (alice:Personne {nom:"Alice"}),(bob:Personne {nom:"Bob"}),(charlie:Personne {nom:"Charlie"}),(diana:Personne {nom:"Diana"}),(eve:Personne {nom:"Eve"}),(franck:Personne {nom:"Franck"}),(grace:Personne {nom:"Grace"}),(hugo:Personne {nom:"Hugo"})
CREATE (alice)-[:SUIT]->(bob),(alice)-[:SUIT]->(charlie),(alice)-[:SUIT]->(diana),(bob)-[:SUIT]->(alice),(bob)-[:SUIT]->(eve),(charlie)-[:SUIT]->(diana),(charlie)-[:SUIT]->(franck),(diana)-[:SUIT]->(eve),(eve)-[:SUIT]->(franck),(eve)-[:SUIT]->(grace),(franck)-[:SUIT]->(hugo),(franck)-[:SUIT]->(bob),(grace)-[:SUIT]->(alice),(hugo)-[:SUIT]->(charlie);

MATCH (alice:Personne {nom:"Alice"}),(bob:Personne {nom:"Bob"}),(charlie:Personne {nom:"Charlie"}),(diana:Personne {nom:"Diana"}),(eve:Personne {nom:"Eve"}),(franck:Personne {nom:"Franck"}),(grace:Personne {nom:"Grace"}),(hugo:Personne {nom:"Hugo"}),(sport:Interet {nom:"Sport"}),(musique:Interet {nom:"Musique"}),(tech:Interet {nom:"Tech"}),(voyage:Interet {nom:"Voyage"})
CREATE (alice)-[:AIME]->(tech),(alice)-[:AIME]->(voyage),(bob)-[:AIME]->(sport),(charlie)-[:AIME]->(musique),(charlie)-[:AIME]->(tech),(diana)-[:AIME]->(voyage),(eve)-[:AIME]->(sport),(franck)-[:AIME]->(musique),(grace)-[:AIME]->(tech),(hugo)-[:AIME]->(voyage);
```

> **Conseil visuel pour épater le professeur :**
> Après l'insertion, clique sur le ballon `Personne` ou exécute `MATCH (n) RETURN n LIMIT 25;` puis clique sur l'icône de vue **Graphe** à gauche pour afficher le réseau sous forme de boules colorées interactives.

---

## 💻 Étape 3 : Déroulement pas-à-pas de la présentation (Partie 2)

Exécute chaque requête de ton fichier `tp4_cypher.cypher` l'une après l'autre et donne l'explication associée.

### 1. Lister toutes les personnes de Paris
* **Commande :**
  ```cypher
  MATCH (p:Personne {ville: "Paris"}) RETURN p.nom;
  ```
* **Résultat attendu :** Alice, Charlie, Grace.
* **Explication :** *"On filtre les nœuds possédant le label `:Personne` ayant la propriété `ville` égale à 'Paris'."*

### 2. Personnes suivies directement par Alice
* **Commande :**
  ```cypher
  MATCH (a:Personne {nom: "Alice"})-[:SUIT]->(p) RETURN p.nom;
  ```
* **Résultat attendu :** Bob, Charlie, Diana.
* **Explication :** *"On part du nœud Alice et on suit les relations sortantes de type `:SUIT` pour récupérer les noms des destinataires."*

### 3. Amis d'amis d'Alice (2 sauts, exclure Alice)
* **Commande :**
  ```cypher
  MATCH (a:Personne {nom: "Alice"})-[:SUIT]->()-[:SUIT]->(p)
  WHERE p.nom <> "Alice"
  RETURN DISTINCT p.nom;
  ```
* **Résultat attendu :** Eve, Franck, Diana.
* **Explication :** *"On définit un chemin à deux relations `:SUIT` (2 sauts). On utilise un nœud anonyme au milieu `()` et on filtre avec `WHERE` pour ne pas suggérer Alice elle-même."*

### 4. Personnes partageant un intérêt commun avec Alice
* **Commande :**
  ```cypher
  MATCH (a:Personne {nom: "Alice"})-[:AIME]->(i)<-[:AIME]-(p)
  RETURN DISTINCT p.nom, i.nom AS interet;
  ```
* **Résultat attendu :** Hugo (Voyage), Diana (Voyage), Grace (Tech), Charlie (Tech).
* **Explication :** *"On recherche des chemins en V : Alice aime un intérêt `i`, qui est également aimé par une autre personne `p`."*

### 5. Top 3 des personnes les plus suivies (Influenceurs)
* **Commande :**
  ```cypher
  MATCH (p:Personne)<-[:SUIT]-()
  RETURN p.nom, count(*) AS suiveurs
  ORDER BY suiveurs DESC LIMIT 3;
  ```
* **Résultat attendu :** Les 3 premiers avec un score de 2 suiveurs (ex: Bob, Charlie, Alice).
* **Explication :** *"On compte le nombre de relations entrantes `:SUIT` pour chaque personne à l'aide de la fonction d'agrégation `count(*)`, on trie par ordre décroissant et on limite aux 3 premiers résultats."*

### 6. Plus court chemin social entre Alice et Eve
* **Commande :**
  ```cypher
  MATCH path = shortestPath((a:Personne {nom:"Alice"})-[:SUIT*..10]-(e:Personne {nom:"Eve"}))
  RETURN path;
  ```
* **Résultat attendu :** Le graphe affiche le chemin reliant Alice à Eve via Grace (`Alice <- Grace <- Eve`).
* **Explication :** *"La fonction `shortestPath` utilise l'algorithme BFS (Breadth-First Search) en interne pour trouver le chemin comportant le moins de relations entre deux nœuds, ici limité à un maximum de 10 sauts."*

### 7. Détecter les relations de suivi réciproques
* **Commande :**
  ```cypher
  MATCH (a:Personne)-[:SUIT]->(b:Personne)-[:SUIT]->(a)
  WHERE elementId(a) < elementId(b)
  RETURN a.nom, b.nom;
  ```
* **Résultat attendu :** Alice, Bob.
* **Explication :** *"On cherche des cycles de longueur 2. La clause `WHERE elementId(a) < elementId(b)` est indispensable pour éviter d'afficher deux fois chaque paire de manière inversée (ex: Alice-Bob et Bob-Alice)."*

---

## 🧠 Étape 4 : Recommandation et Questions de cours (Parties 3 & 4)

### 🔹 Partie 3 — Recommandation d'amis intelligente
* **Commande :**
  ```cypher
  MATCH (alice:Personne {nom: "Alice"})-[:SUIT]->(ami)-[:SUIT]->(suggestion)
  WHERE NOT (alice)-[:SUIT]->(suggestion) AND alice <> suggestion
  RETURN DISTINCT suggestion.nom, count(ami) AS amis_communs
  ORDER BY amis_communs DESC
  LIMIT 5;
  ```
* **Résultat attendu :**
  1. **Eve** (2 amis communs : Bob et Diana la suivent)
  2. **Franck** (1 ami commun : Charlie le suit)
* **Explication :** *"On cherche les personnes suivies par les amis d'Alice, en filtrant pour éliminer les personnes qu'Alice suit déjà et elle-même. On compte le nombre d'amis communs pour trier les suggestions par pertinence."*

### 🔹 Partie 4 — Questions pièges du professeur
* **Pourquoi est-ce dur en SQL ?**
  *"En SQL, chaque saut relationnel nécessite une jointure `JOIN` sur la table d'association. Pour $N$ sauts, il faut $N$ jointures. Les performances s'effondrent de manière exponentielle en raison de la multiplication des tables de jointures."*
* **Quelle limite avec 100 millions de nœuds ?**
  *"La consommation de mémoire RAM (car Neo4j doit conserver le graphe en cache pour rester performant) et les super-nœuds (nœuds ayant des millions de relations qui ralentissent considérablement les parcours)."*
