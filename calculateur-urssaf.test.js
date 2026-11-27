// node calculateur-urssaf.test.js
const assert = require('assert');
const C = require('./calculateur-urssaf.js');
const r = C.calculer('liberal', 6000);
assert.deepStrictEqual(r, { tauxPct: 25.8, aMettreDeCote: 1548, reste: 4452 });
assert.strictEqual(C.calculer('liberal', 0).aMettreDeCote, 0);
assert.strictEqual(C.calculer('vente', 1000).aMettreDeCote, 124.12);
assert.strictEqual(C.calculer('inconnu', 100), null);
assert.strictEqual(C.calculer('liberal', -5), null);
assert.strictEqual(C.calculer('liberal', NaN), null);
console.log('ok');
