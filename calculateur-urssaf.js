/* Calculateur Urssaf : taux 2026 de la feuille « Taux » du classeur gratuit, relevés le 09/10/2026.
   Taux en millièmes de pour cent (cotisations sociales + autres contributions) pour calculer en centimes entiers. */
(function (root) {
  var ACTIVITES = {
    vente: { nom: 'Vente de marchandises, restauration, hébergement', taux: 12412 },
    services: { nom: 'Prestations de services commerciales ou BIC', taux: 21348 },
    artisanat: { nom: 'Prestations de services artisanales', taux: 21980 },
    liberal: { nom: 'Profession libérale non réglementée (BNC)', taux: 25800 },
    cipav: { nom: 'Profession libérale réglementée (Cipav)', taux: 23400 }
  };
  // ca en euros (nombre >= 0) -> { tauxPct, aMettreDeCote, reste } en euros arrondis au centime
  function calculer(activite, ca) {
    var a = ACTIVITES[activite];
    if (!a || !isFinite(ca) || ca < 0) return null;
    var cents = Math.round(ca * 100);
    var due = Math.round(cents * a.taux / 100000);
    return { tauxPct: a.taux / 1000, aMettreDeCote: due / 100, reste: (cents - due) / 100 };
  }
  root.CalcUrssaf = { ACTIVITES: ACTIVITES, calculer: calculer };
  if (typeof module !== 'undefined') module.exports = root.CalcUrssaf;
})(typeof window !== 'undefined' ? window : globalThis);
