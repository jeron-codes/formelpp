// Formelsammlung – Datenbank
// berufe: ['alle'] | ['automatiker','elektroniker'] | ['polymechaniker'] | ['informatiker'] | …
// lehrjahr: 1–4  (kumulativ: Jahr N zeigt alle Formeln mit lehrjahr <= N)
const FORMULAS = [

  // ═══════════════════════════════════════════════
  //  PHYSIK – KINEMATIK
  // ═══════════════════════════════════════════════
  {
    id: 'phys_velocity', name: 'Geschwindigkeit (mittel)',
    category: 'Physik', sub: 'Kinematik',
    desc: 'Mittlere Geschwindigkeit: zurückgelegter Weg pro Zeiteinheit',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      v: { name: 'Geschwindigkeit', unit: 'm/s' },
      s: { name: 'Weg / Strecke',   unit: 'm'   },
      t: { name: 'Zeit',            unit: 's'   }
    },
    forms: { v: 'v = \\dfrac{s}{t}', s: 's = v \\cdot t', t: 't = \\dfrac{s}{v}' },
    calc:  { v: v => v.s/v.t, s: v => v.v*v.t, t: v => v.s/v.v },
    def: 'v'
  },
  {
    id: 'phys_accel', name: 'Beschleunigung',
    category: 'Physik', sub: 'Kinematik',
    desc: 'Gleichmäßige Beschleunigung: Geschwindigkeitsänderung pro Zeit',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      a:   { name: 'Beschleunigung',         unit: 'm/s²' },
      v:   { name: 'Endgeschwindigkeit',     unit: 'm/s'  },
      v_0: { name: 'Anfangsgeschwindigkeit', unit: 'm/s'  },
      t:   { name: 'Zeit',                   unit: 's'    }
    },
    forms: {
      a:   'a = \\dfrac{v - v_0}{t}',
      v:   'v = v_0 + a \\cdot t',
      v_0: 'v_0 = v - a \\cdot t',
      t:   't = \\dfrac{v - v_0}{a}'
    },
    calc: {
      a:   v => (v.v-v.v_0)/v.t,
      v:   v => v.v_0+v.a*v.t,
      v_0: v => v.v-v.a*v.t,
      t:   v => (v.v-v.v_0)/v.a
    },
    def: 'a'
  },
  {
    id: 'phys_kin_v2', name: 'Geschwindigkeit-Weg-Gesetz',
    category: 'Physik', sub: 'Kinematik',
    desc: 'Zusammenhang zwischen Geschwindigkeit, Anfangsgeschwindigkeit und Weg',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      v:   { name: 'Endgeschwindigkeit',     unit: 'm/s'  },
      v_0: { name: 'Anfangsgeschwindigkeit', unit: 'm/s'  },
      a:   { name: 'Beschleunigung',         unit: 'm/s²' },
      s:   { name: 'Weg',                    unit: 'm'    }
    },
    forms: {
      v:   'v^2 = v_0^2 + 2 \\cdot a \\cdot s',
      s:   's = \\dfrac{v^2 - v_0^2}{2a}',
      a:   'a = \\dfrac{v^2 - v_0^2}{2s}',
      v_0: 'v_0 = \\sqrt{v^2 - 2as}'
    },
    calc: {
      v:   v => Math.sqrt(v.v_0**2+2*v.a*v.s),
      s:   v => (v.v**2-v.v_0**2)/(2*v.a),
      a:   v => (v.v**2-v.v_0**2)/(2*v.s),
      v_0: v => Math.sqrt(v.v**2-2*v.a*v.s)
    },
    def: 'v'
  },
  {
    id: 'phys_kin_s', name: 'Weg bei gleichm. Beschleunigung',
    category: 'Physik', sub: 'Kinematik',
    desc: 'Zurückgelegter Weg bei gleichmäßiger Beschleunigung',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      s:   { name: 'Weg',                    unit: 'm'    },
      v_0: { name: 'Anfangsgeschwindigkeit', unit: 'm/s'  },
      a:   { name: 'Beschleunigung',         unit: 'm/s²' },
      t:   { name: 'Zeit',                   unit: 's'    }
    },
    forms: {
      s:   's = v_0 \\cdot t + \\dfrac{1}{2} a t^2',
      t:   't = \\dfrac{-v_0 + \\sqrt{v_0^2 + 2as}}{a}',
      a:   'a = \\dfrac{2(s - v_0 t)}{t^2}',
      v_0: 'v_0 = \\dfrac{s - \\frac{1}{2}at^2}{t}'
    },
    calc: {
      s:   v => v.v_0*v.t+0.5*v.a*v.t**2,
      t:   v => (-v.v_0+Math.sqrt(v.v_0**2+2*v.a*v.s))/v.a,
      a:   v => 2*(v.s-v.v_0*v.t)/v.t**2,
      v_0: v => (v.s-0.5*v.a*v.t**2)/v.t
    },
    def: 's'
  },

  // ═══════════════════════════════════════════════
  //  PHYSIK – DYNAMIK
  // ═══════════════════════════════════════════════
  {
    id: 'phys_newton2', name: '2. Newtonsches Gesetz',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Die Kraft ist gleich Masse mal Beschleunigung',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      F: { name: 'Kraft',          unit: 'N'    },
      m: { name: 'Masse',          unit: 'kg'   },
      a: { name: 'Beschleunigung', unit: 'm/s²' }
    },
    forms: { F: 'F = m \\cdot a', m: 'm = \\dfrac{F}{a}', a: 'a = \\dfrac{F}{m}' },
    calc:  { F: v => v.m*v.a, m: v => v.F/v.a, a: v => v.F/v.m },
    def: 'F'
  },
  {
    id: 'phys_weight', name: 'Gewichtskraft',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Gewichtskraft im Schwerefeld der Erde (g ≈ 9.81 m/s²)',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      F_G: { name: 'Gewichtskraft',    unit: 'N'    },
      m:   { name: 'Masse',            unit: 'kg'   },
      g:   { name: 'Erdbeschleunigung',unit: 'm/s²' }
    },
    forms: {
      F_G: 'F_G = m \\cdot g',
      m:   'm = \\dfrac{F_G}{g}',
      g:   'g = \\dfrac{F_G}{m}'
    },
    calc: { F_G: v => v.m*v.g, m: v => v.F_G/v.g, g: v => v.F_G/v.m },
    def: 'F_G'
  },
  {
    id: 'phys_friction', name: 'Reibungskraft',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Reibungskraft als Produkt von Reibungskoeffizient und Normalkraft',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      F_R: { name: 'Reibungskraft',     unit: 'N' },
      mu:  { name: 'Reibungskoeff. μ',  unit: '–' },
      F_N: { name: 'Normalkraft',       unit: 'N' }
    },
    forms: {
      F_R: 'F_R = \\mu \\cdot F_N',
      mu:  '\\mu = \\dfrac{F_R}{F_N}',
      F_N: 'F_N = \\dfrac{F_R}{\\mu}'
    },
    calc: { F_R: v => v.mu*v.F_N, mu: v => v.F_R/v.F_N, F_N: v => v.F_R/v.mu },
    def: 'F_R'
  },
  {
    id: 'phys_impulse', name: 'Impuls',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Impuls als Produkt von Masse und Geschwindigkeit',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      p: { name: 'Impuls',          unit: 'kg·m/s' },
      m: { name: 'Masse',           unit: 'kg'     },
      v: { name: 'Geschwindigkeit', unit: 'm/s'    }
    },
    forms: { p: 'p = m \\cdot v', m: 'm = \\dfrac{p}{v}', v: 'v = \\dfrac{p}{m}' },
    calc:  { p: v => v.m*v.v, m: v => v.p/v.v, v: v => v.p/v.m },
    def: 'p'
  },
  {
    id: 'phys_ekin', name: 'Kinetische Energie',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Bewegungsenergie eines Körpers',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      E: { name: 'kin. Energie',    unit: 'J'   },
      m: { name: 'Masse',          unit: 'kg'  },
      v: { name: 'Geschwindigkeit',unit: 'm/s' }
    },
    forms: {
      E: 'E_{kin} = \\dfrac{1}{2} m v^2',
      m: 'm = \\dfrac{2 E_{kin}}{v^2}',
      v: 'v = \\sqrt{\\dfrac{2 E_{kin}}{m}}'
    },
    calc: { E: v => 0.5*v.m*v.v**2, m: v => 2*v.E/v.v**2, v: v => Math.sqrt(2*v.E/v.m) },
    def: 'E'
  },
  {
    id: 'phys_epot', name: 'Potenzielle Energie',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Lageenergie im Schwerefeld der Erde',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      E: { name: 'pot. Energie',        unit: 'J'    },
      m: { name: 'Masse',               unit: 'kg'   },
      g: { name: 'Erdbeschleunigung',   unit: 'm/s²' },
      h: { name: 'Höhe',                unit: 'm'    }
    },
    forms: {
      E: 'E_{pot} = m \\cdot g \\cdot h',
      m: 'm = \\dfrac{E_{pot}}{g \\cdot h}',
      h: 'h = \\dfrac{E_{pot}}{m \\cdot g}',
      g: 'g = \\dfrac{E_{pot}}{m \\cdot h}'
    },
    calc: { E: v => v.m*v.g*v.h, m: v => v.E/(v.g*v.h), h: v => v.E/(v.m*v.g), g: v => v.E/(v.m*v.h) },
    def: 'E'
  },
  {
    id: 'phys_work', name: 'Mechanische Arbeit',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Arbeit als Produkt von Kraft und zurückgelegtem Weg',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      W: { name: 'Arbeit', unit: 'J' },
      F: { name: 'Kraft',  unit: 'N' },
      s: { name: 'Weg',    unit: 'm' }
    },
    forms: { W: 'W = F \\cdot s', F: 'F = \\dfrac{W}{s}', s: 's = \\dfrac{W}{F}' },
    calc:  { W: v => v.F*v.s, F: v => v.W/v.s, s: v => v.W/v.F },
    def: 'W'
  },
  {
    id: 'phys_power', name: 'Mechanische Leistung',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Leistung als Arbeit pro Zeiteinheit',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      P: { name: 'Leistung', unit: 'W' },
      W: { name: 'Arbeit',   unit: 'J' },
      t: { name: 'Zeit',     unit: 's' }
    },
    forms: { P: 'P = \\dfrac{W}{t}', W: 'W = P \\cdot t', t: 't = \\dfrac{W}{P}' },
    calc:  { P: v => v.W/v.t, W: v => v.P*v.t, t: v => v.W/v.P },
    def: 'P'
  },
  {
    id: 'phys_gravity', name: 'Gravitationskraft',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Gravitationskraft zwischen zwei Massen',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      F:  { name: 'Gravitationskraft',     unit: 'N'        },
      G:  { name: 'Gravitationskonstante', unit: 'N·m²/kg²' },
      m1: { name: 'Masse 1',               unit: 'kg'       },
      m2: { name: 'Masse 2',               unit: 'kg'       },
      r:  { name: 'Abstand',               unit: 'm'        }
    },
    forms: {
      F:  'F = G \\cdot \\dfrac{m_1 \\cdot m_2}{r^2}',
      r:  'r = \\sqrt{G \\cdot \\dfrac{m_1 m_2}{F}}',
      m1: 'm_1 = \\dfrac{F \\cdot r^2}{G \\cdot m_2}',
      m2: 'm_2 = \\dfrac{F \\cdot r^2}{G \\cdot m_1}'
    },
    calc: {
      F:  v => v.G*v.m1*v.m2/v.r**2,
      r:  v => Math.sqrt(v.G*v.m1*v.m2/v.F),
      m1: v => v.F*v.r**2/(v.G*v.m2),
      m2: v => v.F*v.r**2/(v.G*v.m1)
    },
    def: 'F'
  },
  {
    id: 'phys_hooke', name: 'Hookesches Gesetz',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Federkraft proportional zur Auslenkung',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      F: { name: 'Federkraft',     unit: 'N'   },
      D: { name: 'Federkonstante', unit: 'N/m' },
      x: { name: 'Auslenkung',     unit: 'm'   }
    },
    forms: { F: 'F = D \\cdot x', D: 'D = \\dfrac{F}{x}', x: 'x = \\dfrac{F}{D}' },
    calc:  { F: v => v.D*v.x, D: v => v.F/v.x, x: v => v.F/v.D },
    def: 'F'
  },
  {
    id: 'phys_density', name: 'Dichte',
    category: 'Physik', sub: 'Dynamik',
    desc: 'Masse pro Volumeneinheit – Material wählbar',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      rho: { name: 'Dichte ρ', unit: 'kg/m³', material: 'dichte' },
      m:   { name: 'Masse',    unit: 'kg'   },
      V:   { name: 'Volumen',  unit: 'm³'   }
    },
    forms: {
      rho: '\\rho = \\dfrac{m}{V}',
      m:   'm = \\rho \\cdot V',
      V:   'V = \\dfrac{m}{\\rho}'
    },
    calc: { rho: v => v.m/v.V, m: v => v.rho*v.V, V: v => v.m/v.rho },
    def: 'rho'
  },

  // ═══════════════════════════════════════════════
  //  PHYSIK – DREHBEWEGUNG
  // ═══════════════════════════════════════════════
  {
    id: 'phys_omega', name: 'Winkelgeschwindigkeit',
    category: 'Physik', sub: 'Drehbewegung',
    desc: 'Winkelgeschwindigkeit als Winkel pro Zeit',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      omega: { name: 'Winkelgeschwindigkeit', unit: 'rad/s' },
      phi:   { name: 'Winkel',               unit: 'rad'   },
      t:     { name: 'Zeit',                 unit: 's'     }
    },
    forms: {
      omega: '\\omega = \\dfrac{\\varphi}{t}',
      phi:   '\\varphi = \\omega \\cdot t',
      t:     't = \\dfrac{\\varphi}{\\omega}'
    },
    calc: { omega: v => v.phi/v.t, phi: v => v.omega*v.t, t: v => v.phi/v.omega },
    def: 'omega'
  },
  {
    id: 'phys_torque', name: 'Drehmoment',
    category: 'Physik', sub: 'Drehbewegung',
    desc: 'Drehmoment als Produkt von Kraft und Hebelarm',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      M: { name: 'Drehmoment', unit: 'N·m' },
      F: { name: 'Kraft',      unit: 'N'   },
      r: { name: 'Hebelarm',   unit: 'm'   }
    },
    forms: { M: 'M = F \\cdot r', F: 'F = \\dfrac{M}{r}', r: 'r = \\dfrac{M}{F}' },
    calc:  { M: v => v.F*v.r, F: v => v.M/v.r, r: v => v.M/v.F },
    def: 'M'
  },
  {
    id: 'phys_centripetal', name: 'Zentripetalkraft',
    category: 'Physik', sub: 'Drehbewegung',
    desc: 'Kraft bei Kreisbewegung (nach innen)',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      F: { name: 'Zentripetalkraft',    unit: 'N'   },
      m: { name: 'Masse',               unit: 'kg'  },
      v: { name: 'Bahngeschwindigkeit', unit: 'm/s' },
      r: { name: 'Radius',              unit: 'm'   }
    },
    forms: {
      F: 'F_Z = \\dfrac{m \\cdot v^2}{r}',
      m: 'm = \\dfrac{F_Z \\cdot r}{v^2}',
      v: 'v = \\sqrt{\\dfrac{F_Z \\cdot r}{m}}',
      r: 'r = \\dfrac{m \\cdot v^2}{F_Z}'
    },
    calc: {
      F: v => v.m*v.v**2/v.r,
      m: v => v.F*v.r/v.v**2,
      v: v => Math.sqrt(v.F*v.r/v.m),
      r: v => v.m*v.v**2/v.F
    },
    def: 'F'
  },

  // ═══════════════════════════════════════════════
  //  PHYSIK – SCHWINGUNGEN & WELLEN
  // ═══════════════════════════════════════════════
  {
    id: 'phys_period', name: 'Periode und Frequenz',
    category: 'Physik', sub: 'Wellen',
    desc: 'Kehrwert-Beziehung zwischen Periode und Frequenz',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      T: { name: 'Periodendauer', unit: 's'  },
      f: { name: 'Frequenz',      unit: 'Hz' }
    },
    forms: { T: 'T = \\dfrac{1}{f}', f: 'f = \\dfrac{1}{T}' },
    calc:  { T: v => 1/v.f, f: v => 1/v.T },
    def: 'T'
  },
  {
    id: 'phys_wave', name: 'Wellengleichung',
    category: 'Physik', sub: 'Wellen',
    desc: 'Zusammenhang zwischen Wellengeschwindigkeit, Wellenlänge und Frequenz',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      c:      { name: 'Wellengeschwindigkeit', unit: 'm/s' },
      lambda: { name: 'Wellenlänge',           unit: 'm'   },
      f:      { name: 'Frequenz',              unit: 'Hz'  }
    },
    forms: {
      c:      'c = \\lambda \\cdot f',
      lambda: '\\lambda = \\dfrac{c}{f}',
      f:      'f = \\dfrac{c}{\\lambda}'
    },
    calc: { c: v => v.lambda*v.f, lambda: v => v.c/v.f, f: v => v.c/v.lambda },
    def: 'c'
  },
  {
    id: 'phys_pendulum', name: 'Fadenpendel',
    category: 'Physik', sub: 'Wellen',
    desc: 'Schwingungsdauer eines Fadenpendels (für kleine Winkel)',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      T: { name: 'Periodendauer',     unit: 's'    },
      l: { name: 'Fadenlänge',        unit: 'm'    },
      g: { name: 'Erdbeschleunigung', unit: 'm/s²' }
    },
    forms: {
      T: 'T = 2\\pi \\sqrt{\\dfrac{l}{g}}',
      l: 'l = g \\cdot \\left(\\dfrac{T}{2\\pi}\\right)^2',
      g: 'g = l \\cdot \\left(\\dfrac{2\\pi}{T}\\right)^2'
    },
    calc: {
      T: v => 2*Math.PI*Math.sqrt(v.l/v.g),
      l: v => v.g*(v.T/(2*Math.PI))**2,
      g: v => v.l*(2*Math.PI/v.T)**2
    },
    def: 'T'
  },

  // ═══════════════════════════════════════════════
  //  PHYSIK – WÄRMELEHRE
  // ═══════════════════════════════════════════════
  {
    id: 'phys_heat', name: 'Wärmemenge',
    category: 'Physik', sub: 'Wärmelehre',
    desc: 'Wärmemenge zum Erwärmen eines Stoffes – Material wählbar',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      Q:       { name: 'Wärmemenge',           unit: 'J'        },
      m:       { name: 'Masse',                unit: 'kg'       },
      c:       { name: 'spez. Wärmekapazität', unit: 'J/(kg·K)', material: 'waermekapazitaet' },
      delta_T: { name: 'Temperaturänderung',   unit: 'K'        }
    },
    forms: {
      Q:       'Q = m \\cdot c \\cdot \\Delta T',
      m:       'm = \\dfrac{Q}{c \\cdot \\Delta T}',
      c:       'c = \\dfrac{Q}{m \\cdot \\Delta T}',
      delta_T: '\\Delta T = \\dfrac{Q}{m \\cdot c}'
    },
    calc: {
      Q:       v => v.m*v.c*v.delta_T,
      m:       v => v.Q/(v.c*v.delta_T),
      c:       v => v.Q/(v.m*v.delta_T),
      delta_T: v => v.Q/(v.m*v.c)
    },
    def: 'Q'
  },
  {
    id: 'phys_thermal_exp', name: 'Längenausdehnung',
    category: 'Physik', sub: 'Wärmelehre',
    desc: 'Längenänderung bei Temperaturänderung – Material wählbar',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      dl:    { name: 'Längenänderung Δl',     unit: 'm'       },
      l0:    { name: 'Ausgangslänge l₀',       unit: 'm'       },
      alpha: { name: 'Ausdehnungskoeff. α',    unit: '10⁻⁶/K', material: 'ausdehnungskoeff' },
      dT:    { name: 'Temperaturänderung ΔT', unit: 'K'       }
    },
    forms: {
      dl:    '\\Delta l = l_0 \\cdot \\alpha \\cdot \\Delta T \\cdot 10^{-6}',
      l0:    'l_0 = \\dfrac{\\Delta l}{\\alpha \\cdot \\Delta T \\cdot 10^{-6}}',
      alpha: '\\alpha = \\dfrac{\\Delta l}{l_0 \\cdot \\Delta T \\cdot 10^{-6}}',
      dT:    '\\Delta T = \\dfrac{\\Delta l}{l_0 \\cdot \\alpha \\cdot 10^{-6}}'
    },
    // α aus Dropdown ist in 10⁻⁶/K (z.B. 23) → mal 1e-6 für SI
    calc: {
      dl:    v => v.l0*v.alpha*1e-6*v.dT,
      l0:    v => v.dl/(v.alpha*1e-6*v.dT),
      alpha: v => v.dl/(v.l0*1e-6*v.dT),
      dT:    v => v.dl/(v.l0*v.alpha*1e-6)
    },
    def: 'dl'
  },
  {
    id: 'phys_pressure', name: 'Druck',
    category: 'Physik', sub: 'Wärmelehre',
    desc: 'Druck als Kraft pro Fläche',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      p: { name: 'Druck',  unit: 'Pa' },
      F: { name: 'Kraft',  unit: 'N'  },
      A: { name: 'Fläche', unit: 'm²' }
    },
    forms: { p: 'p = \\dfrac{F}{A}', F: 'F = p \\cdot A', A: 'A = \\dfrac{F}{p}' },
    calc:  { p: v => v.F/v.A, F: v => v.p*v.A, A: v => v.F/v.p },
    def: 'p'
  },
  {
    id: 'phys_idealgas', name: 'Ideales Gasgesetz',
    category: 'Physik', sub: 'Wärmelehre',
    desc: 'Zustandsgleichung für ideale Gase',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      p: { name: 'Druck',        unit: 'Pa'        },
      V: { name: 'Volumen',      unit: 'm³'        },
      n: { name: 'Stoffmenge',   unit: 'mol'       },
      R: { name: 'Gaskonstante', unit: 'J/(mol·K)' },
      T: { name: 'Temperatur',   unit: 'K'         }
    },
    forms: {
      p: 'p = \\dfrac{n R T}{V}',
      V: 'V = \\dfrac{n R T}{p}',
      T: 'T = \\dfrac{p V}{n R}',
      n: 'n = \\dfrac{p V}{R T}'
    },
    calc: {
      p: v => v.n*v.R*v.T/v.V,
      V: v => v.n*v.R*v.T/v.p,
      T: v => v.p*v.V/(v.n*v.R),
      n: v => v.p*v.V/(v.R*v.T)
    },
    def: 'p'
  },

  // ═══════════════════════════════════════════════
  //  PHYSIK – OPTIK
  // ═══════════════════════════════════════════════
  {
    id: 'phys_snell', name: 'Snelliussches Brechungsgesetz',
    category: 'Physik', sub: 'Optik',
    desc: 'Lichtbrechung an Grenzflächen zweier Medien',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      n1:     { name: 'Brechungsindex 1', unit: '–', material: 'brechungsindex' },
      n2:     { name: 'Brechungsindex 2', unit: '–', material: 'brechungsindex' },
      alpha1: { name: 'Einfallswinkel',   unit: '°' },
      alpha2: { name: 'Brechungswinkel',  unit: '°' }
    },
    forms: {
      n1:     'n_1 = n_2 \\cdot \\dfrac{\\sin\\alpha_2}{\\sin\\alpha_1}',
      n2:     'n_2 = n_1 \\cdot \\dfrac{\\sin\\alpha_1}{\\sin\\alpha_2}',
      alpha1: '\\sin\\alpha_1 = \\dfrac{n_2 \\cdot \\sin\\alpha_2}{n_1}',
      alpha2: '\\sin\\alpha_2 = \\dfrac{n_1 \\cdot \\sin\\alpha_1}{n_2}'
    },
    calc: {
      n1:     v => v.n2*Math.sin(v.alpha2*Math.PI/180)/Math.sin(v.alpha1*Math.PI/180),
      n2:     v => v.n1*Math.sin(v.alpha1*Math.PI/180)/Math.sin(v.alpha2*Math.PI/180),
      alpha1: v => Math.asin(v.n2*Math.sin(v.alpha2*Math.PI/180)/v.n1)*180/Math.PI,
      alpha2: v => Math.asin(v.n1*Math.sin(v.alpha1*Math.PI/180)/v.n2)*180/Math.PI
    },
    def: 'n1'
  },
  {
    id: 'phys_lens', name: 'Linsengleichung',
    category: 'Physik', sub: 'Optik',
    desc: 'Zusammenhang zwischen Brennweite, Gegenstandsweite und Bildweite',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      f: { name: 'Brennweite',       unit: 'm' },
      g: { name: 'Gegenstandsweite', unit: 'm' },
      b: { name: 'Bildweite',        unit: 'm' }
    },
    forms: {
      f: '\\dfrac{1}{f} = \\dfrac{1}{g} + \\dfrac{1}{b}',
      g: '\\dfrac{1}{g} = \\dfrac{1}{f} - \\dfrac{1}{b}',
      b: '\\dfrac{1}{b} = \\dfrac{1}{f} - \\dfrac{1}{g}'
    },
    calc: {
      f: v => (v.g*v.b)/(v.g+v.b),
      g: v => (v.f*v.b)/(v.b-v.f),
      b: v => (v.f*v.g)/(v.g-v.f)
    },
    def: 'f'
  },

  // ═══════════════════════════════════════════════
  //  PHYSIK – MATERIALPHYSIK
  // ═══════════════════════════════════════════════
  {
    id: 'phys_stress', name: 'Mechanische Spannung',
    category: 'Physik', sub: 'Materialphysik',
    desc: 'Spannung σ = Kraft pro Querschnittsfläche',
    berufe: ['polymechaniker', 'automatiker'], lehrjahr: 2,
    vars: {
      sigma: { name: 'Spannung σ',  unit: 'N/mm²' },
      F:     { name: 'Kraft',       unit: 'N'     },
      A:     { name: 'Fläche',      unit: 'mm²'   }
    },
    forms: {
      sigma: '\\sigma = \\dfrac{F}{A}',
      F:     'F = \\sigma \\cdot A',
      A:     'A = \\dfrac{F}{\\sigma}'
    },
    calc: { sigma: v => v.F/v.A, F: v => v.sigma*v.A, A: v => v.F/v.sigma },
    def: 'sigma'
  },
  {
    id: 'phys_young', name: 'Elastizitätsmodul (Hookesches Gesetz)',
    category: 'Physik', sub: 'Materialphysik',
    desc: 'Zusammenhang zwischen Spannung, E-Modul und Dehnung – Material wählbar',
    berufe: ['polymechaniker', 'automatiker'], lehrjahr: 2,
    vars: {
      sigma: { name: 'Spannung σ',         unit: 'N/mm²'  },
      E_mod: { name: 'Elastizitätsmodul E', unit: 'N/mm²', material: 'elastizitaetsmodul' },
      eps:   { name: 'Dehnung ε',           unit: '–'      }
    },
    forms: {
      sigma: '\\sigma = E \\cdot \\varepsilon',
      E_mod: 'E = \\dfrac{\\sigma}{\\varepsilon}',
      eps:   '\\varepsilon = \\dfrac{\\sigma}{E}'
    },
    calc: { sigma: v => v.E_mod*v.eps, E_mod: v => v.sigma/v.eps, eps: v => v.sigma/v.E_mod },
    def: 'sigma'
  },

  // ═══════════════════════════════════════════════
  //  MATHEMATIK – GEOMETRIE
  // ═══════════════════════════════════════════════
  {
    id: 'math_circle_area', name: 'Kreisfläche',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Flächeninhalt eines Kreises',
    berufe: ['alle'], lehrjahr: 1,
    vars: { A: { name: 'Fläche', unit: 'm²' }, r: { name: 'Radius', unit: 'm' } },
    forms: { A: 'A = \\pi r^2', r: 'r = \\sqrt{\\dfrac{A}{\\pi}}' },
    calc:  { A: v => Math.PI*v.r**2, r: v => Math.sqrt(v.A/Math.PI) },
    def: 'A'
  },
  {
    id: 'math_circle_circ', name: 'Kreisumfang',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Umfang eines Kreises',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      U: { name: 'Umfang',      unit: 'm' },
      r: { name: 'Radius',      unit: 'm' },
      d: { name: 'Durchmesser', unit: 'm' }
    },
    forms: { U: 'U = 2 \\pi r = \\pi d', r: 'r = \\dfrac{U}{2\\pi}', d: 'd = \\dfrac{U}{\\pi}' },
    calc:  { U: v => 2*Math.PI*v.r, r: v => v.U/(2*Math.PI), d: v => v.U/Math.PI },
    def: 'U'
  },
  {
    id: 'math_rect', name: 'Rechteck – Fläche',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Flächeninhalt eines Rechtecks',
    berufe: ['alle'], lehrjahr: 1,
    vars: { A: { name: 'Fläche', unit: 'm²' }, a: { name: 'Länge', unit: 'm' }, b: { name: 'Breite', unit: 'm' } },
    forms: { A: 'A = a \\cdot b', a: 'a = \\dfrac{A}{b}', b: 'b = \\dfrac{A}{a}' },
    calc:  { A: v => v.a*v.b, a: v => v.A/v.b, b: v => v.A/v.a },
    def: 'A'
  },
  {
    id: 'math_triangle', name: 'Dreieck – Fläche',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Flächeninhalt eines Dreiecks',
    berufe: ['alle'], lehrjahr: 1,
    vars: { A: { name: 'Fläche', unit: 'm²' }, g: { name: 'Grundlinie', unit: 'm' }, h: { name: 'Höhe', unit: 'm' } },
    forms: { A: 'A = \\dfrac{g \\cdot h}{2}', g: 'g = \\dfrac{2A}{h}', h: 'h = \\dfrac{2A}{g}' },
    calc:  { A: v => v.g*v.h/2, g: v => 2*v.A/v.h, h: v => 2*v.A/v.g },
    def: 'A'
  },
  {
    id: 'math_trapezoid', name: 'Trapez – Fläche',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Flächeninhalt eines Trapezes',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      A: { name: 'Fläche',          unit: 'm²' },
      a: { name: 'Parallele Seite a', unit: 'm'  },
      c: { name: 'Parallele Seite c', unit: 'm'  },
      h: { name: 'Höhe',             unit: 'm'  }
    },
    forms: { A: 'A = \\dfrac{(a + c) \\cdot h}{2}', h: 'h = \\dfrac{2A}{a + c}' },
    calc:  { A: v => (v.a+v.c)*v.h/2, h: v => 2*v.A/(v.a+v.c) },
    def: 'A'
  },
  {
    id: 'math_cylinder', name: 'Zylinder – Volumen',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Volumen eines geraden Kreiszylinders',
    berufe: ['alle'], lehrjahr: 1,
    vars: { V: { name: 'Volumen', unit: 'm³' }, r: { name: 'Radius', unit: 'm' }, h: { name: 'Höhe', unit: 'm' } },
    forms: { V: 'V = \\pi r^2 h', r: 'r = \\sqrt{\\dfrac{V}{\\pi h}}', h: 'h = \\dfrac{V}{\\pi r^2}' },
    calc:  { V: v => Math.PI*v.r**2*v.h, r: v => Math.sqrt(v.V/(Math.PI*v.h)), h: v => v.V/(Math.PI*v.r**2) },
    def: 'V'
  },
  {
    id: 'math_cone', name: 'Kegel – Volumen',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Volumen eines geraden Kreiskegels',
    berufe: ['alle'], lehrjahr: 1,
    vars: { V: { name: 'Volumen', unit: 'm³' }, r: { name: 'Radius', unit: 'm' }, h: { name: 'Höhe', unit: 'm' } },
    forms: { V: 'V = \\dfrac{1}{3} \\pi r^2 h', r: 'r = \\sqrt{\\dfrac{3V}{\\pi h}}', h: 'h = \\dfrac{3V}{\\pi r^2}' },
    calc:  { V: v => (1/3)*Math.PI*v.r**2*v.h, r: v => Math.sqrt(3*v.V/(Math.PI*v.h)), h: v => 3*v.V/(Math.PI*v.r**2) },
    def: 'V'
  },
  {
    id: 'math_sphere', name: 'Kugel – Volumen',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Volumen einer Kugel',
    berufe: ['alle'], lehrjahr: 1,
    vars: { V: { name: 'Volumen', unit: 'm³' }, r: { name: 'Radius', unit: 'm' } },
    forms: { V: 'V = \\dfrac{4}{3} \\pi r^3', r: 'r = \\sqrt[3]{\\dfrac{3V}{4\\pi}}' },
    calc:  { V: v => (4/3)*Math.PI*v.r**3, r: v => Math.cbrt(3*v.V/(4*Math.PI)) },
    def: 'V'
  },
  {
    id: 'math_sphere_area', name: 'Kugel – Oberfläche',
    category: 'Mathematik', sub: 'Geometrie',
    desc: 'Oberfläche einer Kugel',
    berufe: ['alle'], lehrjahr: 1,
    vars: { A: { name: 'Oberfläche', unit: 'm²' }, r: { name: 'Radius', unit: 'm' } },
    forms: { A: 'A = 4 \\pi r^2', r: 'r = \\sqrt{\\dfrac{A}{4\\pi}}' },
    calc:  { A: v => 4*Math.PI*v.r**2, r: v => Math.sqrt(v.A/(4*Math.PI)) },
    def: 'A'
  },

  // ═══════════════════════════════════════════════
  //  MATHEMATIK – TRIGONOMETRIE
  // ═══════════════════════════════════════════════
  {
    id: 'math_pythagoras', name: 'Satz des Pythagoras',
    category: 'Mathematik', sub: 'Trigonometrie',
    desc: 'Im rechtwinkligen Dreieck: Summe der Kathetenquadrate = Hypotenusenquadrat',
    berufe: ['alle'], lehrjahr: 1,
    vars: { c: { name: 'Hypotenuse', unit: 'm' }, a: { name: 'Kathete a', unit: 'm' }, b: { name: 'Kathete b', unit: 'm' } },
    forms: { c: 'c = \\sqrt{a^2 + b^2}', a: 'a = \\sqrt{c^2 - b^2}', b: 'b = \\sqrt{c^2 - a^2}' },
    calc:  { c: v => Math.sqrt(v.a**2+v.b**2), a: v => Math.sqrt(v.c**2-v.b**2), b: v => Math.sqrt(v.c**2-v.a**2) },
    def: 'c'
  },
  {
    id: 'math_sin', name: 'Sinus',
    category: 'Mathematik', sub: 'Trigonometrie',
    desc: 'Sinus = Gegenkathete / Hypotenuse',
    berufe: ['alle'], lehrjahr: 1,
    vars: { sin_a: { name: 'sin(α)', unit: '–' }, g: { name: 'Gegenkathete', unit: 'm' }, h: { name: 'Hypotenuse', unit: 'm' } },
    forms: {
      sin_a: '\\sin\\alpha = \\dfrac{\\text{Gegenkathete}}{\\text{Hypotenuse}}',
      g:     '\\text{Gegenkathete} = \\sin\\alpha \\cdot \\text{Hypotenuse}',
      h:     '\\text{Hypotenuse} = \\dfrac{\\text{Gegenkathete}}{\\sin\\alpha}'
    },
    calc: { sin_a: v => v.g/v.h, g: v => v.sin_a*v.h, h: v => v.g/v.sin_a },
    def: 'sin_a'
  },
  {
    id: 'math_cos', name: 'Kosinus',
    category: 'Mathematik', sub: 'Trigonometrie',
    desc: 'Kosinus = Ankathete / Hypotenuse',
    berufe: ['alle'], lehrjahr: 1,
    vars: { cos_a: { name: 'cos(α)', unit: '–' }, a: { name: 'Ankathete', unit: 'm' }, h: { name: 'Hypotenuse', unit: 'm' } },
    forms: {
      cos_a: '\\cos\\alpha = \\dfrac{\\text{Ankathete}}{\\text{Hypotenuse}}',
      a:     '\\text{Ankathete} = \\cos\\alpha \\cdot \\text{Hypotenuse}',
      h:     '\\text{Hypotenuse} = \\dfrac{\\text{Ankathete}}{\\cos\\alpha}'
    },
    calc: { cos_a: v => v.a/v.h, a: v => v.cos_a*v.h, h: v => v.a/v.cos_a },
    def: 'cos_a'
  },
  {
    id: 'math_tan', name: 'Tangens',
    category: 'Mathematik', sub: 'Trigonometrie',
    desc: 'Tangens = Gegenkathete / Ankathete',
    berufe: ['alle'], lehrjahr: 1,
    vars: { tan_a: { name: 'tan(α)', unit: '–' }, g: { name: 'Gegenkathete', unit: 'm' }, a: { name: 'Ankathete', unit: 'm' } },
    forms: {
      tan_a: '\\tan\\alpha = \\dfrac{\\text{Gegenkathete}}{\\text{Ankathete}}',
      g:     '\\text{Gegenkathete} = \\tan\\alpha \\cdot \\text{Ankathete}',
      a:     '\\text{Ankathete} = \\dfrac{\\text{Gegenkathete}}{\\tan\\alpha}'
    },
    calc: { tan_a: v => v.g/v.a, g: v => v.tan_a*v.a, a: v => v.g/v.tan_a },
    def: 'tan_a'
  },
  {
    id: 'math_sin_rule', name: 'Sinussatz',
    category: 'Mathematik', sub: 'Trigonometrie',
    desc: 'Verhältnis von Seiten zu gegenüberliegenden Winkeln im Dreieck',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      a: { name: 'Seite a', unit: 'm' }, b: { name: 'Seite b', unit: 'm' },
      alpha: { name: 'Winkel α', unit: '°' }, beta: { name: 'Winkel β', unit: '°' }
    },
    forms: {
      a:     '\\dfrac{a}{\\sin\\alpha} = \\dfrac{b}{\\sin\\beta}',
      b:     'b = \\dfrac{a \\cdot \\sin\\beta}{\\sin\\alpha}',
      alpha: '\\sin\\alpha = \\dfrac{a \\cdot \\sin\\beta}{b}',
      beta:  '\\sin\\beta = \\dfrac{b \\cdot \\sin\\alpha}{a}'
    },
    calc: {
      a:     v => v.b*Math.sin(v.alpha*Math.PI/180)/Math.sin(v.beta*Math.PI/180),
      b:     v => v.a*Math.sin(v.beta*Math.PI/180)/Math.sin(v.alpha*Math.PI/180),
      alpha: v => Math.asin(v.a*Math.sin(v.beta*Math.PI/180)/v.b)*180/Math.PI,
      beta:  v => Math.asin(v.b*Math.sin(v.alpha*Math.PI/180)/v.a)*180/Math.PI
    },
    def: 'a'
  },
  {
    id: 'math_cos_rule', name: 'Kosinussatz',
    category: 'Mathematik', sub: 'Trigonometrie',
    desc: 'Verallgemeinerung des Pythagoras für beliebige Dreiecke',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      a: { name: 'Seite a', unit: 'm' }, b: { name: 'Seite b', unit: 'm' },
      c: { name: 'Seite c', unit: 'm' }, alpha: { name: 'Winkel α', unit: '°' }
    },
    forms: {
      a:     'a^2 = b^2 + c^2 - 2bc\\cos\\alpha',
      alpha: '\\cos\\alpha = \\dfrac{b^2 + c^2 - a^2}{2bc}'
    },
    calc: {
      a:     v => Math.sqrt(v.b**2+v.c**2-2*v.b*v.c*Math.cos(v.alpha*Math.PI/180)),
      alpha: v => Math.acos((v.b**2+v.c**2-v.a**2)/(2*v.b*v.c))*180/Math.PI
    },
    def: 'a'
  },

  // ═══════════════════════════════════════════════
  //  MATHEMATIK – ALGEBRA & ANALYSIS
  // ═══════════════════════════════════════════════
  {
    id: 'math_quadratic', name: 'Quadratische Formel (abc)',
    category: 'Mathematik', sub: 'Algebra',
    desc: 'Lösungen einer quadratischen Gleichung ax²+bx+c=0',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      x: { name: 'Lösungen x₁, x₂', unit: '–' },
      a: { name: 'Koeffizient a',    unit: '–' },
      b: { name: 'Koeffizient b',    unit: '–' },
      c: { name: 'Koeffizient c',    unit: '–' }
    },
    forms: { x: 'x_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', c: 'c = -ax^2 - bx' },
    calc: {
      x: v => {
        const d = v.b**2-4*v.a*v.c;
        if (d < 0) return null;
        return { x1: (-v.b+Math.sqrt(d))/(2*v.a), x2: (-v.b-Math.sqrt(d))/(2*v.a) };
      },
      c: v => -v.a*v.x**2-v.b*v.x
    },
    def: 'x'
  },
  {
    id: 'math_binom1', name: '1. Binomische Formel',
    category: 'Mathematik', sub: 'Algebra',
    desc: '(a+b)² ausgerechnet',
    berufe: ['alle'], lehrjahr: 1,
    vars: { res: { name: 'Ergebnis', unit: '–' }, a: { name: 'Wert a', unit: '–' }, b: { name: 'Wert b', unit: '–' } },
    forms: { res: '(a + b)^2 = a^2 + 2ab + b^2' },
    calc: { res: v => (v.a+v.b)**2 },
    def: 'res'
  },
  {
    id: 'math_binom2', name: '2. Binomische Formel',
    category: 'Mathematik', sub: 'Algebra',
    desc: '(a−b)² ausgerechnet',
    berufe: ['alle'], lehrjahr: 1,
    vars: { res: { name: 'Ergebnis', unit: '–' }, a: { name: 'Wert a', unit: '–' }, b: { name: 'Wert b', unit: '–' } },
    forms: { res: '(a - b)^2 = a^2 - 2ab + b^2' },
    calc: { res: v => (v.a-v.b)**2 },
    def: 'res'
  },
  {
    id: 'math_binom3', name: '3. Binomische Formel',
    category: 'Mathematik', sub: 'Algebra',
    desc: '(a+b)(a−b) ausgerechnet',
    berufe: ['alle'], lehrjahr: 1,
    vars: { res: { name: 'Ergebnis', unit: '–' }, a: { name: 'Wert a', unit: '–' }, b: { name: 'Wert b', unit: '–' } },
    forms: { res: '(a + b)(a - b) = a^2 - b^2' },
    calc: { res: v => v.a**2-v.b**2 },
    def: 'res'
  },
  {
    id: 'math_linear', name: 'Lineare Funktion',
    category: 'Mathematik', sub: 'Analysis',
    desc: 'Geradengleichung in Normalform',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      y: { name: 'Funktionswert y',     unit: '–' },
      m: { name: 'Steigung m',          unit: '–' },
      x: { name: 'x-Wert',             unit: '–' },
      b: { name: 'y-Achsenabschnitt b', unit: '–' }
    },
    forms: { y: 'y = m \\cdot x + b', m: 'm = \\dfrac{y - b}{x}', x: 'x = \\dfrac{y - b}{m}', b: 'b = y - m \\cdot x' },
    calc:  { y: v => v.m*v.x+v.b, m: v => (v.y-v.b)/v.x, x: v => (v.y-v.b)/v.m, b: v => v.y-v.m*v.x },
    def: 'y'
  },
  {
    id: 'math_slope', name: 'Steigung einer Geraden',
    category: 'Mathematik', sub: 'Analysis',
    desc: 'Steigung m aus zwei Punkten berechnen',
    berufe: ['alle'], lehrjahr: 2,
    vars: {
      m:  { name: 'Steigung', unit: '–' },
      y2: { name: 'y₂', unit: '–' }, y1: { name: 'y₁', unit: '–' },
      x2: { name: 'x₂', unit: '–' }, x1: { name: 'x₁', unit: '–' }
    },
    forms: {
      m:  'm = \\dfrac{y_2 - y_1}{x_2 - x_1}',
      y2: 'y_2 = m(x_2 - x_1) + y_1'
    },
    calc: {
      m:  v => (v.y2-v.y1)/(v.x2-v.x1),
      y2: v => v.m*(v.x2-v.x1)+v.y1,
      y1: v => v.y2-v.m*(v.x2-v.x1)
    },
    def: 'm'
  },
  {
    id: 'math_deriv_power', name: 'Potenzregel (Ableitung)',
    category: 'Mathematik', sub: 'Analysis',
    desc: 'Ableitung einer Potenzfunktion',
    berufe: ['alle'], lehrjahr: 3,
    vars: {
      f_prime: { name: "f'(x)", unit: '–' },
      n:       { name: 'Exponent n', unit: '–' },
      x:       { name: 'x-Wert', unit: '–' }
    },
    forms: { f_prime: "f(x) = x^n \\Rightarrow f'(x) = n \\cdot x^{n-1}" },
    calc:  { f_prime: v => v.n*Math.pow(v.x, v.n-1) },
    def: 'f_prime'
  },
  {
    id: 'math_mean', name: 'Arithmetisches Mittel',
    category: 'Mathematik', sub: 'Stochastik',
    desc: 'Durchschnittswert einer Datenmenge',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      xbar: { name: 'Mittelwert x̄',   unit: '–' },
      sum:  { name: 'Summe aller xᵢ', unit: '–' },
      n:    { name: 'Anzahl',          unit: '–' }
    },
    forms: {
      xbar: '\\bar{x} = \\dfrac{\\sum x_i}{n}',
      sum:  '\\sum x_i = \\bar{x} \\cdot n',
      n:    'n = \\dfrac{\\sum x_i}{\\bar{x}}'
    },
    calc: { xbar: v => v.sum/v.n, sum: v => v.xbar*v.n, n: v => v.sum/v.xbar },
    def: 'xbar'
  },
  {
    id: 'math_binom_coeff', name: 'Binomialkoeffizient',
    category: 'Mathematik', sub: 'Stochastik',
    desc: 'Anzahl der k-elementigen Teilmengen aus n Elementen',
    berufe: ['alle'], lehrjahr: 3,
    vars: {
      C: { name: 'Binom.koeffizient', unit: '–' },
      n: { name: 'Grundmenge n',      unit: '–' },
      k: { name: 'Auswahl k',         unit: '–' }
    },
    forms: { C: '\\binom{n}{k} = \\dfrac{n!}{k! \\cdot (n-k)!}' },
    calc: {
      C: v => {
        const fact = x => x <= 1 ? 1 : x*fact(x-1);
        const n = Math.round(v.n), k = Math.round(v.k);
        if (k > n || k < 0) return 0;
        return fact(n)/(fact(k)*fact(n-k));
      }
    },
    def: 'C'
  },

  // ═══════════════════════════════════════════════
  //  ELEKTROTECHNIK – GRUNDLAGEN
  // ═══════════════════════════════════════════════
  {
    id: 'elec_ohm', name: 'Ohmsches Gesetz',
    category: 'Elektrotechnik', sub: 'Grundlagen',
    desc: 'Grundlegende Beziehung zwischen Spannung, Widerstand und Strom',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      U: { name: 'Spannung',    unit: 'V' },
      R: { name: 'Widerstand',  unit: 'Ω' },
      I: { name: 'Stromstärke', unit: 'A' }
    },
    forms: { U: 'U = R \\cdot I', R: 'R = \\dfrac{U}{I}', I: 'I = \\dfrac{U}{R}' },
    calc:  { U: v => v.R*v.I, R: v => v.U/v.I, I: v => v.U/v.R },
    def: 'U'
  },
  {
    id: 'elec_charge', name: 'Elektrische Ladung',
    category: 'Elektrotechnik', sub: 'Grundlagen',
    desc: 'Ladung als Produkt von Strom und Zeit',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      Q: { name: 'Ladung',      unit: 'C' },
      I: { name: 'Stromstärke', unit: 'A' },
      t: { name: 'Zeit',        unit: 's' }
    },
    forms: { Q: 'Q = I \\cdot t', I: 'I = \\dfrac{Q}{t}', t: 't = \\dfrac{Q}{I}' },
    calc:  { Q: v => v.I*v.t, I: v => v.Q/v.t, t: v => v.Q/v.I },
    def: 'Q'
  },
  {
    id: 'elec_resist_material', name: 'Leiterwiderstand (Material)',
    category: 'Elektrotechnik', sub: 'Grundlagen',
    desc: 'Elektrischer Widerstand aus Materialeigenschaften – Material wählbar',
    berufe: ['automatiker', 'elektroniker', 'polymechaniker'], lehrjahr: 1,
    vars: {
      R:   { name: 'Widerstand',         unit: 'Ω'        },
      rho: { name: 'spez. Widerstand ρ', unit: 'Ω·mm²/m', material: 'spez_widerstand' },
      l:   { name: 'Leiterlänge',        unit: 'm'        },
      A:   { name: 'Querschnitt A',      unit: 'mm²'      }
    },
    forms: {
      R:   'R = \\rho \\cdot \\dfrac{l}{A}',
      l:   'l = \\dfrac{R \\cdot A}{\\rho}',
      A:   'A = \\rho \\cdot \\dfrac{l}{R}',
      rho: '\\rho = \\dfrac{R \\cdot A}{l}'
    },
    calc: {
      R:   v => v.rho*v.l/v.A,
      l:   v => v.R*v.A/v.rho,
      A:   v => v.rho*v.l/v.R,
      rho: v => v.R*v.A/v.l
    },
    def: 'R'
  },
  {
    id: 'elec_temp_resistance', name: 'Temperaturabhängigkeit des Widerstands',
    category: 'Elektrotechnik', sub: 'Grundlagen',
    desc: 'Widerstand ändert sich mit der Temperatur',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      R_T:   { name: 'Widerstand bei T',    unit: 'Ω'   },
      R_0:   { name: 'Widerstand bei T₀',   unit: 'Ω'   },
      alpha: { name: 'Temperaturkoeff. α',  unit: '1/K' },
      dT:    { name: 'Temperaturdiff. ΔT',  unit: 'K'   }
    },
    forms: {
      R_T:   'R(T) = R_0 \\cdot (1 + \\alpha \\cdot \\Delta T)',
      dT:    '\\Delta T = \\dfrac{R(T)/R_0 - 1}{\\alpha}',
      R_0:   'R_0 = \\dfrac{R(T)}{1 + \\alpha \\cdot \\Delta T}'
    },
    calc: {
      R_T: v => v.R_0*(1+v.alpha*v.dT),
      dT:  v => (v.R_T/v.R_0-1)/v.alpha,
      R_0: v => v.R_T/(1+v.alpha*v.dT)
    },
    def: 'R_T'
  },

  // ── Netzwerke ──────────────────────────────────
  {
    id: 'elec_series_r', name: 'Reihenschaltung – Gesamtwiderstand',
    category: 'Elektrotechnik', sub: 'Gleichstrom',
    desc: 'Gesamtwiderstand der Reihenschaltung: Summe aller Einzelwiderstände',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      R_ges: { name: 'Gesamtwiderstand', unit: 'Ω' },
      R1:    { name: 'Widerstand R₁',   unit: 'Ω' },
      R2:    { name: 'Widerstand R₂',   unit: 'Ω' },
      R3:    { name: 'Widerstand R₃',   unit: 'Ω' }
    },
    forms: { R_ges: 'R_{ges} = R_1 + R_2 + R_3 + \\ldots' },
    calc:  { R_ges: v => v.R1+v.R2+(v.R3||0) },
    def: 'R_ges'
  },
  {
    id: 'elec_parallel_r', name: 'Parallelschaltung – Gesamtwiderstand (2 Widerstände)',
    category: 'Elektrotechnik', sub: 'Gleichstrom',
    desc: 'Gesamtwiderstand bei zwei parallelen Widerständen',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      R_ges: { name: 'Gesamtwiderstand', unit: 'Ω' },
      R1:    { name: 'Widerstand R₁',   unit: 'Ω' },
      R2:    { name: 'Widerstand R₂',   unit: 'Ω' }
    },
    forms: {
      R_ges: 'R_{ges} = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2}',
      R1:    'R_1 = \\dfrac{R_{ges} \\cdot R_2}{R_2 - R_{ges}}',
      R2:    'R_2 = \\dfrac{R_{ges} \\cdot R_1}{R_1 - R_{ges}}'
    },
    calc: {
      R_ges: v => (v.R1*v.R2)/(v.R1+v.R2),
      R1:    v => (v.R_ges*v.R2)/(v.R2-v.R_ges),
      R2:    v => (v.R_ges*v.R1)/(v.R1-v.R_ges)
    },
    def: 'R_ges'
  },
  {
    id: 'elec_voltage_divider', name: 'Spannungsteiler (unbelastet)',
    category: 'Elektrotechnik', sub: 'Gleichstrom',
    desc: 'Teilspannung an einem Widerstand im Spannungsteiler',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      U2:    { name: 'Teilspannung U₂',   unit: 'V' },
      U_ges: { name: 'Gesamtspannung',    unit: 'V' },
      R2:    { name: 'Widerstand R₂',     unit: 'Ω' },
      R1:    { name: 'Widerstand R₁',     unit: 'Ω' }
    },
    forms: {
      U2: 'U_2 = U_{ges} \\cdot \\dfrac{R_2}{R_1 + R_2}',
      U_ges: 'U_{ges} = U_2 \\cdot \\dfrac{R_1 + R_2}{R_2}'
    },
    calc: {
      U2:    v => v.U_ges*v.R2/(v.R1+v.R2),
      U_ges: v => v.U2*(v.R1+v.R2)/v.R2
    },
    def: 'U2'
  },

  // ── Leistung ───────────────────────────────────
  {
    id: 'elec_power1', name: 'Elektrische Leistung P = U·I',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Elektrische Leistung aus Spannung und Strom',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      P: { name: 'Leistung',    unit: 'W' },
      U: { name: 'Spannung',    unit: 'V' },
      I: { name: 'Stromstärke', unit: 'A' }
    },
    forms: { P: 'P = U \\cdot I', U: 'U = \\dfrac{P}{I}', I: 'I = \\dfrac{P}{U}' },
    calc:  { P: v => v.U*v.I, U: v => v.P/v.I, I: v => v.P/v.U },
    def: 'P'
  },
  {
    id: 'elec_power2', name: 'Elektrische Leistung P = U²/R',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Elektrische Leistung aus Spannung und Widerstand',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      P: { name: 'Leistung',   unit: 'W' },
      U: { name: 'Spannung',   unit: 'V' },
      R: { name: 'Widerstand', unit: 'Ω' }
    },
    forms: { P: 'P = \\dfrac{U^2}{R}', U: 'U = \\sqrt{P \\cdot R}', R: 'R = \\dfrac{U^2}{P}' },
    calc:  { P: v => v.U**2/v.R, U: v => Math.sqrt(v.P*v.R), R: v => v.U**2/v.P },
    def: 'P'
  },
  {
    id: 'elec_power3', name: 'Elektrische Leistung P = I²·R',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Elektrische Leistung aus Strom und Widerstand',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      P: { name: 'Leistung',    unit: 'W' },
      I: { name: 'Stromstärke', unit: 'A' },
      R: { name: 'Widerstand',  unit: 'Ω' }
    },
    forms: { P: 'P = I^2 \\cdot R', I: 'I = \\sqrt{\\dfrac{P}{R}}', R: 'R = \\dfrac{P}{I^2}' },
    calc:  { P: v => v.I**2*v.R, I: v => Math.sqrt(v.P/v.R), R: v => v.P/v.I**2 },
    def: 'P'
  },
  {
    id: 'elec_work', name: 'Elektrische Arbeit',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Elektrische Energie aus Leistung und Zeit',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      W: { name: 'Elektrische Arbeit', unit: 'J' },
      P: { name: 'Leistung',           unit: 'W' },
      t: { name: 'Zeit',               unit: 's' }
    },
    forms: { W: 'W = P \\cdot t', P: 'P = \\dfrac{W}{t}', t: 't = \\dfrac{W}{P}' },
    calc:  { W: v => v.P*v.t, P: v => v.W/v.t, t: v => v.W/v.P },
    def: 'W'
  },
  {
    id: 'elec_efficiency', name: 'Wirkungsgrad',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Verhältnis von Nutzleistung zu aufgenommener Leistung',
    berufe: ['alle'], lehrjahr: 1,
    vars: {
      eta:   { name: 'Wirkungsgrad η', unit: '–'  },
      P_ab:  { name: 'Abgabeleistung', unit: 'W'  },
      P_auf: { name: 'Aufnahmeleist.', unit: 'W'  }
    },
    forms: {
      eta:   '\\eta = \\dfrac{P_{ab}}{P_{auf}}',
      P_ab:  'P_{ab} = \\eta \\cdot P_{auf}',
      P_auf: 'P_{auf} = \\dfrac{P_{ab}}{\\eta}'
    },
    calc: { eta: v => v.P_ab/v.P_auf, P_ab: v => v.eta*v.P_auf, P_auf: v => v.P_ab/v.eta },
    def: 'eta'
  },
  {
    id: 'elec_active_power', name: 'Wirkleistung (AC)',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Tatsächlich umgesetzte Leistung im Wechselstromkreis',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      P:   { name: 'Wirkleistung',   unit: 'W' },
      U:   { name: 'Spannung',       unit: 'V' },
      I:   { name: 'Strom',          unit: 'A' },
      phi: { name: 'Phasenwinkel φ', unit: '°' }
    },
    forms: {
      P:   'P = U \\cdot I \\cdot \\cos\\varphi',
      U:   'U = \\dfrac{P}{I \\cdot \\cos\\varphi}',
      I:   'I = \\dfrac{P}{U \\cdot \\cos\\varphi}',
      phi: '\\varphi = \\arccos\\left(\\dfrac{P}{U \\cdot I}\\right)'
    },
    calc: {
      P:   v => v.U*v.I*Math.cos(v.phi*Math.PI/180),
      U:   v => v.P/(v.I*Math.cos(v.phi*Math.PI/180)),
      I:   v => v.P/(v.U*Math.cos(v.phi*Math.PI/180)),
      phi: v => Math.acos(v.P/(v.U*v.I))*180/Math.PI
    },
    def: 'P'
  },
  {
    id: 'elec_reactive_power', name: 'Blindleistung (AC)',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Blindleistung im Wechselstromkreis',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      Q:   { name: 'Blindleistung',  unit: 'var' },
      U:   { name: 'Spannung',       unit: 'V'   },
      I:   { name: 'Strom',          unit: 'A'   },
      phi: { name: 'Phasenwinkel φ', unit: '°'   }
    },
    forms: {
      Q:   'Q = U \\cdot I \\cdot \\sin\\varphi',
      phi: '\\varphi = \\arcsin\\left(\\dfrac{Q}{U \\cdot I}\\right)'
    },
    calc: {
      Q:   v => v.U*v.I*Math.sin(v.phi*Math.PI/180),
      phi: v => Math.asin(v.Q/(v.U*v.I))*180/Math.PI
    },
    def: 'Q'
  },
  {
    id: 'elec_apparent_power', name: 'Scheinleistung (AC)',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Scheinleistung = geometrische Summe von Wirk- und Blindleistung',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      S: { name: 'Scheinleistung', unit: 'VA'  },
      P: { name: 'Wirkleistung',   unit: 'W'   },
      Q: { name: 'Blindleistung',  unit: 'var' }
    },
    forms: {
      S: 'S = \\sqrt{P^2 + Q^2}',
      P: 'P = \\sqrt{S^2 - Q^2}',
      Q: 'Q = \\sqrt{S^2 - P^2}'
    },
    calc: {
      S: v => Math.sqrt(v.P**2+v.Q**2),
      P: v => Math.sqrt(v.S**2-v.Q**2),
      Q: v => Math.sqrt(v.S**2-v.P**2)
    },
    def: 'S'
  },
  {
    id: 'elec_power_factor', name: 'Leistungsfaktor cos φ',
    category: 'Elektrotechnik', sub: 'Leistung',
    desc: 'Verhältnis von Wirkleistung zu Scheinleistung',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      cos_phi: { name: 'cos φ',          unit: '–'  },
      P:       { name: 'Wirkleistung',   unit: 'W'  },
      S:       { name: 'Scheinleistung', unit: 'VA' }
    },
    forms: {
      cos_phi: '\\cos\\varphi = \\dfrac{P}{S}',
      P:       'P = \\cos\\varphi \\cdot S',
      S:       'S = \\dfrac{P}{\\cos\\varphi}'
    },
    calc: { cos_phi: v => v.P/v.S, P: v => v.cos_phi*v.S, S: v => v.P/v.cos_phi },
    def: 'cos_phi'
  },

  // ── Wechselstrom ───────────────────────────────
  {
    id: 'elec_omega', name: 'Kreisfrequenz',
    category: 'Elektrotechnik', sub: 'Wechselstrom',
    desc: 'Zusammenhang zwischen Kreisfrequenz und Frequenz',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      omega: { name: 'Kreisfrequenz ω', unit: 'rad/s' },
      f:     { name: 'Frequenz',        unit: 'Hz'    },
      T:     { name: 'Periodendauer',   unit: 's'     }
    },
    forms: {
      omega: '\\omega = 2\\pi \\cdot f',
      f:     'f = \\dfrac{\\omega}{2\\pi}',
      T:     'T = \\dfrac{2\\pi}{\\omega} = \\dfrac{1}{f}'
    },
    calc: { omega: v => 2*Math.PI*v.f, f: v => v.omega/(2*Math.PI), T: v => 1/v.f },
    def: 'omega'
  },
  {
    id: 'elec_effective', name: 'Effektivwert (Scheitelwert)',
    category: 'Elektrotechnik', sub: 'Wechselstrom',
    desc: 'Effektivwert einer sinusförmigen Wechselgrösse',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      U_eff:  { name: 'Effektivwert U',    unit: 'V' },
      U_peak: { name: 'Scheitelwert û',    unit: 'V' }
    },
    forms: {
      U_eff:  'U_{eff} = \\dfrac{\\hat{u}}{\\sqrt{2}}',
      U_peak: '\\hat{u} = U_{eff} \\cdot \\sqrt{2}'
    },
    calc: { U_eff: v => v.U_peak/Math.sqrt(2), U_peak: v => v.U_eff*Math.sqrt(2) },
    def: 'U_eff'
  },
  {
    id: 'elec_xl', name: 'Induktiver Blindwiderstand',
    category: 'Elektrotechnik', sub: 'Wechselstrom',
    desc: 'Blindwiderstand einer Spule im Wechselstromkreis',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      XL: { name: 'indukt. Blindwid. X_L', unit: 'Ω'  },
      f:  { name: 'Frequenz',              unit: 'Hz' },
      L:  { name: 'Induktivität',          unit: 'H'  }
    },
    forms: { XL: 'X_L = 2\\pi f L', f: 'f = \\dfrac{X_L}{2\\pi L}', L: 'L = \\dfrac{X_L}{2\\pi f}' },
    calc:  { XL: v => 2*Math.PI*v.f*v.L, f: v => v.XL/(2*Math.PI*v.L), L: v => v.XL/(2*Math.PI*v.f) },
    def: 'XL'
  },
  {
    id: 'elec_xc', name: 'Kapazitiver Blindwiderstand',
    category: 'Elektrotechnik', sub: 'Wechselstrom',
    desc: 'Blindwiderstand eines Kondensators im Wechselstromkreis',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      XC: { name: 'kap. Blindwid. X_C', unit: 'Ω'  },
      f:  { name: 'Frequenz',           unit: 'Hz' },
      C:  { name: 'Kapazität',          unit: 'F'  }
    },
    forms: { XC: 'X_C = \\dfrac{1}{2\\pi f C}', f: 'f = \\dfrac{1}{2\\pi C X_C}', C: 'C = \\dfrac{1}{2\\pi f X_C}' },
    calc:  { XC: v => 1/(2*Math.PI*v.f*v.C), f: v => 1/(2*Math.PI*v.C*v.XC), C: v => 1/(2*Math.PI*v.f*v.XC) },
    def: 'XC'
  },
  {
    id: 'elec_impedance', name: 'Impedanz (RLC-Reihenschaltung)',
    category: 'Elektrotechnik', sub: 'Wechselstrom',
    desc: 'Gesamtwiderstand im Wechselstromkreis',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      Z:  { name: 'Impedanz Z',           unit: 'Ω' },
      R:  { name: 'Wirkwiderstand R',     unit: 'Ω' },
      XL: { name: 'Indukt. Blindwid. X_L',unit: 'Ω' },
      XC: { name: 'Kap. Blindwid. X_C',  unit: 'Ω' }
    },
    forms: {
      Z: 'Z = \\sqrt{R^2 + (X_L - X_C)^2}',
      R: 'R = \\sqrt{Z^2 - (X_L - X_C)^2}'
    },
    calc: {
      Z: v => Math.sqrt(v.R**2+(v.XL-v.XC)**2),
      R: v => Math.sqrt(v.Z**2-(v.XL-v.XC)**2)
    },
    def: 'Z'
  },
  {
    id: 'elec_resonance', name: 'Resonanzfrequenz (LC)',
    category: 'Elektrotechnik', sub: 'Wechselstrom',
    desc: 'Eigenfrequenz eines LC-Schwingkreises',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 3,
    vars: {
      f0: { name: 'Resonanzfrequenz f₀', unit: 'Hz' },
      L:  { name: 'Induktivität',        unit: 'H'  },
      C:  { name: 'Kapazität',           unit: 'F'  }
    },
    forms: {
      f0: 'f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}',
      L:  'L = \\dfrac{1}{(2\\pi f_0)^2 C}',
      C:  'C = \\dfrac{1}{(2\\pi f_0)^2 L}'
    },
    calc: {
      f0: v => 1/(2*Math.PI*Math.sqrt(v.L*v.C)),
      L:  v => 1/((2*Math.PI*v.f0)**2*v.C),
      C:  v => 1/((2*Math.PI*v.f0)**2*v.L)
    },
    def: 'f0'
  },

  // ── Kondensator ────────────────────────────────
  {
    id: 'elec_cap_charge', name: 'Kondensator – Ladung',
    category: 'Elektrotechnik', sub: 'Kondensator',
    desc: 'Elektrische Ladung auf einem Kondensator',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      Q: { name: 'Ladung',    unit: 'C' },
      C: { name: 'Kapazität', unit: 'F' },
      U: { name: 'Spannung',  unit: 'V' }
    },
    forms: { Q: 'Q = C \\cdot U', C: 'C = \\dfrac{Q}{U}', U: 'U = \\dfrac{Q}{C}' },
    calc:  { Q: v => v.C*v.U, C: v => v.Q/v.U, U: v => v.Q/v.C },
    def: 'Q'
  },
  {
    id: 'elec_cap_energy', name: 'Kondensator – Energie',
    category: 'Elektrotechnik', sub: 'Kondensator',
    desc: 'Gespeicherte Energie im Kondensator',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      E: { name: 'Energie',   unit: 'J' },
      C: { name: 'Kapazität', unit: 'F' },
      U: { name: 'Spannung',  unit: 'V' }
    },
    forms: { E: 'E = \\dfrac{1}{2} C U^2', C: 'C = \\dfrac{2E}{U^2}', U: 'U = \\sqrt{\\dfrac{2E}{C}}' },
    calc:  { E: v => 0.5*v.C*v.U**2, C: v => 2*v.E/v.U**2, U: v => Math.sqrt(2*v.E/v.C) },
    def: 'E'
  },
  {
    id: 'elec_cap_plate', name: 'Plattenkondensator – Kapazität',
    category: 'Elektrotechnik', sub: 'Kondensator',
    desc: 'Kapazität eines Plattenkondensators',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      C:   { name: 'Kapazität C',          unit: 'F'    },
      eps0:{ name: 'Feldkonstante ε₀',     unit: 'F/m'  },
      epsr:{ name: 'Rel. Permittivität εᵣ',unit: '–'    },
      A:   { name: 'Plattenfläche A',      unit: 'm²'   },
      d:   { name: 'Plattenabstand d',     unit: 'm'    }
    },
    forms: {
      C: 'C = \\varepsilon_0 \\cdot \\varepsilon_r \\cdot \\dfrac{A}{d}',
      d: 'd = \\varepsilon_0 \\cdot \\varepsilon_r \\cdot \\dfrac{A}{C}',
      A: 'A = \\dfrac{C \\cdot d}{\\varepsilon_0 \\cdot \\varepsilon_r}'
    },
    calc: {
      C: v => v.eps0*v.epsr*v.A/v.d,
      d: v => v.eps0*v.epsr*v.A/v.C,
      A: v => v.C*v.d/(v.eps0*v.epsr)
    },
    def: 'C'
  },
  {
    id: 'elec_rc_tau', name: 'RC-Zeitkonstante',
    category: 'Elektrotechnik', sub: 'Kondensator',
    desc: 'Zeitkonstante eines RC-Glieds',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      tau: { name: 'Zeitkonstante τ', unit: 's' },
      R:   { name: 'Widerstand',      unit: 'Ω' },
      C:   { name: 'Kapazität',       unit: 'F' }
    },
    forms: { tau: '\\tau = R \\cdot C', R: 'R = \\dfrac{\\tau}{C}', C: 'C = \\dfrac{\\tau}{R}' },
    calc:  { tau: v => v.R*v.C, R: v => v.tau/v.C, C: v => v.tau/v.R },
    def: 'tau'
  },

  // ── Induktivität ───────────────────────────────
  {
    id: 'elec_ind_energy', name: 'Spule – Energie',
    category: 'Elektrotechnik', sub: 'Induktivität',
    desc: 'Gespeicherte magnetische Energie in einer Spule',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      E: { name: 'Energie',      unit: 'J' },
      L: { name: 'Induktivität', unit: 'H' },
      I: { name: 'Strom',        unit: 'A' }
    },
    forms: { E: 'E = \\dfrac{1}{2} L I^2', L: 'L = \\dfrac{2E}{I^2}', I: 'I = \\sqrt{\\dfrac{2E}{L}}' },
    calc:  { E: v => 0.5*v.L*v.I**2, L: v => 2*v.E/v.I**2, I: v => Math.sqrt(2*v.E/v.L) },
    def: 'E'
  },
  {
    id: 'elec_rl_tau', name: 'RL-Zeitkonstante',
    category: 'Elektrotechnik', sub: 'Induktivität',
    desc: 'Zeitkonstante eines RL-Glieds',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      tau: { name: 'Zeitkonstante τ', unit: 's' },
      L:   { name: 'Induktivität',    unit: 'H' },
      R:   { name: 'Widerstand',      unit: 'Ω' }
    },
    forms: { tau: '\\tau = \\dfrac{L}{R}', L: 'L = \\tau \\cdot R', R: 'R = \\dfrac{L}{\\tau}' },
    calc:  { tau: v => v.L/v.R, L: v => v.tau*v.R, R: v => v.L/v.tau },
    def: 'tau'
  },
  {
    id: 'elec_coil', name: 'Induktivität einer Spule (Solenoid)',
    category: 'Elektrotechnik', sub: 'Induktivität',
    desc: 'Induktivität einer Zylinderspule',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 3,
    vars: {
      L:   { name: 'Induktivität L', unit: 'H'   },
      mu0: { name: 'Feldkonstante μ₀', unit: 'H/m' },
      mur: { name: 'Rel. Permeab. μᵣ', unit: '–'   },
      N:   { name: 'Windungszahl N',   unit: '–'   },
      A:   { name: 'Querschnitt A',    unit: 'm²'  },
      l:   { name: 'Spulenlänge l',    unit: 'm'   }
    },
    forms: { L: 'L = \\mu_0 \\cdot \\mu_r \\cdot \\dfrac{N^2 \\cdot A}{l}' },
    calc:  { L: v => v.mu0*v.mur*v.N**2*v.A/v.l },
    def: 'L'
  },

  // ── Magnetismus ────────────────────────────────
  {
    id: 'elec_mag_flux', name: 'Magnetischer Fluss',
    category: 'Elektrotechnik', sub: 'Magnetismus',
    desc: 'Magnetischer Fluss durch eine Fläche',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      Phi:   { name: 'Magnetischer Fluss Φ', unit: 'Wb' },
      B:     { name: 'Flussdichte B',        unit: 'T'  },
      A:     { name: 'Fläche A',             unit: 'm²' },
      alpha: { name: 'Winkel α',             unit: '°'  }
    },
    forms: {
      Phi: '\\Phi = B \\cdot A \\cdot \\cos\\alpha',
      B:   'B = \\dfrac{\\Phi}{A \\cdot \\cos\\alpha}',
      A:   'A = \\dfrac{\\Phi}{B \\cdot \\cos\\alpha}'
    },
    calc: {
      Phi: v => v.B*v.A*Math.cos(v.alpha*Math.PI/180),
      B:   v => v.Phi/(v.A*Math.cos(v.alpha*Math.PI/180)),
      A:   v => v.Phi/(v.B*Math.cos(v.alpha*Math.PI/180))
    },
    def: 'Phi'
  },
  {
    id: 'elec_force_wire', name: 'Kraft auf stromdurchflossenen Leiter',
    category: 'Elektrotechnik', sub: 'Magnetismus',
    desc: 'Lorentzkraft auf einen geraden Leiter im Magnetfeld',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 2,
    vars: {
      F:     { name: 'Kraft F',                unit: 'N' },
      B:     { name: 'Flussdichte B',          unit: 'T' },
      I:     { name: 'Strom I',                unit: 'A' },
      l:     { name: 'wirksame Leiterlänge l', unit: 'm' },
      alpha: { name: 'Winkel α',               unit: '°' }
    },
    forms: {
      F: 'F = B \\cdot I \\cdot l \\cdot \\sin\\alpha',
      B: 'B = \\dfrac{F}{I \\cdot l \\cdot \\sin\\alpha}',
      I: 'I = \\dfrac{F}{B \\cdot l \\cdot \\sin\\alpha}',
      l: 'l = \\dfrac{F}{B \\cdot I \\cdot \\sin\\alpha}'
    },
    calc: {
      F: v => v.B*v.I*v.l*Math.sin(v.alpha*Math.PI/180),
      B: v => v.F/(v.I*v.l*Math.sin(v.alpha*Math.PI/180)),
      I: v => v.F/(v.B*v.l*Math.sin(v.alpha*Math.PI/180)),
      l: v => v.F/(v.B*v.I*Math.sin(v.alpha*Math.PI/180))
    },
    def: 'F'
  },
  {
    id: 'elec_mag_field_coil', name: 'Magnetfeld einer Spule',
    category: 'Elektrotechnik', sub: 'Magnetismus',
    desc: 'Magnetische Flussdichte im Innern einer langen Spule',
    berufe: ['automatiker', 'elektroniker'], lehrjahr: 3,
    vars: {
      B:   { name: 'Flussdichte B',        unit: 'T'   },
      mu0: { name: 'Feldkonstante μ₀',     unit: 'H/m' },
      mur: { name: 'Rel. Permeab. μᵣ',     unit: '–'   },
      N:   { name: 'Windungszahl N',        unit: '–'   },
      I:   { name: 'Strom I',              unit: 'A'   },
      l:   { name: 'Spulenlänge l',        unit: 'm'   }
    },
    forms: { B: 'B = \\mu_0 \\cdot \\mu_r \\cdot \\dfrac{N \\cdot I}{l}' },
    calc:  { B: v => v.mu0*v.mur*v.N*v.I/v.l },
    def: 'B'
  },

  // ── Halbleiter ────────────────────────────────
  {
    id: 'elec_transistor', name: 'Transistor – Stromverstärkung (BJT)',
    category: 'Elektrotechnik', sub: 'Halbleiter',
    desc: 'Kollektorstrom als Vielfaches des Basisstroms',
    berufe: ['elektroniker', 'informatiker'], lehrjahr: 3,
    vars: {
      I_C:  { name: 'Kollektorstrom I_C', unit: 'A' },
      beta: { name: 'Verstärkung β',      unit: '–' },
      I_B:  { name: 'Basisstrom I_B',     unit: 'A' }
    },
    forms: {
      I_C:  'I_C = \\beta \\cdot I_B',
      beta: '\\beta = \\dfrac{I_C}{I_B}',
      I_B:  'I_B = \\dfrac{I_C}{\\beta}'
    },
    calc: { I_C: v => v.beta*v.I_B, beta: v => v.I_C/v.I_B, I_B: v => v.I_C/v.beta },
    def: 'I_C'
  },

  // ── Digitaltechnik ─────────────────────────────
  {
    id: 'elec_bool_and', name: 'Boolesches UND (AND)',
    category: 'Elektrotechnik', sub: 'Digitaltechnik',
    desc: 'Ausgang ist 1, wenn BEIDE Eingänge 1 sind',
    berufe: ['informatiker', 'elektroniker', 'automatiker'], lehrjahr: 2,
    vars: { Y: { name: 'Ausgang Y', unit: '–' }, A: { name: 'Eingang A', unit: '–' }, B: { name: 'Eingang B', unit: '–' } },
    forms: { Y: 'Y = A \\cdot B' },
    calc:  { Y: v => (v.A && v.B) ? 1 : 0 },
    def: 'Y'
  },
  {
    id: 'elec_bool_or', name: 'Boolesches ODER (OR)',
    category: 'Elektrotechnik', sub: 'Digitaltechnik',
    desc: 'Ausgang ist 1, wenn MINDESTENS EIN Eingang 1 ist',
    berufe: ['informatiker', 'elektroniker', 'automatiker'], lehrjahr: 2,
    vars: { Y: { name: 'Ausgang Y', unit: '–' }, A: { name: 'Eingang A', unit: '–' }, B: { name: 'Eingang B', unit: '–' } },
    forms: { Y: 'Y = A + B' },
    calc:  { Y: v => (v.A || v.B) ? 1 : 0 },
    def: 'Y'
  },
  {
    id: 'elec_bool_not', name: 'Boolesches NICHT (NOT)',
    category: 'Elektrotechnik', sub: 'Digitaltechnik',
    desc: 'Ausgang ist das Komplement des Eingangs',
    berufe: ['informatiker', 'elektroniker', 'automatiker'], lehrjahr: 2,
    vars: { Y: { name: 'Ausgang Y', unit: '–' }, A: { name: 'Eingang A', unit: '–' } },
    forms: { Y: 'Y = \\overline{A}' },
    calc:  { Y: v => v.A ? 0 : 1 },
    def: 'Y'
  },
  {
    id: 'elec_demorgan1', name: 'De Morgan 1 (NAND)',
    category: 'Elektrotechnik', sub: 'Digitaltechnik',
    desc: 'Negation einer UND-Verknüpfung',
    berufe: ['informatiker', 'elektroniker', 'automatiker'], lehrjahr: 2,
    vars: { Y: { name: 'Ausgang Y', unit: '–' }, A: { name: 'Eingang A', unit: '–' }, B: { name: 'Eingang B', unit: '–' } },
    forms: { Y: '\\overline{A \\cdot B} = \\overline{A} + \\overline{B}' },
    calc:  { Y: v => (v.A && v.B) ? 0 : 1 },
    def: 'Y'
  },
  {
    id: 'elec_demorgan2', name: 'De Morgan 2 (NOR)',
    category: 'Elektrotechnik', sub: 'Digitaltechnik',
    desc: 'Negation einer ODER-Verknüpfung',
    berufe: ['informatiker', 'elektroniker', 'automatiker'], lehrjahr: 2,
    vars: { Y: { name: 'Ausgang Y', unit: '–' }, A: { name: 'Eingang A', unit: '–' }, B: { name: 'Eingang B', unit: '–' } },
    forms: { Y: '\\overline{A + B} = \\overline{A} \\cdot \\overline{B}' },
    calc:  { Y: v => (v.A || v.B) ? 0 : 1 },
    def: 'Y'
  }
];
