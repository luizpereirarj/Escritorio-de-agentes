/* ===========================================================
   furniture.js — móveis, estações de trabalho e pontos de lazer

   Convenção de altura (px acima do piso):
     0 .. 25   estrutura da mesa
     28        tampo  (tudo que fica "em cima da mesa" nasce aqui)
     28 .. 62  monitor
     9 .. 15   assento da cadeira  (bate com AVATAR.SEAT = 15)
   =========================================================== */
const FURN = (() => {

  const items = [];
  const workSlots = [];
  const restSlots = [];
  const meetSlots = [];

  const TOP  = 28;          // tampo da mesa
  const S    = ISO.toScreen;
  const add  = (o) => { items.push(o); return o; };

  function block(x, y, w, d) {
    for (let i = Math.floor(x); i < Math.ceil(x + w); i++)
      for (let j = Math.floor(y); j < Math.ceil(y + d); j++)
        WORLD.setBlocked(i, j, 1);
  }

  /** cadeira no lugar do boneco, em duas camadas para ele sentar DENTRO dela.
      A pegada acompanha a escala do boneco: se a cadeira ficasse menor que
      ele, o corpo sobraria para fora do encosto.                          */
  function cadeira(seat, tipo, hue, cor) {
    const L = 1.05 * AVATAR.SCALE;                   // lado da pegada, em tiles
    const comum = { x: seat.x - L / 2, y: seat.y - L / 2, w: L, d: L,
                    face: seat.facing, hue: hue || 200, cor };
    // o boneco é desenhado em (seat.x + seat.y + 0.5)
    add(Object.assign({ t: tipo, camada: 'tras',   dk: seat.x + seat.y - 0.25 }, comum));
    return add(Object.assign({ t: tipo, camada: 'frente', dk: seat.x + seat.y + 0.75 }, comum));
  }

  /* ===========================================================
     LAYOUT
     =========================================================== */

  const BR = WORLD.BRAND;
  const R  = WORLD.ROOMS;

  /**
   * Uma estação de trabalho: mesa, cadeira e o lugar do boneco.
   * face 'n' = de costas para nós (a tela aparece);
   * face 's' = de frente para nós (vemos o rosto).
   */
  let nMesa = 0;
  function estacao(id, room, x, rowY, face, extra, vip) {
    nMesa++;
    let deskY, seat;
    if (face === 'n') { deskY = rowY;       seat = { x: x + 1.5, y: rowY + 2.0, facing: 'n' }; }
    else              { deskY = rowY + 1.9; seat = { x: x + 1.5, y: rowY + 1.2, facing: 's' }; }
    const accent = R[room].accent;
    const mesa = add({ t: 'deskWork', id, x, y: deskY, w: 3, d: 1.3, face, busy: false,
                       room, extra, accent, sabor: nMesa % 5, vip: !!vip });
    block(x, deskY, 3, 1.3);
    cadeira(seat, vip ? 'chairBoss' : 'chairOffice', 0, accent);
    workSlots.push({ id, room, label: (vip ? 'Mesa da liderança' : 'Mesa ' + id),
                     x: seat.x, y: seat.y, facing: seat.facing, obj: mesa, vip: !!vip });
  }

  /* ---------- GERENTES DE PROJETO ---------- */
  estacao('GP-1', 'gp', 1.5, 1.6, 's', 'notebook', true);   // sua mesa
  estacao('GP-2', 'gp', 6.2, 1.6, 's', 'notebook');
  estacao('GP-3', 'gp', 1.5, 8,   'n', 'notebook');
  estacao('GP-4', 'gp', 6.2, 8,   'n', 'notebook');
  add({ t: 'plant', x: 9.6, y: 11.3, k: 1 }); block(9.6, 11.3, 1, 1);

  /* ---------- TECH LEADERS ---------- */
  estacao('TL-1', 'tech', 12.5, 1.6, 's', 'dual');
  estacao('TL-2', 'tech', 17.2, 1.6, 's', 'dual');
  estacao('TL-3', 'tech', 12.5, 8,   'n', 'dual');
  estacao('TL-4', 'tech', 17.2, 8,   'n', 'dual');
  add({ t: 'plant', x: 20.5, y: 11.3, k: 0 }); block(20.5, 11.3, 1, 1);

  /* ---------- UX DESIGN ---------- */
  estacao('UX-1', 'ux', 23.5, 1.6, 's', 'tablet');
  estacao('UX-2', 'ux', 28.2, 1.6, 's', 'tablet');
  estacao('UX-3', 'ux', 23.5, 8,   'n', 'tablet');
  estacao('UX-4', 'ux', 28.2, 8,   'n', 'tablet');
  add({ t: 'plant', x: 31.5, y: 11.3, k: 1 }); block(31.5, 11.3, 1, 1);

  /* ---------- QUALIDADE (QA) ---------- */
  [34.3, 38.5, 42.7].forEach((x, i) => estacao('QA-' + (i + 1), 'qa', x, 1.6, 's', 'phones'));
  [34.3, 38.5, 42.7].forEach((x, i) => estacao('QA-' + (i + 4), 'qa', x, 8,   'n', 'phones'));
  add({ t: 'plant', x: 45.6, y: 11.3, k: 0 }); block(45.6, 11.3, 1, 1);

  /* ---------- DESENVOLVIMENTO: open space com 12 estações ---------- */
  const COLS_DEV = [1.4, 5.2, 9.0, 12.8, 16.6, 20.4];
  COLS_DEV.forEach((x, i) => estacao('DEV-' + String(i + 1).padStart(2, '0'), 'dev', x, 20.4, 's', i % 2 ? 'dual' : null));
  COLS_DEV.forEach((x, i) => estacao('DEV-' + String(i + 7).padStart(2, '0'), 'dev', x, 26.6, 'n', i % 2 ? null : 'dual'));
  add({ t: 'plant', x: 1.2,  y: 31.4, k: 0 }); block(1.2, 31.4, 1, 1);
  add({ t: 'plant', x: 23.6, y: 31.4, k: 1 }); block(23.6, 31.4, 1, 1);
  add({ t: 'printer', x: 10.6, y: 31.3, w: 1.3, d: .9 }); block(10.6, 31.3, 1.3, .9);

  /* ---------- SALA DE REUNIÃO ---------- */
  const mtable = add({ t: 'meetTable', x: 27.6, y: 24, w: 7, d: 3.2 });
  block(27.6, 24, 7, 3.2);
  [28.4, 30.6, 32.8].forEach((x, i) => {
    const s = { id: 'MT' + i, x, y: 23.2, facing: 's', sit: true, obj: mtable };
    meetSlots.push(s); cadeira(s, 'chairSimple');
  });
  [28.4, 30.6, 32.8].forEach((x, i) => {
    const s = { id: 'MB' + i, x, y: 27.9, facing: 'n', sit: true, obj: mtable };
    meetSlots.push(s); cadeira(s, 'chairSimple');
  });
  [{ id: 'ML', x: 26.8, y: 25.6, facing: 'e' }, { id: 'MR', x: 35.3, y: 25.6, facing: 'w' }]
    .forEach(p => {
      const s = Object.assign({ sit: true, obj: mtable }, p);
      meetSlots.push(s); cadeira(s, 'chairSimple');
    });
  add({ t: 'tvWall', x: 28.6, y: 19.1, w: 5, d: 0.5, meeting: true });
  add({ t: 'plant', x: 26.2, y: 31.4, k: 0 }); block(26.2, 31.4, 1, 1);
  add({ t: 'plant', x: 34.6, y: 31.4, k: 1 }); block(34.6, 31.4, 1, 1);

  /* ---------- JOGOS ---------- */
  [37.3, 39.0].forEach((x, i) => {
    const o = add({ t: 'arcade', x, y: 19.2, w: 1.5, d: 1.2, hue: [20, 210][i] });
    block(x, 19.2, 1.5, 1.2);
    restSlots.push({ id: 'ARC' + i, label: 'fliperama', x: x + 0.75, y: 21.0, facing: 'n',
                     act: 'jogando fliperama', obj: o });
  });
  add({ t: 'vending', x: 45.4, y: 19.2 }); block(45.4, 19.2, 1.2, 1.2);
  add({ t: 'neonSign', x: 43.0, y: 18, txt: 'JOGOS', cor: BR.laranja });

  const pool = add({ t: 'poolTable', x: 38.2, y: 22.6, w: 4.6, d: 2.6 });
  block(38.2, 22.6, 4.6, 2.6);
  restSlots.push({ id: 'POOL0', label: 'sinuca', x: 37.3, y: 23.9, facing: 'e', act: 'na sinuca', obj: pool });
  restSlots.push({ id: 'POOL1', label: 'sinuca', x: 43.6, y: 23.9, facing: 'w', act: 'na sinuca', obj: pool });
  restSlots.push({ id: 'POOL2', label: 'sinuca', x: 40.5, y: 21.7, facing: 's', act: 'na sinuca', obj: pool });

  const peb = add({ t: 'foosball', x: 38.4, y: 27.2, w: 4.2, d: 2 });
  block(38.4, 27.2, 4.2, 2);
  restSlots.push({ id: 'PEB0', label: 'pebolim', x: 37.4, y: 28.2, facing: 'e', act: 'no pebolim', obj: peb });
  restSlots.push({ id: 'PEB1', label: 'pebolim', x: 43.5, y: 28.2, facing: 'w', act: 'no pebolim', obj: peb });

  [[44.7, 25.6, 24], [44.9, 30.0, 215]].forEach((b, i) => {
    const o = add({ t: 'beanbag', x: b[0], y: b[1], hue: b[2] });
    block(b[0], b[1], 1.2, 1.2);
    restSlots.push({ id: 'BAG' + i, label: 'puff', x: b[0] + 0.6, y: b[1] + 0.55,
                     facing: 's', sit: true, act: 'descansando no puff', obj: o });
  });

  const bar = add({ t: 'bar', x: 38.6, y: 31.2, w: 4.6, d: 1.2 });
  block(38.6, 31.2, 4.6, 1.2);
  restSlots.push({ id: 'BAR0', label: 'café', x: 39.6, y: 30.3, facing: 's', act: 'tomando um café', obj: bar });
  restSlots.push({ id: 'BAR1', label: 'café', x: 42.0, y: 30.3, facing: 's', act: 'tomando um café', obj: bar });
  add({ t: 'plant', x: 37.2, y: 31.4, k: 1 }); block(37.2, 31.4, 1, 1);

  /* ---------- RECEPÇÃO & CIRCULAÇÃO ---------- */
  add({ t: 'elevator',  x: 46, y: 14.2, w: 1, d: 3.6 });
  add({ t: 'reception', x: 41.4, y: 14.15, w: 3, d: .9 }); block(41.4, 14.15, 3, .9);
  // pilares da estrutura do prédio, alinhados com as divisórias
  [11.15, 22.15, 33.15].forEach(x => { add({ t: 'column', x, y: 14.15, w: .7, d: .7 }); block(x, 14.15, .7, .7); });
  add({ t: 'sofa', x: 33.4, y: 17.05, w: 2.6, d: .9, dir: 'n', c: BR.marinho }); block(33.4, 17.05, 2.6, .9);
  add({ t: 'printer', x: 6.6, y: 17.05, w: 1.3, d: .85 }); block(6.6, 17.05, 1.3, .85);
  add({ t: 'cooler', x: 19.1, y: 17.0 });                    block(19.1, 17.0, 1, 1);
  add({ t: 'plant', x: 1.2,  y: 17.0, k: 0 });               block(1.2, 17.0, 1, 1);
  add({ t: 'plant', x: 24.4, y: 17.0, k: 1 });               block(24.4, 17.0, 1, 1);
  add({ t: 'plant', x: 38.2, y: 17.0, k: 0 });               block(38.2, 17.0, 1, 1);
  add({ t: 'extintor', x: 46.3, y: 17.3 });                  block(46.3, 17.3, .5, .5);
  add({ t: 'extintor', x: 1.2, y: 14.3 });                   block(1.2, 14.3, .5, .5);
  add({ t: 'exitSign', x: 2.4, y: 15.6 });

  /* ===========================================================
     DESENHO
     =========================================================== */
  /** pinta sub-peças de um móvel do fundo para a frente (menor y primeiro) */
  function emOrdem(pecas) {
    pecas.sort((a, b) => a[0] - b[0]).forEach(p => p[1]());
  }

  /* Peças que nunca mudam (cadeira, sinuca, pebolim, sofá, expositor…) são
     pintadas uma vez num canvas próprio e depois só copiadas. O cache é
     feito em 2x para continuar nítido no zoom. O que tem RGB ou animação
     — mesa, arcade, rack, TV, planta — continua sendo desenhado ao vivo. */
  const ALTURA_CACHE = {
    chairGamer: 78, chairBoss: 84, chairSimple: 58, chairOffice: 80, expositor: 96,
    pilhaCaixas: 118, poolTable: 56, foosball: 52, sofa: 60,
    rug: 12, lowTable: 40, cooler: 64, column: 124, printer: 50, extintor: 44
  };
  const ESC_CACHE = 2;
  const cacheMovel = new Map();

  function montaCacheMovel(o, f) {
    const w = o.w || 1, d = o.d || 1;
    const alto = ALTURA_CACHE[o.t] || 120;
    const x0 = ISO.toScreen(o.x, o.y + d).x - 22;
    const x1 = ISO.toScreen(o.x + w, o.y).x + 22;
    const y0 = ISO.toScreen(o.x, o.y).y - alto;
    const y1 = ISO.toScreen(o.x + w, o.y + d).y + 26;
    const W = Math.ceil((x1 - x0) * ESC_CACHE), H = Math.ceil((y1 - y0) * ESC_CACHE);
    if (W <= 0 || H <= 0 || W * H > 1.2e6) return null;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    c.scale(ESC_CACHE, ESC_CACHE);
    c.translate(-x0, -y0);
    f(c, o, 0);
    return { cv, x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  function drawItem(ctx, o, t) {
    const f = DRAW[o.t];
    if (!f) return;
    if (!(o.t in ALTURA_CACHE)) { f(ctx, o, t); return; }
    let c = cacheMovel.get(o);
    if (c === undefined) { c = montaCacheMovel(o, f); cacheMovel.set(o, c); }
    if (!c) { f(ctx, o, t); return; }
    ctx.drawImage(c.cv, c.x, c.y, c.w, c.h);
  }
  function depth(o) {
    if (o.dk !== undefined) return o.dk;
    return (o.x + (o.w || 1) / 2) + (o.y + (o.d || 1) / 2);
  }

  /** superfície virada para +y (a que a câmera enxerga), em px */
  function faceY(ctx, x, yPlane, lenTiles, topZ, fn) {
    const T = ISO.TW;
    const o = ISO.toScreen(x, yPlane, topZ);
    ctx.save();
    ctx.transform(ISO.HW / T, ISO.HH / T, 0, 1, o.x, o.y);
    fn(ctx, lenTiles * T);
    ctx.restore();
  }

  /** caneca de café em cima da mesa (cor muda por mesa) */
  const CANECAS = ['#e9edf8', '#7c6cff', '#38bdf8', '#f472b6', '#22c55e'];
  function caneca(ctx, cx, cy, z, cor, s = 1) {
    const c = CANECAS[((cor | 0) % CANECAS.length + CANECAS.length) % CANECAS.length];
    const r = 0.11 * s;
    ISO.cyl(ctx, cx, cy, r, 13 * s, z, c);
    ISO.cyl(ctx, cx, cy, r * .82, 1.5, z + 13 * s - 1.5, '#3b2418');
    const p = ISO.toScreen(cx + r * 1.2, cy, z + 7 * s);
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 1.6 * s;
    ctx.beginPath(); ctx.arc(p.x + 1.5 * s, p.y, 2.6 * s, -1.3, 1.3); ctx.stroke(); ctx.restore();
  }

  const DRAW = {

    /* ================= MESA CORPORATIVA =================
       Tampo branco, pés de aço escovado, monitor e o que for da função:
       notebook (GP), dois monitores (TL/dev), mesa digitalizadora (UX),
       celulares de teste (QA).                                         */
    deskWork(ctx, o, t) {
      const { x, y, w, d } = o;
      const tela = WORLD.BRAND.claro;
      const telaVisivel = (o.face === 'n');
      ISO.shadow(ctx, x + w / 2, y + d / 2, Math.max(w, d) * .55, .14);

      // pés em "U" de aço e calha de cabos
      const aco = '#aeb8c6';
      ISO.box(ctx, x + .08,     y + .1, .1, d - .2, 25, 0, aco, { top: '#c6ced9' });
      ISO.box(ctx, x + w - .18, y + .1, .1, d - .2, 25, 0, aco, { top: '#c6ced9' });
      ISO.box(ctx, x + .2, y + .2, w - .4, .08, 5, 18, '#c6ced9');
      // tampo
      ISO.box(ctx, x - .04, y - .04, w + .08, d + .08, 3, TOP - 3, '#eef1f5',
              { top: o.vip ? '#f1e6d8' : '#fbfcfd', left: '#dde2e9', right: '#c9d0da', line: 'rgba(11,42,85,.14)' });
      // filete da cor da sala na borda da frente
      ISO.quad(ctx, [S(x - .04, y + d + .04, TOP), S(x + w + .04, y + d + .04, TOP),
                     S(x + w + .04, y + d + .04, TOP - 1.4), S(x - .04, y + d + .04, TOP - 1.4)],
               ISO.rgba(o.accent || WORLD.BRAND.azul, .9));

      const monY = o.face === 'n' ? y + .12 : y + .62;
      const tecY = o.face === 'n' ? y + .78 : y + .08;
      const pecas = [];
      if (o.extra === 'dual') {
        pecas.push([monY, () => { monitor(ctx, x + .25, monY, 1.25, telaVisivel, o.busy, tela, t, o);
                                  monitor(ctx, x + 1.55, monY, 1.25, telaVisivel, o.busy, tela, t, o); }]);
      } else {
        pecas.push([monY, () => monitor(ctx, x + w / 2 - .95, monY, 1.6, telaVisivel, o.busy, tela, t, o)]);
      }
      pecas.push([tecY, () => tecladoClaro(ctx, x + w / 2 - .85, tecY)]);
      pecas.push([y + d / 2, () => caneca(ctx, x + .35, y + d / 2, TOP, o.sabor, .85)]);
      if (o.extra === 'notebook') {
        const ny = o.face === 'n' ? y + .7 : y + .15;
        pecas.push([ny, () => {
          ISO.box(ctx, x + w - .8, ny, .5, .4, 1.5, TOP, WORLD.BRAND.laranja, { top: '#ff9a52' });
          ISO.plane(ctx, x + w - .76, ny + .04, .03, .32, TOP + 1.6, 'rgba(255,255,255,.7)');
        }]);
      } else if (o.extra === 'tablet') {
        const ny = o.face === 'n' ? y + .66 : y + .14;
        pecas.push([ny, () => {
          ISO.box(ctx, x + w - .9, ny, .7, .5, 1.2, TOP, '#2b3444', { top: '#384356' });
          ISO.plane(ctx, x + w - .84, ny + .05, .58, .4, TOP + 1.3, ISO.rgba(WORLD.BRAND.laranja, .25));
          ISO.box(ctx, x + w - .25, ny + .1, .04, .34, 1.2, TOP + 1.3, '#e9edf2');
        }]);
      } else if (o.extra === 'phones') {
        const ny = o.face === 'n' ? y + .75 : y + .15;
        pecas.push([ny, () => {
          [0, .3].forEach((dx, i) => {
            ISO.box(ctx, x + w - .75 + dx, ny, .2, .36, 1.2, TOP, '#1d2430', { top: '#232c3a' });
            ISO.plane(ctx, x + w - .73 + dx, ny + .03, .16, .3, TOP + 1.3,
                      i ? ISO.rgba(WORLD.BRAND.azul, .8) : ISO.rgba('#3ccf8e', .8));
          });
        }]);
      }
      emOrdem(pecas);
    },

    chairOffice(ctx, o) { cadeiraBase(ctx, o, '#2e3a4e', o.cor || WORLD.BRAND.azul, 30, true); },

    column(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, .55, .12);
      ISO.box(ctx, x, y, w, d, WORLD.WALL_H, 0, '#eef1f5',
              { top: '#c4cedb', left: '#e4e8ee', right: '#cfd6df', line: 'rgba(11,42,85,.10)' });
      ISO.box(ctx, x - .02, y - .02, w + .04, d + .04, 5, 0, '#b9c4d2');
    },

    printer(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, .8, .14);
      ISO.box(ctx, x, y, w, d, 22, 0, '#d4dae3', { top: '#e3e8ee' });
      ISO.box(ctx, x + .05, y + .05, w - .1, d - .1, 12, 22, '#eef1f5', { top: '#f8f9fb' });
      ISO.box(ctx, x + .2, y + d - .2, w - .4, .12, 2, 26, '#2b3444');
      ISO.plane(ctx, x + .3, y + .15, w - .6, .45, 34.2, '#ffffff');
      ISO.plane(ctx, x + w - .3, y + .2, .12, .12, 34.3, '#3ccf8e');
    },

    extintor(ctx, o) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .25, y + .25, .25, .18);
      ISO.cyl(ctx, x + .25, y + .25, .12, 24, 2, '#d93b30');
      ISO.cyl(ctx, x + .25, y + .25, .05, 5, 26, '#2b3444');
    },

    exitSign(ctx, o) {
      const { x, y } = o;
      ISO.box(ctx, x, y, 1.2, .08, 14, 92, '#2fa35a');
      faceY(ctx, x, y + .08, 1.2, 105, (c, len) => {
        c.fillStyle = '#2fa35a'; c.fillRect(0, 0, len, 13);
        c.fillStyle = '#ffffff'; c.font = "700 8px 'Barlow Semi Condensed', sans-serif";
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('SAÍDA  ⟵', len / 2, 7);
      });
      ISO.box(ctx, x + .58, y + .02, .04, .04, 10, 106, '#9aa6b6');
    },

    /* ================= MESA GAMER =================
       Suporta mesa no eixo Y (face 'n'/'s') e no eixo X (face 'e'/'w').
       No eixo X o boneco senta de perfil e a mesa fica ao lado dele.     */
    deskGamer(ctx, o, t) {
      const { x, y, w, d } = o;
      const neon = ISO.hsl((o.hue + t * 26) % 360, 92, 58);
      const eixoX = (o.face === 'e' || o.face === 'w');
      // a tela só aponta para a câmera quando o boneco está de costas
      const telaVisivel = (o.face === 'n' || o.face === 'w');

      ISO.shadow(ctx, x + w / 2, y + d / 2, Math.max(w, d) * .55, .28);

      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const gp = S(x + w / 2, y + d / 2, 6);
      ISO.glow(ctx, gp.x, gp.y, 74, neon, o.busy ? .3 : .13);
      ctx.restore();

      /* estrutura: dois painéis nas pontas + travessa */
      if (eixoX) {
        ISO.box(ctx, x + .12, y + .05,      w - .24, .17, 25, 0, '#1c202b');
        ISO.box(ctx, x + .12, y + d - .22,  w - .24, .17, 25, 0, '#1c202b');
        ISO.box(ctx, x + .16, y + .22,      .1, d - .44, 14, 6, '#181c26');
      } else {
        ISO.box(ctx, x + .05,     y + .12, .17, d - .24, 25, 0, '#1c202b');
        ISO.box(ctx, x + w - .22, y + .12, .17, d - .24, 25, 0, '#1c202b');
        ISO.box(ctx, x + .22,     y + .16, w - .44, .1,  14, 6, '#181c26');
      }
      ISO.plane(ctx, x - .05, y - .05, w + .1, d + .1, TOP, '#39414f');
      ISO.plane(ctx, x + .1,  y + .06, w - .2, d - .22, TOP + .1, 'rgba(255,255,255,.028)');

      // fita de LED na borda do tampo virada para a câmera
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ISO.quad(ctx, [S(x - .05, y + d + .05, 25), S(x + w + .05, y + d + .05, 25),
                     S(x + w + .05, y + d + .05, 21), S(x - .05, y + d + .05, 21)],
               ISO.rgba(neon, .68));
      ctx.restore();

      if (eixoX) {
        // mesa de lado: monitor no fundo, teclado na beira de quem senta
        const cy  = y + d / 2;
        const monX = o.face === 'e' ? x + .55 : x + .2;
        const tecX = o.face === 'e' ? x + .06 : x + .62;
        emOrdem([
          [monX, () => monitorY(ctx, monX, cy - .85, 1.7, telaVisivel, o.busy, neon, t)],
          [tecX, () => tecladoY(ctx, tecX, cy - .78, neon)],
          [x + .1,  () => gabinete(ctx, x + .1, y + d - .92, neon, t)],
          [x + w - .45, () => caneca(ctx, x + w - .35, y + .38, TOP, o.sabor, .85)]
        ]);
      } else {
        const monY = o.face === 'n' ? y + .12 : y + .62;
        const tecY = o.face === 'n' ? y + .78 : y + .06;
        const mw = 1.7, mx = x + w / 2 - mw / 2 - .3;
        emOrdem([
          [monY,      () => monitor(ctx, mx, monY, mw, telaVisivel, o.busy, neon, t, o)],
          [tecY,      () => teclado(ctx, x + w / 2 - .95, tecY, neon)],
          [y + .14,   () => gabinete(ctx, x + w - .68, y + .14, neon, t)],
          [y + d / 2, () => caneca(ctx, x + .42, y + d / 2, TOP, o.sabor, .85)]
        ]);
      }
    },

    /* ================= MESA DA DIRETORIA ================= */
    deskBoss(ctx, o, t) {
      const { x, y, w, d } = o;
      const neon = ISO.hsl((o.hue + t * 16) % 360, 88, 56);
      ISO.shadow(ctx, x + w / 2, y + d / 2, 2.1, .3);

      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const gp = S(x + w / 2, y + d / 2, 6);
      ISO.glow(ctx, gp.x, gp.y, 94, neon, o.busy ? .3 : .13);
      ctx.restore();

      ISO.box(ctx, x + .06,     y + .12, .2, d - .24, 25, 0, '#191419');
      ISO.box(ctx, x + w - .26, y + .12, .2, d - .24, 25, 0, '#191419');
      ISO.box(ctx, x + .26,     y + .16, w - .52, .12, 16, 6, '#151115');
      ISO.plane(ctx, x - .06, y - .06, w + .12, d + .12, TOP, '#3d2d35');
      for (let i = 0; i < 6; i++)
        ISO.plane(ctx, x, y + .12 + i * .24, w, .035, TOP + .1, 'rgba(255,255,255,.04)');

      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ISO.quad(ctx, [S(x - .06, y + d + .06, 25), S(x + w + .06, y + d + .06, 25),
                     S(x + w + .06, y + d + .06, 21), S(x - .06, y + d + .06, 21)],
               ISO.rgba(neon, .7));
      ctx.restore();

      // dois monitores, de costas (quem senta está de frente para nós)
      const monY = y + .66;
      emOrdem([
        [monY,      () => { monitor(ctx, x + .42,  monY, 1.5, false, o.busy, neon, t, o);
                            monitor(ctx, x + 2.24, monY, 1.5, false, o.busy, neon, t, o); }],
        [y + .06,   () => teclado(ctx, x + w / 2 - 1.0, y + .06, neon)],
        [y + .18,   () => gabinete(ctx, x + w - .72, y + .18, neon, t)],
        [y + d - .3,() => caneca(ctx, x + .2, y + d - .3, TOP, 0, .9)]
      ]);
    },

    /* ================= CADEIRAS ================= */
    chairGamer(ctx, o) { const a = ISO.hsl(o.hue, 85, 52);
      cadeiraBase(ctx, o, '#14171f', a, 30, true); },
    chairBoss(ctx, o)  {
      cadeiraBase(ctx, o, '#1f2a3d', WORLD.BRAND.laranja, 34, true); },
    chairSimple(ctx, o){
      cadeiraBase(ctx, o, '#d6dce5', WORLD.BRAND.laranja, 22, false); },

    /* ---------- o resto do mobiliário ---------- */
    arcade(ctx, o, t) {
      const { x, y } = o;
      const neon = ISO.hsl((o.hue + t * 40) % 360, 95, 60);
      ISO.shadow(ctx, x + .75, y + .6, .9, .3);
      ISO.box(ctx, x, y, 1.5, 1.2, 84, 0, '#161a2c');
      ISO.box(ctx, x - .04, y - .04, 1.58, 1.28, 14, 84, '#0e1120', { top: ISO.rgba(neon, .8) });
      const p1 = S(x, y + 1.2, 74), p2 = S(x + 1.5, y + 1.2, 74);
      const p3 = S(x + 1.5, y + 1.2, 44), p4 = S(x, y + 1.2, 44);
      ISO.quad(ctx, [p1, p2, p3, p4], '#04060e');
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 9; i++) {
        const f = i / 9, hh = .15 + .5 * Math.abs(Math.sin(t * 3 + i));
        ISO.quad(ctx, [
          { x: p1.x + (p2.x - p1.x) * f,        y: p1.y + (p2.y - p1.y) * f + (p4.y - p1.y) * hh },
          { x: p1.x + (p2.x - p1.x) * (f + .07), y: p1.y + (p2.y - p1.y) * (f + .07) + (p4.y - p1.y) * hh },
          { x: p1.x + (p2.x - p1.x) * (f + .07), y: p4.y + (p3.y - p4.y) * (f + .07) },
          { x: p1.x + (p2.x - p1.x) * f,         y: p4.y + (p3.y - p4.y) * f }
        ], ISO.rgba(ISO.hsl((o.hue + i * 30) % 360, 95, 60), .55));
      }
      ctx.restore();
      ISO.box(ctx, x + .05, y + 1.14, 1.4, .5, 8, 34, '#1b2136', { top: '#262d47' });
      ISO.cyl(ctx, x + .45, y + 1.4, .1, 9, 42, '#7c6cff');
      ISO.cyl(ctx, x + .75, y + 1.4, .09, 7, 42, '#38bdf8');
      ISO.cyl(ctx, x + 1.05, y + 1.4, .09, 7, 42, '#c4b8ff');
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = S(x + .75, y + .6, 70); ISO.glow(ctx, g.x, g.y, 74, neon, .3);
      ctx.restore();
    },

    poolTable(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 2.4, .32);
      [[.2, .2], [w - .6, .2], [.2, d - .6], [w - .6, d - .6]]
        .forEach(p => ISO.box(ctx, x + p[0], y + p[1], .4, .4, 26, 0, '#231208'));
      ISO.box(ctx, x, y, w, d, 12, 26, '#3a1d0c', { top: '#4a2610' });
      ISO.plane(ctx, x + .28, y + .28, w - .56, d - .56, 38.4, '#0f5c3a');
      ISO.plane(ctx, x + .28, y + .28, w - .56, d - .56, 38.4, null, 'rgba(0,0,0,.35)');
      [['#f2f2f2', .5, .5], ['#c4b8ff', 2.6, 1.0], ['#7c6cff', 3.0, 1.35],
       ['#18a2ff', 3.3, .9], ['#8b5cf6', 2.8, 1.7], ['#22c55e', 3.5, 1.6]]
      .forEach(([c, bx, by]) => {
        const p = S(x + bx, y + by, 38.4);
        ctx.fillStyle = 'rgba(0,0,0,.3)';
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 2, 6, 3.4, 0, 0, 7); ctx.fill();
        const g = ctx.createRadialGradient(p.x - 2, p.y - 4, 1, p.x, p.y - 2, 7);
        g.addColorStop(0, ISO.shade(c, .5)); g.addColorStop(1, ISO.shade(c, -.25));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y - 2, 5.4, 0, 7); ctx.fill();
      });
    },

    foosball(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 2.1, .3);
      [[.15, .15], [w - .5, .15], [.15, d - .5], [w - .5, d - .5]]
        .forEach(p => ISO.box(ctx, x + p[0], y + p[1], .35, .35, 24, 0, '#16203a'));
      ISO.box(ctx, x, y, w, d, 10, 24, '#1d2742', { top: '#14361f' });
      ISO.plane(ctx, x + .2, y + .2, w - .4, d - .4, 34.4, '#166534');
      ISO.plane(ctx, x + w / 2 - .03, y + .2, .06, d - .4, 34.5, 'rgba(255,255,255,.45)');
      for (let i = 0; i < 5; i++) {
        const bx = x + .6 + i * ((w - 1.2) / 4);
        ISO.box(ctx, bx, y - .18, .07, d + .36, 4, 44, '#9aa6c4');
        for (let j = 0; j < 3; j++)
          ISO.box(ctx, bx - .07, y + .5 + j * ((d - 1) / 2) - .1, .22, .22, 11, 34,
                  i % 2 ? WORLD.BRAND.laranja : WORLD.BRAND.azul);
      }
    },

    sofa(ctx, o) {
      const { x, y, w, d } = o;
      const c = o.c || '#2b2340';
      ISO.shadow(ctx, x + w / 2, y + d / 2, Math.max(w, d) * .55, .28);
      ISO.box(ctx, x, y, w, d, 16, 0, ISO.shade(c, -.2));
      if (o.dir === 'n') {
        ISO.box(ctx, x, y, w, .42, 34, 16, c);
        ISO.box(ctx, x, y + .42, .38, d - .42, 16, 16, ISO.shade(c, .06));
        ISO.box(ctx, x + w - .38, y + .42, .38, d - .42, 16, 16, ISO.shade(c, .06));
        ISO.plane(ctx, x + .4, y + .46, w - .8, d - .5, 32, ISO.shade(c, .16));
      } else {
        ISO.box(ctx, x, y, .42, d, 34, 16, c);
        ISO.box(ctx, x + .42, y, w - .42, .38, 16, 16, ISO.shade(c, .06));
        ISO.box(ctx, x + .42, y + d - .38, w - .42, .38, 16, 16, ISO.shade(c, .06));
        ISO.plane(ctx, x + .46, y + .4, w - .5, d - .8, 32, ISO.shade(c, .16));
      }
    },

    beanbag(ctx, o) {
      const { x, y } = o;
      const c = ISO.hsl(o.hue, 62, 46);
      ISO.shadow(ctx, x + .6, y + .6, .82, .28);
      const p = S(x + .6, y + .6, 0);
      const g = ctx.createRadialGradient(p.x - 6, p.y - 22, 3, p.x, p.y - 12, 30);
      g.addColorStop(0, ISO.shade(c, .3)); g.addColorStop(1, ISO.shade(c, -.28));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(p.x, p.y - 11, 30, 19, 0, 0, 7); ctx.fill();
      ctx.fillStyle = ISO.shade(c, .12);
      ctx.beginPath(); ctx.ellipse(p.x, p.y - 20, 22, 11, 0, 0, 7); ctx.fill();
    },

    lowTable(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, .9, .26);
      ISO.box(ctx, x + .12, y + .12, .12, .12, 18, 0, '#24202c');
      ISO.box(ctx, x + w - .24, y + d - .24, .12, .12, 18, 0, '#24202c');
      ISO.box(ctx, x, y, w, d, 5, 18, '#2e2836', { top: 'rgba(160,190,255,.2)' });
      caneca(ctx, x + w / 2, y + d / 2, 23, 1, .8);
    },

    rug(ctx, o) {
      const { x, y, w, d } = o;
      ISO.plane(ctx, x, y, w, d, 0.6, ISO.rgba(o.c || '#2a2240', .78));
      ISO.plane(ctx, x + .3, y + .3, w - .6, d - .6, 0.7, null, 'rgba(255,255,255,.07)');
    },

    tvWall(ctx, o, t) {
      const { x, y, w } = o;
      const h = 62, z = 46;
      ISO.box(ctx, x, y, w, .22, h, z, '#0a0c14');
      faceY(ctx, x + .02, y + .22, w - .04, z + h - 4, (c, len) => {
        c.fillStyle = '#05070f'; c.fillRect(0, 0, len, h - 8);
        if (o.meeting) {
          c.fillStyle = WORLD.BRAND.marinho; c.fillRect(0, 0, len, h - 8);
          WORLD.logo(c, 10, 8, 20);
          c.textAlign = 'left'; c.textBaseline = 'middle';
          c.font = "700 9px 'Barlow Semi Condensed', sans-serif";
          c.fillStyle = '#ffffff'; c.fillText('SPRINT REVIEW', 36, 13);
          c.font = "600 7.5px 'Barlow Semi Condensed', sans-serif";
          c.fillStyle = WORLD.BRAND.pessego;
          c.fillText(new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }).toUpperCase(), 36, 23);
          const metas = [.82, .64, .91];
          for (let i = 0; i < 3; i++) {
            c.fillStyle = 'rgba(255,255,255,.12)';
            c.fillRect(12, 34 + i * 6, len - 24, 3);
            c.fillStyle = i === 1 ? WORLD.BRAND.laranja : WORLD.BRAND.claro;
            c.fillRect(12, 34 + i * 6, (len - 24) * metas[i] * (.9 + .1 * Math.sin(t * .5 + i)), 3);
          }
        } else {
          for (let i = 0; i < 5; i++) {
            c.fillStyle = ISO.rgba(ISO.hsl((t * 30 + i * 60) % 360, 80, 55), .22);
            c.fillRect(i * len / 5, 0, len / 5, h - 8);
          }
        }
      });
    },

    bar(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 2.3, .16);
      ISO.box(ctx, x, y, w, d, 46, 0, '#ffffff', { top: '#f0f2f5', left: '#eef1f5', right: '#d6dce5' });
      ISO.quad(ctx, [S(x, y + d, 44), S(x + w, y + d, 44), S(x + w, y + d, 40), S(x, y + d, 40)],
               WORLD.BRAND.laranja);
      // máquina de espresso
      ISO.box(ctx, x + 2.6, y + .2, .9, .7, 26, 46, '#2b3444', { top: '#3a4559' });
      ISO.box(ctx, x + 2.75, y + .82, .6, .1, 4, 58, '#c6ced9');
      dispenser(ctx, x + 1.1, y + .55, WORLD.BRAND.laranja, t);
      for (let i = 0; i < 4; i++) ISO.cyl(ctx, x + .35, y + .3 + i * .22, .08, 9, 46, '#e9edf8');
    },

    vending(ctx, o, t) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .6, y + .6, .8, .3);
      ISO.box(ctx, x, y, 1.2, 1.1, 92, 0, '#141a2e');
      faceY(ctx, x + .08, y + 1.1, 1.04, 86, (c, len) => {
        c.fillStyle = 'rgba(10,14,26,.92)'; c.fillRect(0, 0, len, 62);
        for (let r = 0; r < 4; r++) for (let i = 0; i < 3; i++) {
          c.fillStyle = ISO.rgba(['#38bdf8', '#a78bfa', '#f472b6'][i], .82);
          ISO.rrect(c, 5 + i * (len - 10) / 3, 6 + r * 14, (len - 10) / 3 - 4, 10, 2); c.fill();
        }
      });
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = S(x + .6, y + .6, 60);
      ISO.glow(ctx, g.x, g.y, 62, ISO.hsl((t * 50) % 360, 90, 60), .2);
      ctx.restore();
    },

    rack(ctx, o, t) {
      const { x, y } = o;
      const neon = ISO.hsl((o.hue + t * 12) % 360, 90, 55);
      ISO.shadow(ctx, x + .6, y + .5, .78, .3);
      ISO.box(ctx, x, y, 1.2, 1, 86, 0, '#0e1220', { top: '#1a2136' });
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 9; i++) {
        const z = 8 + i * 8.6, on = Math.sin(t * 4 + i * 2.1) > -.2;
        ISO.quad(ctx, [S(x + .1, y + 1, z + 3), S(x + 1.1, y + 1, z + 3),
                       S(x + 1.1, y + 1, z), S(x + .1, y + 1, z)],
                 ISO.rgba(on ? neon : '#1b2540', on ? .62 : .3));
      }
      const g = S(x + .6, y + .5, 50); ISO.glow(ctx, g.x, g.y, 58, neon, .2);
      ctx.restore();
      faceY(ctx, x, y + 1, 1.2, 100, (c, len) => {
        c.textAlign = 'center'; c.font = "700 8px 'Barlow Semi Condensed', sans-serif";
        c.fillStyle = ISO.rgba(neon, .95); c.fillText(o.label, len / 2, 6);
      });
    },

    elevator(ctx, o, t) {
      const { x, y, d } = o;
      const andar = 12;
      WORLD.wallFace(ctx, 'w', x, y, d, 100, (c, len) => {
        const portas = 2, gap = 12, pw = (len - gap * (portas + 1)) / portas;
        for (let i = 0; i < portas; i++) {
          const px = gap + i * (pw + gap);
          c.fillStyle = WORLD.BRAND.marinho; ISO.rrect(c, px - 3, 10, pw + 6, 88, 3); c.fill();
          const g = c.createLinearGradient(px, 0, px + pw, 0);
          g.addColorStop(0, '#c7d0db'); g.addColorStop(.5, '#e8ecf1'); g.addColorStop(1, '#b4bfcc');
          c.fillStyle = g; c.fillRect(px, 14, pw, 84);
          c.fillStyle = 'rgba(11,42,85,.35)'; c.fillRect(px + pw / 2 - .6, 14, 1.2, 84);
          // indicador do andar
          c.fillStyle = '#0b1220'; ISO.rrect(c, px + pw / 2 - 14, 0, 28, 9, 2); c.fill();
          c.fillStyle = WORLD.BRAND.laranja; c.font = "700 7.5px 'Barlow', sans-serif";
          c.textAlign = 'center'; c.textBaseline = 'middle';
          const sobe = Math.sin(t * .4 + i * 2) > 0;
          c.fillText((sobe ? '▲ ' : '▼ ') + andar, px + pw / 2, 5);
        }
      });
    },

    reception(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 1.6, .16);
      ISO.box(ctx, x, y, w, d, 40, 0, '#ffffff', { top: '#f3f5f8', left: '#f6f8fa', right: '#d6dce5' });
      ISO.box(ctx, x - .05, y - .05, w + .1, d + .1, 2, 40, '#e3e8ee', { top: '#fbfcfd' });
      faceY(ctx, x, y + d, w, 38, (c, len) => {
        c.fillStyle = WORLD.BRAND.marinho; c.fillRect(0, 0, len, 30);
        c.fillStyle = WORLD.BRAND.laranja; c.fillRect(0, 30, len, 3);
        WORLD.logo(c, 10, 5, 20);
        c.textAlign = 'left'; c.textBaseline = 'middle';
        c.font = "700 9px 'Barlow', sans-serif"; c.letterSpacing = '2px';
        c.fillStyle = '#ffffff'; c.fillText('RECEPÇÃO', 38, 11);
        c.font = "600 6.5px 'Barlow Semi Condensed', sans-serif"; c.letterSpacing = '1px';
        c.fillStyle = WORLD.BRAND.pessego; c.fillText('SQUAD PAGAR & RECEBER', 38, 21);
      });
      // monitor e caneca do balcão
      ISO.box(ctx, x + .5, y + .2, .9, .08, 16, 44, '#1d2430');
      caneca(ctx, x + w - .35, y + .5, 42, 0, .8);
      void t;
    },

    plant(ctx, o, t) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .5, y + .5, .5, .16);
      ISO.cyl(ctx, x + .5, y + .5, .3, 20, 0, o.k ? '#f1f3f6' : '#cfd6df');
      const base = S(x + .5, y + .5, 20);
      const nn = o.k ? 7 : 9;
      for (let i = 0; i < nn; i++) {
        const a = (i / nn) * Math.PI * 2 + Math.sin(t * .5 + i) * .07;
        const len = 20 + (i % 3) * 9;
        ctx.strokeStyle = i % 2 ? '#1f7a44' : '#2a9c56';
        ctx.lineWidth = o.k ? 5 : 3.4; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.quadraticCurveTo(base.x + Math.cos(a) * len * .5, base.y - len * .75,
                             base.x + Math.cos(a) * len, base.y - len * .5 - 8);
        ctx.stroke();
      }
    },

    cooler(ctx, o) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .5, y + .5, .5, .26);
      ISO.box(ctx, x + .1, y + .1, .8, .8, 40, 0, '#e3e8ee', { top: '#f3f5f8' });
      ISO.cyl(ctx, x + .5, y + .5, .3, 32, 40, 'rgba(120,200,255,.42)');
      ISO.cyl(ctx, x + .5, y + .5, .3, 12, 40, 'rgba(60,160,255,.62)');
    },

    trophy(ctx, o, t) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .6, y + .6, .6, .3);
      ISO.box(ctx, x + .15, y + .15, .9, .9, 34, 0, '#1a1622', { top: '#2a2333' });
      ISO.cyl(ctx, x + .6, y + .6, .1, 12, 34, '#c9a227');
      ISO.cyl(ctx, x + .6, y + .6, .26, 20, 46, ISO.rgba('#c4b8ff', .9));
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const p = S(x + .6, y + .6, 68);
      ISO.glow(ctx, p.x, p.y, 40, '#c4b8ff', .3 + .12 * Math.sin(t * 2));
      ctx.restore();
      ISO.cyl(ctx, x + .6, y + .6, .16, 8, 66, '#ffe98a');
    },

    neonSign(ctx, o, t) {
      const { x, y } = o;
      const neon = o.cor || ISO.hsl((o.hue + t * 30) % 360, 95, 62);
      WORLD.wallFace(ctx, 'n', x, y, 3, 92, (c, len) => {
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = "700 17px 'Barlow', sans-serif";
        c.shadowColor = ISO.rgba(neon, .6); c.shadowBlur = 8;
        c.fillStyle = ISO.rgba(neon, .95); c.letterSpacing = '2px';
        c.fillText(o.txt, len / 2, 16);
        c.shadowBlur = 0; c.letterSpacing = '0px';
        c.strokeStyle = ISO.rgba(neon, .35); c.lineWidth = 1;
        c.beginPath(); c.moveTo(14, 32); c.lineTo(len - 14, 32); c.stroke();
      });
    },

    meetTable(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 3.2, .14);
      ISO.box(ctx, x + w / 2 - .5, y + d / 2 - .4, 1, .8, 24, 0, '#aeb8c6');
      ISO.box(ctx, x, y, w, d, 4, 24, '#c9a77c', { top: '#d8bb94', left: '#c29f73', right: '#a8875e' });
      // passa-cabos com tomada no centro
      ISO.plane(ctx, x + w / 2 - .6, y + d / 2 - .2, 1.2, .4, TOP + .2, '#2b3444');
      ISO.plane(ctx, x + w / 2 - .5, y + d / 2 - .1, .2, .2, TOP + .3, WORLD.BRAND.laranja);
      void t;
      caneca(ctx, x + 1.2, y + d / 2, TOP, 0, .8);
      caneca(ctx, x + w - 1.2, y + d / 2, TOP, 1, .8);
    }
  };

  /* ===========================================================
     PEÇAS REUTILIZADAS
     =========================================================== */

  /** monitor montado em cima da mesa, com pé e braço */
  function monitor(ctx, x, y, w, telaVisivel, busy, neon, t, o) {
    const baseZ = TOP;
    // pé
    ISO.box(ctx, x + w / 2 - .28, y + .02, .56, .3, 3, baseZ, '#12161f', { top: '#1b2130' });
    // haste
    ISO.box(ctx, x + w / 2 - .07, y + .1, .14, .14, 9, baseZ + 3, '#171c28');
    // painel
    const pz = baseZ + 8, ph = 26;
    ISO.box(ctx, x, y, w, .13, ph, pz, '#0b0e17', { top: '#1a2030' });

    faceY(ctx, x + .03, y + .13, w - .06, pz + ph - 2, (c, len) => {
      if (telaVisivel) {
        c.fillStyle = '#04060d'; c.fillRect(0, 0, len, ph - 4);
        if (busy) {
          // linhas de código rolando
          for (let i = 0; i < 6; i++) {
            const ly = 3 + ((i * 3.6 + (t * 9) % 3.6));
            if (ly > ph - 6) continue;
            const lw = (len - 16) * (.25 + .6 * Math.abs(Math.sin(i * 3.7 + Math.floor(t * 2))));
            c.fillStyle = ISO.rgba(i % 3 ? '#8ef0c0' : neon, .62);
            c.fillRect(8, ly, lw, 1.6);
          }
          c.fillStyle = ISO.rgba(neon, .9);
          c.fillRect(8, ph - 8, 3, 1.8);
        } else {
          c.fillStyle = ISO.rgba(neon, .1); c.fillRect(0, 0, len, ph - 4);
          c.textAlign = 'center'; c.textBaseline = 'middle';
          c.font = "700 8px 'Barlow', sans-serif";
          c.fillStyle = ISO.rgba(neon, .5);
          c.fillText('●', len / 2, (ph - 4) / 2);
        }
      } else {
        // costas do monitor: nada de tela acesa
        const g = c.createLinearGradient(0, 0, 0, ph - 4);
        g.addColorStop(0, '#242a38'); g.addColorStop(1, '#161b26');
        c.fillStyle = g; c.fillRect(0, 0, len, ph - 4);
        c.strokeStyle = 'rgba(255,255,255,.05)'; c.lineWidth = 1;
        for (let i = 1; i < 6; i++) {
          c.beginPath(); c.moveTo(i * len / 6, 4); c.lineTo(i * len / 6, ph - 8); c.stroke();
        }
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = "700 7px 'Barlow', sans-serif";
        c.fillStyle = 'rgba(190,200,225,.35)';
        c.fillText('●', len / 2, (ph - 4) / 2);
      }
    });

    // brilho fino na moldura de cima
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ISO.quad(ctx, [S(x, y + .13, pz + ph), S(x + w, y + .13, pz + ph),
                   S(x + w, y + .13, pz + ph - 2), S(x, y + .13, pz + ph - 2)],
             ISO.rgba(neon, telaVisivel ? .6 : .3));
    if (telaVisivel && busy) {
      const gc = S(x + w / 2, y + .3, pz + ph / 2);
      ISO.glow(ctx, gc.x, gc.y, 58, neon, .26);
    }
    ctx.restore();
    void o;
  }

  /** monitor com o painel correndo no eixo Y (mesa de lado) */
  function monitorY(ctx, x, y, alt, telaVisivel, busy, neon, t) {
    const cy = y + alt / 2;
    ISO.box(ctx, x + .02, cy - .28, .3, .56, 3, TOP, '#12161f', { top: '#1b2130' });
    ISO.box(ctx, x + .1,  cy - .07, .14, .14, 9, TOP + 3, '#171c28');

    const pz = TOP + 8, ph = 26;
    // painel fino em X, largo em Y: a tela aponta para -x quando face 'e'
    ISO.box(ctx, x, y, .13, alt, ph, pz, '#0b0e17', { top: '#1a2030' });

    // a face que a câmera enxerga é a +x
    const T = ISO.TW;
    const o = ISO.toScreen(x + .13, y, pz + ph - 2);
    ctx.save();
    ctx.transform(-ISO.HW / T, ISO.HH / T, 0, 1, o.x, o.y);
    const len = alt * T;
    if (telaVisivel) {
      ctx.fillStyle = '#04060d'; ctx.fillRect(-len, 0, len, ph - 4);
      if (busy) {
        for (let i = 0; i < 6; i++) {
          const ly = 3 + ((i * 3.6 + (t * 9) % 3.6));
          if (ly > ph - 6) continue;
          const lw = (len - 16) * (.25 + .6 * Math.abs(Math.sin(i * 3.7 + Math.floor(t * 2))));
          ctx.fillStyle = ISO.rgba(i % 3 ? '#8ef0c0' : neon, .62);
          ctx.fillRect(-len + 8, ly, lw, 1.6);
        }
      } else {
        ctx.fillStyle = ISO.rgba(neon, .1); ctx.fillRect(-len, 0, len, ph - 4);
      }
    } else {
      // costas do monitor: chapa escura com respiros, nada de tela acesa
      const g = ctx.createLinearGradient(0, 0, 0, ph - 4);
      g.addColorStop(0, '#242a38'); g.addColorStop(1, '#161b26');
      ctx.fillStyle = g; ctx.fillRect(-len, 0, len, ph - 4);
      ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(-i * len / 6, 4); ctx.lineTo(-i * len / 6, ph - 8); ctx.stroke();
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = "700 7px 'Barlow', sans-serif";
      ctx.fillStyle = 'rgba(190,200,225,.35)';
      ctx.fillText('●', -len / 2, (ph - 4) / 2);
    }
    ctx.restore();

    // luz da tela vazando pelas bordas — dá para ver que está ligado
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ISO.quad(ctx, [S(x + .13, y, pz + ph), S(x + .13, y + alt, pz + ph),
                   S(x + .13, y + alt, pz + ph - 2), S(x + .13, y, pz + ph - 2)],
             ISO.rgba(neon, busy ? .6 : .3));
    if (busy) {
      const gc = S(x - .1, cy, pz + ph / 2);
      ISO.glow(ctx, gc.x, gc.y, 60, neon, .26);
    }
    ctx.restore();
  }

  /** teclado deitado no eixo Y */
  function tecladoY(ctx, x, y, neon) {
    ISO.plane(ctx, x - .06, y - .08, .56, 2.05, TOP + .05, ISO.rgba(neon, .2));
    ISO.box(ctx, x, y, .36, 1.45, 3, TOP, '#141822', { top: '#232a38' });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ISO.plane(ctx, x + .04, y + .04, .28, 1.37, TOP + 3.2, ISO.rgba(neon, .33));
    ctx.restore();
    ISO.box(ctx, x + .06, y + 1.62, .26, .2, 3.5, TOP, '#1b2130');
  }

  /** teclado e mouse claros, sem RGB */
  function tecladoClaro(ctx, x, y) {
    ISO.box(ctx, x, y, 1.4, .34, 2.4, TOP, '#d8dee6', { top: '#f1f3f6' });
    ISO.plane(ctx, x + .06, y + .06, 1.28, .22, TOP + 2.5, 'rgba(11,42,85,.10)');
    ISO.box(ctx, x + 1.58, y + .06, .18, .24, 2.6, TOP, '#d8dee6', { top: '#f1f3f6' });
  }

  function teclado(ctx, x, y, neon) {
    ISO.plane(ctx, x - .08, y - .06, 2.05, .56, TOP + .05, ISO.rgba(neon, .2));
    ISO.box(ctx, x, y, 1.45, .36, 3, TOP, '#141822', { top: '#232a38' });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ISO.plane(ctx, x + .04, y + .04, 1.37, .28, TOP + 3.2, ISO.rgba(neon, .33));
    ctx.restore();
    ISO.box(ctx, x + 1.62, y + .06, .2, .26, 3.5, TOP, '#1b2130');
  }

  /** gabinete em cima da mesa, com painel de vidro e RGB */
  function gabinete(ctx, x, y, neon, t) {
    ISO.box(ctx, x, y, .42, .78, 30, TOP, '#11141d', { top: '#1d2431' });
    faceY(ctx, x, y + .78, .42, TOP + 30, (c, len) => {
      c.fillStyle = 'rgba(8,11,20,.9)'; c.fillRect(2, 3, len - 4, 24);
      for (let i = 0; i < 3; i++) {
        c.fillStyle = ISO.rgba(ISO.hsl((t * 60 + i * 60) % 360, 92, 58), .55);
        c.fillRect(4, 6 + i * 7, len - 8, 3.4);
      }
    });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = S(x + .21, y + .39, TOP + 15);
    ISO.glow(ctx, g.x, g.y, 30, neon, .22);
    ctx.restore();
  }

  /**
   * Cadeira gamer no estilo da Hawker (Westwing) que o usuário mandou:
   * concha com bolsters laterais, encosto alto com "asas", almofadas de
   * cabeça e lombar, braços acolchoados e base estrela de 5 pontas.
   * Centrada no lugar do boneco; encosto do lado oposto ao que ele encara.
   * Assento com topo em z=15, casando com AVATAR.SEAT.
   */
  /**
   * Cadeira gamer, em DUAS camadas.
   *
   * Quando o boneco está de costas para a câmera ('n' e 'w'), a cadeira fica
   * entre ele e nós: aí tudo do assento para cima é pintado DEPOIS dele, e a
   * cadeira tapa de verdade as pernas e as costas. Antes ela era pintada toda
   * antes do boneco e parecia translúcida.
   * Quando ele está de frente ('s' e 'e'), a cadeira inteira vai atrás.
   */
  function cadeiraBase(ctx, o, cor, accent, altEncosto, gamer) {
    // o boneco é desenhado em AVATAR.SCALE, então o assento precisa subir junto
    const ESC     = AVATAR.SCALE;
    const ASSENTO = AVATAR.SEAT * ESC;  // topo do assento = quadril sentado
    const { x, y, w, d } = o;
    const f      = o.face || 'n';
    const camada = o.camada || 'tras';
    const costasNaFrente = (f === 'n' || f === 'w');

    const corD = ISO.shade(cor, -.24);
    const corL = ISO.shade(cor, .14);
    const trim = gamer ? ISO.shade(cor, .19) : ISO.shade(cor, .14);
    const cx = x + w / 2, cy = y + d / 2;
    const eixoX = (f === 'e' || f === 'w');
    const H = altEncosto * ESC;

    /* fatia paralela ao encosto: a0..a1 ao longo da largura,
       esp = espessura, rec = recuo a partir da borda de trás */
    const seg = (a0, a1, esp, rec) =>
      f === 'n' ? [x + w * a0, y + d - rec - esp, w * (a1 - a0), esp]
    : f === 's' ? [x + w * a0, y + rec,           w * (a1 - a0), esp]
    : f === 'e' ? [x + rec,          y + d * a0,  esp, d * (a1 - a0)]
    :             [x + w - rec - esp, y + d * a0, esp, d * (a1 - a0)];
    const bx = (s, h, z, c, opt) => ISO.box(ctx, s[0], s[1], s[2], s[3], h, z, c, opt);

    /* De costas, a cadeira INTEIRA (inclusive a base) vai na frente dele:
       é ela que esconde as pernas e os pés, como aconteceria de verdade.
       Só a sombra fica atrás. De frente, a cadeira inteira fica atrás.    */
    if (camada === 'tras') {
      ISO.shadow(ctx, cx, cy, .68, .28);
      if (costasNaFrente) return;
    } else if (!costasNaFrente) {
      return;
    }

    /* ---------- base estrela de 5 pontas + rodízios ---------- */
    {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + .35;
        const ex = cx + Math.cos(a) * w * .36, ey = cy + Math.sin(a) * d * .36;
        ISO.box(ctx, (cx + ex) / 2 - .075, (cy + ey) / 2 - .075, .15, .15, 3, 1, '#1b1f29');
        ISO.cyl(ctx, ex, ey, .07, 4, 0, '#39415a');
      }
      ISO.cyl(ctx, cx, cy, .14, 4, 3, '#272d3b');
      ISO.cyl(ctx, cx, cy, .075, ASSENTO - 7, 6, '#8e97ab');   // pistão cromado
    }

    /* ---------- assento tipo concha ---------- */
    ISO.box(ctx, x + .1, y + .1, w - .2, d - .2, 5, ASSENTO - 6, cor, { top: corL });
    if (eixoX) {
      ISO.box(ctx, x + .08, y + .04, w - .16, .15, 4, ASSENTO - 2, corD);
      ISO.box(ctx, x + .08, y + d - .19, w - .16, .15, 4, ASSENTO - 2, corD);
    } else {
      ISO.box(ctx, x + .04, y + .08, .15, d - .16, 4, ASSENTO - 2, corD);
      ISO.box(ctx, x + w - .19, y + .08, .15, d - .16, 4, ASSENTO - 2, corD);
    }
    ISO.plane(ctx, x + .24, y + .24, w - .48, d - .48, ASSENTO + .1, ISO.rgba(accent, .16));

    /* ---------- encosto ---------- */
    const estofado = () => {
      const est = seg(.24, .76, .05, .53);
      ISO.box(ctx, est[0], est[1], est[2], est[3], H * .8, ASSENTO + 3, trim);
    };
    const painel = () => {
      bx(seg(.03, .97, .18, .34), H, ASSENTO, cor, { top: corL });
      bx(seg(-.02, .20, .32, .30), H * .74, ASSENTO, corD);
      bx(seg(.80, 1.02, .32, .30), H * .74, ASSENTO, corD);
      if (costasNaFrente) {
        // costas viradas para a câmera: casca preta, com costura e placa
        bx(seg(.03, .97, .185, .325), H, ASSENTO, '#0a0c12', { top: '#161a24' });
        const cst = seg(.46, .54, .2, .32);
        ISO.box(ctx, cst[0], cst[1], cst[2], cst[3], H * .92, ASSENTO, '#05070b');
        const plc = seg(.34, .66, .205, .318);
        ISO.box(ctx, plc[0], plc[1], plc[2], plc[3], H * .1, ASSENTO + H * .56, '#20252f');
      }
    };
    if (costasNaFrente) { estofado(); painel(); }
    else                { painel();  estofado(); }

    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const tp = seg(.03, .97, .18, .34);
    ISO.plane(ctx, tp[0], tp[1], tp[2], tp[3], ASSENTO + H, ISO.rgba(accent, .34));
    ctx.restore();

    /* ---------- braços ---------- */
    if (gamer) {
      const br = eixoX
        ? [[x + .1, y + .0, w - .2, .14], [x + .1, y + d - .14, w - .2, .14]]
        : [[x + .0, y + .1, .14, d - .2], [x + w - .14, y + .1, .14, d - .2]];
      for (const a of br) {
        ISO.box(ctx, a[0], a[1], a[2], a[3], 6, ASSENTO, '#1d2230');
        ISO.box(ctx, a[0] - .02, a[1] - .02, a[2] + .04, a[3] + .04, 3, ASSENTO + 6, corD, { top: corL });
      }
    }
  }

  function dispenser(ctx, cx, cy, color, t) {
    ISO.cyl(ctx, cx, cy, .22, 8, 46, '#cfd6e8');
    ISO.cyl(ctx, cx, cy, .26, 34, 54, 'rgba(190,215,255,.22)');
    ISO.cyl(ctx, cx, cy, .23, 22 + Math.sin(t * 1.5) * 1.6, 54, ISO.rgba(color, .82));
    ISO.cyl(ctx, cx, cy, .2, 8, 88, '#e5ebf7');
    ISO.cyl(ctx, cx, cy, .1, 9, 96, '#e5ebf7');
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const p = S(cx, cy, 70); ISO.glow(ctx, p.x, p.y, 40, color, .22);
    ctx.restore();
  }

  return { items, workSlots, restSlots, meetSlots, drawItem, depth, caneca, TOP };
})();
