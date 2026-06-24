use boutique;

// PARTIE 1 — PIPELINES D'AGRÉGATION

db.commandes.aggregate([
  { $match: { statut: "livree" } },
  { $group: { _id: null, totalCA: { $sum: "$montant_total" } } }
]);

db.commandes.aggregate([
  { $match: { statut: "livree" } },
  { $lookup: { from: "clients", localField: "client_id", foreignField: "_id", as: "info" } },
  { $unwind: "$info" },
  { $group: { _id: "$info.segment", ca: { $sum: "$montant_total" } } }
]);

db.commandes.aggregate([
  { $match: { statut: "livree" } },
  { $group: { _id: "$client_id", total: { $sum: "$montant_total" } } },
  { $sort: { total: -1 } },
  { $limit: 3 }
]);

db.commandes.aggregate([
  { $group: { _id: { annee: { $year: "$date" }, mois: { $month: "$date" } }, nb: { $sum: 1 } } },
  { $sort: { "_id.annee": 1, "_id.mois": 1 } }
]);

db.commandes.aggregate([
  { $lookup: { from: "clients", localField: "client_id", foreignField: "_id", as: "info" } },
  { $unwind: "$info" },
  { $group: { _id: "$info.ville", panier: { $avg: "$montant_total" } } }
]);

db.commandes.aggregate([
  { $unwind: "$lignes" },
  { $group: { _id: "$lignes.sku", qte_totale: { $sum: "$lignes.qte" } } },
  { $sort: { qte_totale: -1 } }
]);

// PARTIE 2 — INDEX ET EXPLAIN()

db.commandes.find({ statut: "livree" }).explain("executionStats");

db.commandes.createIndex({ statut: 1, date: -1 });

db.commandes.find({ statut: "livree" }).explain("executionStats");

db.clients.createIndex({ email: 1 }, { unique: true });

// PARTIE 3 — DÉFI

db.clients.aggregate([
  { $lookup: { from: "commandes", localField: "_id", foreignField: "client_id", as: "cmds" } },
  { $project: {
    segment: 1,
    nbCmds: { $size: "$cmds" },
    ca: { $reduce: { input: "$cmds", initialValue: 0, in: { $add: ["$$value", "$$this.montant_total"] } } }
  }},
  { $group: {
    _id: "$segment",
    nbClients: { $sum: 1 },
    caTotal: { $sum: "$ca" },
    moyenneCmds: { $avg: "$nbCmds" }
  }}
]);
