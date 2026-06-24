// PARTIE 1 — CHARGEMENT DU GRAPHE

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

// PARTIE 2 — REQUÊTES

MATCH (p:Personne {ville: "Paris"}) RETURN p.nom;

MATCH (a:Personne {nom: "Alice"})-[:SUIT]->(p) RETURN p.nom;

MATCH (a:Personne {nom: "Alice"})-[:SUIT]->()-[:SUIT]->(p)
WHERE p.nom <> "Alice"
RETURN DISTINCT p.nom;

MATCH (a:Personne {nom: "Alice"})-[:AIME]->(i)<-[:AIME]-(p)
RETURN DISTINCT p.nom, i.nom AS interet;

MATCH (p:Personne)<-[:SUIT]-()
RETURN p.nom, count(*) AS suiveurs
ORDER BY suiveurs DESC LIMIT 3;

MATCH path = shortestPath((a:Personne {nom:"Alice"})-[:SUIT*..10]-(e:Personne {nom:"Eve"}))
RETURN path;

MATCH (a:Personne)-[:SUIT]->(b:Personne)-[:SUIT]->(a)
WHERE id(a) < id(b)
RETURN a.nom, b.nom;

// PARTIE 3 — RECOMMANDATION

MATCH (alice:Personne {nom: "Alice"})-[:SUIT]->(ami)-[:SUIT]->(suggestion)
WHERE NOT (alice)-[:SUIT]->(suggestion) AND alice <> suggestion
RETURN DISTINCT suggestion.nom, count(ami) AS amis_communs
ORDER BY amis_communs DESC
LIMIT 5;
