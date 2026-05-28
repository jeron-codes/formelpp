// ══════════════════════════════════════════════════════════════════
//  Materialien & Konstanten
//  Wird im Taschenrechner als Dropdown angeboten, wenn eine Variable
//  einen Material-Lookup hat (z.B. Dichte, Wärmekapazität, ρ_el)
//
//  EINHEITEN:
//   dichte          → kg/m³
//   waermekapazitaet→ J/(kg·K)
//   spez_widerstand → Ω·mm²/m   (passt zu R = ρ·l/A mit l[m], A[mm²])
//   ausdehnungskoeff→ 10⁻⁶/K    (Werte als Integer, Formel-Calc ×1e-6)
//   elastizitaetsmodul → N/mm²  (= MPa, gebräuchlich in CH Berufsschule)
//   brechungsindex  → dimensionslos
// ══════════════════════════════════════════════════════════════════

const MATERIALIEN = {

  // ── Dichte ρ [kg/m³] ─────────────────────────────────────────────
  dichte: {
    label: 'Dichte ρ',
    unit:  'kg/m³',
    options: [
      { name: 'Aluminium (Al)',     v: 2700   },
      { name: 'Blei (Pb)',          v: 11340  },
      { name: 'Bronze',             v: 8700   },
      { name: 'Eisen (Fe)',         v: 7874   },
      { name: 'Gold (Au)',          v: 19300  },
      { name: 'Gusseisen',          v: 7200   },
      { name: 'Holz (trocken, Ø)', v: 600    },
      { name: 'Kupfer (Cu)',        v: 8960   },
      { name: 'Luft (20 °C)',       v: 1.204  },
      { name: 'Messing',            v: 8500   },
      { name: 'Nickel (Ni)',        v: 8908   },
      { name: 'Silber (Ag)',        v: 10490  },
      { name: 'Stahl',              v: 7850   },
      { name: 'Titan (Ti)',         v: 4507   },
      { name: 'Wasser (20 °C)',     v: 998    },
      { name: 'Zink (Zn)',          v: 7133   },
      { name: 'Zinn (Sn)',          v: 7287   },
    ]
  },

  // ── Spezifische Wärmekapazität c [J/(kg·K)] ──────────────────────
  waermekapazitaet: {
    label: 'Spez. Wärmekapazität c',
    unit:  'J/(kg·K)',
    options: [
      { name: 'Aluminium',   v: 897  },
      { name: 'Eisen',       v: 450  },
      { name: 'Eis (0 °C)',  v: 2090 },
      { name: 'Glas',        v: 840  },
      { name: 'Kupfer',      v: 385  },
      { name: 'Luft',        v: 1005 },
      { name: 'Öl (Heizöl)', v: 2000 },
      { name: 'Stahl',       v: 480  },
      { name: 'Wasser',      v: 4182 },
    ]
  },

  // ── Spez. el. Widerstand ρ [Ω·mm²/m] ────────────────────────────
  //  R [Ω] = ρ [Ω·mm²/m] · l [m] / A [mm²]
  spez_widerstand: {
    label: 'Spez. Widerstand ρ',
    unit:  'Ω·mm²/m',
    options: [
      { name: 'Aluminium (Al)',   v: 0.0290 },
      { name: 'Eisen (Fe)',       v: 0.1000 },
      { name: 'Gold (Au)',        v: 0.0220 },
      { name: 'Konstantan',       v: 0.5000 },
      { name: 'Kupfer (Cu)',      v: 0.0178 },
      { name: 'Messing',          v: 0.0600 },
      { name: 'Nickel (Ni)',      v: 0.0700 },
      { name: 'Silber (Ag)',      v: 0.0160 },
      { name: 'Wolfram (W)',      v: 0.0540 },
    ]
  },

  // ── Längenausdehnungskoeffizient α [10⁻⁶/K] ─────────────────────
  //  Werte als ganze Zahl in 10⁻⁶/K (z.B. 23 für Aluminium = 23×10⁻⁶/K)
  //  Formel-Calc: Δl = l₀ · α_val · 1e-6 · ΔT
  ausdehnungskoeff: {
    label: 'Ausdehnungskoeff. α',
    unit:  '10⁻⁶/K',
    options: [
      { name: 'Aluminium',  v: 23 },
      { name: 'Beton',      v: 10 },
      { name: 'Eisen',      v: 12 },
      { name: 'Glas',       v: 9  },
      { name: 'Kupfer',     v: 17 },
      { name: 'Messing',    v: 18 },
      { name: 'Stahl',      v: 12 },
      { name: 'Zink',       v: 30 },
    ]
  },

  // ── Elastizitätsmodul E [N/mm² = MPa] ────────────────────────────
  //  Gebräuchliche Einheit in CH Berufsschule (Polymechaniker)
  //  σ [N/mm²] = E [N/mm²] · ε [-]
  elastizitaetsmodul: {
    label: 'Elastizitätsmodul E',
    unit:  'N/mm²',
    options: [
      { name: 'Aluminium',    v: 70000  },
      { name: 'Beton',        v: 30000  },
      { name: 'Glas',         v: 70000  },
      { name: 'Gusseisen',    v: 100000 },
      { name: 'Holz (längs)', v: 12000  },
      { name: 'Kupfer',       v: 120000 },
      { name: 'Stahl',        v: 210000 },
      { name: 'Titan',        v: 115000 },
    ]
  },

  // ── Brechungsindex n [–] ─────────────────────────────────────────
  brechungsindex: {
    label: 'Brechungsindex n',
    unit:  '–',
    options: [
      { name: 'Luft',           v: 1.000 },
      { name: 'Wasser',         v: 1.333 },
      { name: 'Glas (Kron)',    v: 1.520 },
      { name: 'Glas (Flint)',   v: 1.700 },
      { name: 'Diamant',        v: 2.417 },
      { name: 'Plexiglas',      v: 1.490 },
    ]
  }
};
