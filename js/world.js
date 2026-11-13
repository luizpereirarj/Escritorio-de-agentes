/* ===========================================================
   world.js — a planta do andar da Squad Pagar & Receber
   Grade 48 x 34, um andar de prédio corporativo:

     fileira de cima (fachada norte, janelas para a cidade)
       Gerentes de Projeto · Tech Leaders · UX Design · Qualidade (QA)
     circulação central com recepção, elevadores e pilares
     fileira de baixo
       Desenvolvimento (open space) · Sala de Reunião · Jogos

   Divisórias internas são de vidro sobre parapeito; as paredes
   externas (norte e oeste) sobem inteiras e têm janelas.
   =========================================================== */
const WORLD = (() => {

  const W = 48, H = 34;

  const VOID = 0, FLOOR = 1, WALL = 2, DOOR = 3;

  /* ---------- marca: azul e laranja ---------- */
  const BRAND = {
    azul:    '#0A4DA2',
    marinho: '#0B2A55',
    claro:   '#3E8EDE',
    laranja: '#FF7A1A',
    pessego: '#FFB27A',
    gelo:    '#F4F6F9'
  };

  /* ---------- paleta da arquitetura ---------- */
  const C = {
    wall:    '#e6eaf0',
    wallTop: '#c4cedb',
    rodape:  '#b9c4d2',
    vidro:   '#a9c8ec',
    caixilho:'#8fa3bd'
  };

  /* ---------- salas ---------- */
  const ROOMS = {
    gp: {
      id: 'gp', name: 'GERENTES DE PROJETO', short: 'Gerentes de Projeto',
      bx: 0, by: 0, bw: 12, bh: 14,
      x1: 1, y1: 1, x2: 10, y2: 12,
      accent: BRAND.azul,
      floorA: '#eef1f5', floorB: '#e8ecf1',
      desc: 'Roadmap do trimestre na parede, quadro de ideias e agenda de entregas. Daqui saem as prioridades da squad.'
    },
    tech: {
      id: 'tech', name: 'TECH LEADERS', short: 'Tech Leaders',
      bx: 11, by: 0, bw: 12, bh: 14,
      x1: 12, y1: 1, x2: 21, y2: 12,
      accent: BRAND.marinho,
      floorA: '#edf0f5', floorB: '#e6eaf0',
      desc: 'Arquitetura dos fluxos de pagamento e recebimento desenhada na parede. Revisão técnica e decisões de desenho.'
    },
    ux: {
      id: 'ux', name: 'UX DESIGN', short: 'UX Design',
      bx: 22, by: 0, bw: 12, bh: 14,
      x1: 23, y1: 1, x2: 32, y2: 12,
      accent: BRAND.laranja,
      floorA: '#f3efe9', floorB: '#ede8e1',
      desc: 'Moodboard, jornada do pagador e protótipos. Mesas com mesa digitalizadora.'
    },
    qa: {
      id: 'qa', name: 'QUALIDADE · QA', short: 'Qualidade (QA)',
      bx: 33, by: 0, bw: 15, bh: 14,
      x1: 34, y1: 1, x2: 46, y2: 12,
      accent: BRAND.claro,
      floorA: '#edf1f4', floorB: '#e7ecf0',
      desc: 'Pipeline de testes no painel, celulares de teste em cada mesa. Nada sobe sem passar por aqui.'
    },
    dev: {
      id: 'dev', name: 'DESENVOLVIMENTO', short: 'Desenvolvimento',
      bx: 0, by: 18, bw: 26, bh: 16,
      x1: 1, y1: 19, x2: 24, y2: 32,
      accent: BRAND.azul,
      floorA: '#eef1f5', floorB: '#e8ecf1',
      desc: 'Open space com 12 estações. Back-end, front-end e mobile dos fluxos de Pix, boleto e cartão.'
    },
    reuniao: {
      id: 'reuniao', name: 'SALA DE REUNIÃO', short: 'Reunião',
      bx: 25, by: 18, bw: 12, bh: 16,
      x1: 26, y1: 19, x2: 35, y2: 32,
      accent: BRAND.laranja,
      floorA: '#e9e1d5', floorB: '#e3dacd',
      desc: 'Mesa para oito, tela de apresentação. Dailies, refinamentos e a reunião dos agentes.'
    },
    lounge: {
      id: 'lounge', name: 'JOGOS', short: 'Jogos',
      bx: 36, by: 18, bw: 12, bh: 16,
      x1: 37, y1: 19, x2: 46, y2: 32,
      accent: BRAND.laranja,
      floorA: '#f2e9de', floorB: '#ece2d6',
      desc: 'Fliperama, sinuca, pebolim, puffs e café. Pausa de verdade, longe das mesas.'
    },
    corredor: {
      id: 'corredor', name: 'RECEPÇÃO & CIRCULAÇÃO', short: 'Recepção',
      accent: '#7d8aa0',
      floorA: '#e2e6eb', floorB: '#dde2e8',
      desc: 'Elevadores, recepção da squad e a circulação entre as salas.'
    }
  };

  /** salas de trabalho, na ordem em que aparecem no painel */
  const WORK_ROOMS = ['gp', 'tech', 'ux', 'qa', 'dev'];

  /* ---------- portas (x, y, orientação, placa) ---------- */
  const DOORS = [
    { x: 5,  y: 13, o: 'h' }, { x: 6,  y: 13, o: 'h', placa: 'gp'   },
    { x: 16, y: 13, o: 'h' }, { x: 17, y: 13, o: 'h', placa: 'tech' },
    { x: 27, y: 13, o: 'h' }, { x: 28, y: 13, o: 'h', placa: 'ux'   },
    { x: 39, y: 13, o: 'h' }, { x: 40, y: 13, o: 'h', placa: 'qa'   },
    { x: 12, y: 18, o: 'h' }, { x: 13, y: 18, o: 'h' },     // desenvolvimento
    { x: 26, y: 18, o: 'h' }, { x: 27, y: 18, o: 'h' },     // reunião
    { x: 41, y: 18, o: 'h' }, { x: 42, y: 18, o: 'h' }      // jogos
  ];

  /* ---------- grade ---------- */
  const kind   = new Uint8Array(W * H);
  const roomOf = new Array(W * H).fill(null);
  const blocked = new Uint8Array(W * H);   // móveis ocupando o tile

  const idx = (x, y) => y * W + x;
  const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H;

  function buildGrid() {
    kind.fill(FLOOR);
    for (let i = 0; i < W * H; i++) roomOf[i] = 'corredor';

    // fachada
    for (let x = 0; x < W; x++) { kind[idx(x, 0)] = WALL; kind[idx(x, H - 1)] = WALL; }
    for (let y = 0; y < H; y++) { kind[idx(0, y)] = WALL; kind[idx(W - 1, y)] = WALL; }

    for (const r of Object.values(ROOMS)) {
      if (r.bw === undefined) continue;
      const x0 = r.bx, y0 = r.by, x1 = r.bx + r.bw - 1, y1 = r.by + r.bh - 1;
      for (let x = x0; x <= x1; x++) {
        for (let y = y0; y <= y1; y++) {
          if (!inside(x, y)) continue;
          const borda = (x === x0 || x === x1 || y === y0 || y === y1);
          // parede compartilhada fica com a primeira sala que a desenhou
          if (borda) { kind[idx(x, y)] = WALL; if (roomOf[idx(x, y)] === 'corredor') roomOf[idx(x, y)] = r.id; }
          else       { kind[idx(x, y)] = FLOOR; roomOf[idx(x, y)] = r.id; }
        }
      }
    }

    for (const d of DOORS) if (inside(d.x, d.y)) kind[idx(d.x, d.y)] = DOOR;
  }
  buildGrid();

  const kindAt  = (x, y) => inside(x, y) ? kind[idx(x, y)] : VOID;
  const roomAt  = (x, y) => inside(x, y) ? roomOf[idx(x, y)] : null;
  const isWall  = (x, y) => kindAt(x, y) === WALL;

  /** o tile dá para pisar? (usado pelo A*) */
  function walkable(x, y) {
    if (!inside(x, y)) return false;
    const k = kind[idx(x, y)];
    return (k === FLOOR || k === DOOR) && !blocked[idx(x, y)];
  }
  function setBlocked(x, y, v = 1) {
    if (inside(x, y)) blocked[idx(x, y)] = v;
  }

  /* ---------- alturas de parede ----------
     Parede com chão ATRÁS dela (em x-1 ou y-1) taparia a visão: vira
     divisória de vidro sobre parapeito. As da fachada sobem inteiras. */
  const WALL_H = 108, PARAPET = 40;

  function wallOccludes(x, y) {
    const a = kindAt(x - 1, y), b = kindAt(x, y - 1);
    return a === FLOOR || a === DOOR || b === FLOOR || b === DOOR;
  }

  /* ---------- o que vai pendurado nas paredes da fachada ---------- */
  const SIGNS = [
    // fachada norte
    { o: 'n', x: 1,  y: 0, len: 3, kind: 'janela'      },
    { o: 'n', x: 4,  y: 0, len: 6, kind: 'roadmap'     },
    { o: 'n', x: 12, y: 0, len: 6, kind: 'arquitetura' },
    { o: 'n', x: 18, y: 0, len: 3, kind: 'janela'      },
    { o: 'n', x: 23, y: 0, len: 5, kind: 'moodboard'   },
    { o: 'n', x: 28, y: 0, len: 4, kind: 'janela'      },
    { o: 'n', x: 34, y: 0, len: 6, kind: 'pipeline'    },
    { o: 'n', x: 40, y: 0, len: 6, kind: 'janela'      },
    // fachada oeste
    { o: 'w', x: 0, y: 1,  len: 5, kind: 'quadro'  },
    { o: 'w', x: 0, y: 7,  len: 5, kind: 'eventos' },
    { o: 'w', x: 0, y: 14, len: 4, kind: 'marca'   },
    { o: 'w', x: 0, y: 19, len: 4, kind: 'janela'  },
    { o: 'w', x: 0, y: 23, len: 6, kind: 'equipe'  },
    { o: 'w', x: 0, y: 29, len: 4, kind: 'janela'  }
  ];

  /* ===========================================================
     DESENHO
     =========================================================== */

  /** superfície de parede em espaço "u (px ao longo) × v (px para baixo)" */
  function wallFace(ctx, orient, x, y, lenTiles, topZ, fn) {
    const T = ISO.TW;
    let o, a, b;
    if (orient === 'n') {                       // face virada para +y
      o = ISO.toScreen(x, y + 1, topZ);
      a =  ISO.HW / T; b =  ISO.HH / T;
    } else {                                    // 'w' — face virada para +x
      o = ISO.toScreen(x + 1, y + lenTiles, topZ);
      a =  ISO.HW / T; b = -ISO.HH / T;
    }
    ctx.save();
    ctx.transform(a, b, 0, 1, o.x, o.y);
    fn(ctx, lenTiles * T);
    ctx.restore();
  }

  /* ---- logo da squad: duas setas, uma que paga e uma que recebe ---- */
  function logo(c, x, y, s) {
    const g = c.createLinearGradient(x, y, x + s, y + s);
    g.addColorStop(0, BRAND.azul); g.addColorStop(1, BRAND.marinho);
    c.fillStyle = g;
    ISO.rrect(c, x, y, s, s, s * .24); c.fill();
    const u = s / 10;
    // seta que sai (pagar), branca, para a direita
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(x + 2.2 * u, y + 3.0 * u); c.lineTo(x + 6.0 * u, y + 3.0 * u);
    c.lineTo(x + 6.0 * u, y + 1.9 * u); c.lineTo(x + 8.2 * u, y + 3.7 * u);
    c.lineTo(x + 6.0 * u, y + 5.5 * u); c.lineTo(x + 6.0 * u, y + 4.4 * u);
    c.lineTo(x + 2.2 * u, y + 4.4 * u); c.closePath(); c.fill();
    // seta que entra (receber), laranja, para a esquerda
    c.fillStyle = BRAND.laranja;
    c.beginPath();
    c.moveTo(x + 7.8 * u, y + 5.6 * u); c.lineTo(x + 4.0 * u, y + 5.6 * u);
    c.lineTo(x + 4.0 * u, y + 4.5 * u); c.lineTo(x + 1.8 * u, y + 6.3 * u);
    c.lineTo(x + 4.0 * u, y + 8.1 * u); c.lineTo(x + 4.0 * u, y + 7.0 * u);
    c.lineTo(x + 7.8 * u, y + 7.0 * u); c.closePath(); c.fill();
  }

  /* ---- chão + laje do prédio ----
     Pintado uma vez num canvas próprio e depois só copiado.          */
  const LAJE = 26;
  let pisoCache = null;
  function montaPiso() {
    const x0 = ISO.toScreen(0, H).x - ISO.TW;
    const x1 = ISO.toScreen(W, 0).x + ISO.TW;
    const y0 = ISO.toScreen(0, 0).y - 4;
    const y1 = ISO.toScreen(W, H).y + LAJE + 8;
    const cv = document.createElement('canvas');
    cv.width  = Math.ceil(x1 - x0);
    cv.height = Math.ceil(y1 - y0);
    const c = cv.getContext('2d');
    c.translate(-x0, -y0);

    // laje de concreto: o andar flutua como o corte de um prédio
    ISO.box(c, 0, 0, W, H, LAJE, -LAJE, '#c9d1dc',
            { left: '#b6c0cd', right: '#9eaabb', top: '#d5dbe3', line: 'rgba(11,42,85,.12)' });
    // faixa laranja na borda da laje (a marca, discreta)
    ISO.quad(c, [ISO.toScreen(0, H, -3), ISO.toScreen(W, H, -3),
                 ISO.toScreen(W, H, -7), ISO.toScreen(0, H, -7)], BRAND.laranja);
    ISO.quad(c, [ISO.toScreen(W, 0, -3), ISO.toScreen(W, H, -3),
                 ISO.toScreen(W, H, -7), ISO.toScreen(W, 0, -7)], ISO.shade(BRAND.laranja, -.18));

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const k = kind[idx(x, y)];
        if (k !== FLOOR && k !== DOOR) continue;
        const r = ROOMS[roomOf[idx(x, y)]] || ROOMS.corredor;
        let col = ((x + y) & 1) ? r.floorA : r.floorB;
        if (k === DOOR) col = ISO.shade(r.accent, .82);
        ISO.tile(c, x, y, col, 'rgba(11,42,85,.045)');
      }
    }
    // linha de orientação no piso da circulação (laranja, fina)
    ISO.plane(c, 1.2, 15.45, 44.6, .1, 0.4, ISO.rgba(BRAND.laranja, .55));
    ISO.plane(c, 1.2, 15.65, 44.6, .04, 0.4, ISO.rgba(BRAND.azul, .35));
    pisoCache = { cv, x: x0, y: y0 };
  }

  function drawFloor(ctx, t) {
    if (!pisoCache) montaPiso();
    ctx.drawImage(pisoCache.cv, pisoCache.x, pisoCache.y);

    // luz do sol entrando pelas janelas, só de dia
    const h = new Date().getHours();
    if (h >= 7 && h < 18) {
      ctx.save();
      for (const s of SIGNS) {
        if (s.kind !== 'janela') continue;
        if (s.o === 'n') ISO.plane(ctx, s.x + .2, 1, s.len - .4, 2.2, 0.5, 'rgba(255,236,200,.22)');
        else             ISO.plane(ctx, 1, s.y + .2, 2.2, s.len - .4, 0.5, 'rgba(255,236,200,.22)');
      }
      ctx.restore();
    }
    void t;
  }

  /* ---- rótulo de cada sala, pintado no piso ---- */
  function drawRoomLabels(ctx) {
    const put = (r, cx, cy) => {
      const p = ISO.toScreen(cx, cy, 0);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Barlow Semi Condensed, sans-serif';
      ctx.fillStyle = ISO.rgba(r.accent, .42);
      ctx.letterSpacing = '4px';
      ctx.fillText(r.name, p.x, p.y);
      ctx.restore();
    };
    put(ROOMS.gp, 6, 12.2);
    put(ROOMS.tech, 17, 12.2);
    put(ROOMS.ux, 28, 12.2);
    put(ROOMS.qa, 40.5, 12.2);
    put(ROOMS.dev, 13, 32.3);
    put(ROOMS.reuniao, 31, 32.3);
    put(ROOMS.lounge, 42, 32.3);
  }

  const cacheGrad = new Map();

  /* ---- uma parede ---- */
  function drawWallTile(ctx, x, y, t, rgbOn, zoom) {
    const detalhe = (zoom === undefined || zoom > 0.55);
    const occ  = wallOccludes(x, y);
    const room = ROOMS[roomOf[idx(x, y)]] || ROOMS.corredor;
    const h    = occ ? PARAPET : WALL_H;

    const showLeft  = !isWall(x, y + 1);   // face virada para +y
    const showRight = !isWall(x + 1, y);   // face virada para +x
    if (!showLeft && !showRight) {
      ISO.plane(ctx, x, y, 1, 1, h, C.wallTop);
      if (occ) ISO.plane(ctx, x, y, 1, 1, WALL_H, ISO.rgba(C.caixilho, .45));
      return;
    }

    const P = ISO.toScreen;
    const base = C.wall;

    const faces = [];
    if (showLeft)  faces.push({ o: 'n', pts: [P(x, y+1, h), P(x+1, y+1, h), P(x+1, y+1, 0), P(x, y+1, 0)], sh: -0.02 });
    if (showRight) faces.push({ o: 'w', pts: [P(x+1, y, h), P(x+1, y+1, h), P(x+1, y+1, 0), P(x+1, y, 0)], sh: -0.14 });

    for (const f of faces) {
      const ck = x + ',' + y + ',' + f.o;
      let g = cacheGrad.get(ck);
      if (!g) {
        g = ctx.createLinearGradient(0, f.pts[0].y, 0, f.pts[2].y);
        g.addColorStop(0, ISO.shade(base, f.sh + 0.35));
        g.addColorStop(1, ISO.shade(base, f.sh - 0.06));
        cacheGrad.set(ck, g);
      }
      ISO.quad(ctx, f.pts, g);

      // rodapé
      ISO.quad(ctx, [f.pts[3], f.pts[2],
                     { x: f.pts[2].x, y: f.pts[2].y - 5 },
                     { x: f.pts[3].x, y: f.pts[3].y - 5 }], C.rodape);

      // fita de LED de destaque (opcional), na cor da marca
      if (rgbOn) {
        const a = .35 + .25 * Math.sin(t * 1.4 + (x + y) * .3);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ISO.quad(ctx, [f.pts[0], f.pts[1],
                       { x: f.pts[1].x, y: f.pts[1].y + 3 },
                       { x: f.pts[0].x, y: f.pts[0].y + 3 }], ISO.rgba(BRAND.laranja, a));
        ctx.restore();
      }
    }

    // topo
    ISO.plane(ctx, x, y, 1, 1, h, occ ? '#f6f8fb' : C.wallTop);

    if (occ && detalhe) {
      // vidro acima do parapeito, com faixa jateada de privacidade
      for (const f of faces) {
        const ax = f.o === 'n' ? x : x + 1, ay = f.o === 'n' ? y + 1 : y;
        const quadAt = (z0, z1) => [P(ax, ay, z1), P(x + 1, y + 1, z1), P(x + 1, y + 1, z0), P(ax, ay, z0)];
        ISO.quad(ctx, quadAt(h, WALL_H), ISO.rgba(C.vidro, .2));
        ISO.quad(ctx, quadAt(62, 72), 'rgba(255,255,255,.42)');
        ISO.quad(ctx, quadAt(h, WALL_H), null, ISO.rgba(C.caixilho, .28));
      }
      // caixilho de alumínio no topo
      ISO.plane(ctx, x, y, 1, 1, WALL_H, ISO.rgba(C.caixilho, .55));
    } else if (occ) {
      ISO.plane(ctx, x, y, 1, 1, WALL_H, ISO.rgba(C.caixilho, .4));
    }

    void room;
    drawSignTile(ctx, x, y, t, rgbOn);
  }

  /**
   * Fatia da placa que pertence a este tile de parede: cada pedaço é
   * pintado junto com a sua própria parede, para não "entrar" nela.
   */
  function drawSignTile(ctx, x, y, t, rgbOn) {
    for (const s of SIGNS) {
      const cobre = s.o === 'n'
        ? (s.y === y && x >= s.x && x < s.x + s.len)
        : (s.x === x && y >= s.y && y < s.y + s.len);
      if (!cobre) continue;
      const T = ISO.TW;
      const off = s.o === 'n' ? (x - s.x) * T
                              : (s.y + s.len - 1 - y) * T;
      const cv = placaCanvas(s, t, rgbOn);
      wallFace(ctx, s.o, x, y, 1, WALL_H, (c) =>
        c.drawImage(cv, off, 0, T, WALL_H, 0, 0, T, WALL_H));
    }
  }

  /* ---- porta: batente de alumínio, bandeira de vidro e placa da sala ---- */
  function drawDoorTile(ctx, x, y, t) {
    const d = DOORS.find(d => d.x === x && d.y === y);
    if (!d) return;
    const P = ISO.toScreen;
    const h = 92;
    // bandeira de vidro acima da porta
    ISO.quad(ctx, [P(x, y+1, WALL_H), P(x+1, y+1, WALL_H), P(x+1, y+1, h), P(x, y+1, h)], ISO.rgba(C.vidro, .22));
    // verga
    ISO.quad(ctx, [P(x, y+1, h + 3), P(x+1, y+1, h + 3), P(x+1, y+1, h), P(x, y+1, h)], C.caixilho);
    ISO.plane(ctx, x, y, 1, 1, WALL_H, ISO.rgba(C.caixilho, .55));
    // batentes
    const vizE = DOORS.some(o => o.x === x - 1 && o.y === y);
    const vizD = DOORS.some(o => o.x === x + 1 && o.y === y);
    if (!vizE) ISO.quad(ctx, [P(x, y+1, h), P(x + .05, y+1, h), P(x + .05, y+1, 0), P(x, y+1, 0)], C.caixilho);
    if (!vizD) ISO.quad(ctx, [P(x + .95, y+1, h), P(x+1, y+1, h), P(x+1, y+1, 0), P(x + .95, y+1, 0)], C.caixilho);

    // placa com o nome da sala, centrada sobre as duas folhas; vai na
    // segunda folha, que é pintada por último e não fica sob o vidro
    if (d.placa) {
      const r = ROOMS[d.placa];
      wallFace(ctx, 'n', x - 1, y, 2, h + 18, (c, len) => {
        c.fillStyle = BRAND.marinho;
        ISO.rrect(c, 6, 0, len - 12, 15, 3); c.fill();
        c.fillStyle = r.accent === BRAND.marinho ? BRAND.laranja : r.accent;
        c.fillRect(6, 0, 4, 15);
        c.font = "700 8.5px 'Barlow Semi Condensed', sans-serif";
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillStyle = '#ffffff'; c.letterSpacing = '1px';
        c.fillText(r.short.toUpperCase(), len / 2 + 2, 8);
      });
    }
    void t;
  }

  function signDepth(s) {
    return s.o === 'n' ? (s.x + s.len / 2) + (s.y + 1)
                       : (s.x + 1) + (s.y + s.len / 2);
  }

  /* ---- conteúdo de uma placa, em espaço plano de parede ---- */
  function pintaPlaca(c, s, len, t, rgbOn) {
    switch (s.kind) {
      case 'janela':      return signJanela(c, s, len);
      case 'marca':       return signMarca(c, len);
      case 'roadmap':     return signRoadmap(c, len);
      case 'arquitetura': return signArquitetura(c, len);
      case 'moodboard':   return signMoodboard(c, len);
      case 'pipeline':    return signPipeline(c, len, t);
      case 'equipe':      return signEquipe(c, len, t);
      case 'eventos':     return signEventos(c, len);
      case 'quadro':      return signQuadro(c, len);
    }
    void rgbOn;
  }

  const cachePlaca = new Map();
  function placaCanvas(s, t, rgbOn) {
    let c = cachePlaca.get(s);
    if (!c) {
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(s.len * ISO.TW); cv.height = WALL_H;
      c = { cv, ctx: cv.getContext('2d'), t: -1e9, rgb: null };
      cachePlaca.set(s, c);
    }
    // janela, marca e quadros quase não mudam: repinta devagar
    const parada = (s.kind === 'janela' || s.kind === 'marca' || s.kind === 'arquitetura' ||
                    s.kind === 'moodboard' || s.kind === 'roadmap');
    const passo = parada ? 30 : 0.25;
    if (t - c.t > passo || c.t > t || c.rgb !== rgbOn) {
      c.t = t; c.rgb = rgbOn;
      c.ctx.clearRect(0, 0, c.cv.width, c.cv.height);
      pintaPlaca(c.ctx, s, c.cv.width, t, rgbOn);
    }
    return c.cv;
  }

  function drawSigns(ctx, t, rgbOn, lista) {
    for (const s of (lista || SIGNS)) {
      const cv = placaCanvas(s, t, rgbOn);
      wallFace(ctx, s.o, s.x, s.y, s.len, WALL_H, (c) => c.drawImage(cv, 0, 0));
    }
  }

  /* ---------- utilitários de placa ---------- */
  const FT = (peso, tam, fam) => `${peso} ${tam}px '${fam || 'Barlow Semi Condensed'}', sans-serif`;

  function painelBranco(c, x0, y0, w, h) {
    c.fillStyle = 'rgba(11,42,85,.10)';
    ISO.rrect(c, x0 + 2, y0 + 3, w, h, 5); c.fill();
    c.fillStyle = '#ffffff';
    ISO.rrect(c, x0, y0, w, h, 5); c.fill();
    c.strokeStyle = '#d3dae4'; c.lineWidth = 1; c.stroke();
  }
  function tituloPlaca(c, x, y, txt, cor) {
    c.textBaseline = 'middle'; c.textAlign = 'left';
    c.font = FT(700, 10); c.letterSpacing = '2px';
    c.fillStyle = cor || BRAND.marinho;
    c.fillText(txt, x, y);
    c.letterSpacing = '0px';
  }

  /* ---------- janela com vista da cidade (muda com a hora) ---------- */
  function ceuAgora() {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    if (h >= 7 && h < 16.5)  return { top: '#7fb6ea', bot: '#d6e9fa', noite: false, pred: '#9fb3c9', pred2: '#b7c7d8' };
    if (h >= 16.5 && h < 19) return { top: '#3c5f9e', bot: '#ffb27a', noite: false, pred: '#4a5a78', pred2: '#6a7792' };
    if (h >= 5.5 && h < 7)   return { top: '#5a7bb5', bot: '#ffd3a8', noite: false, pred: '#56688a', pred2: '#7383a0' };
    return { top: '#08152e', bot: '#1b3460', noite: true, pred: '#0f1d38', pred2: '#16284a' };
  }
  function signJanela(c, s, len) {
    const ceu = ceuAgora();
    const x0 = 6, y0 = 10, w = len - 12, h = 86;
    // caixilho
    c.fillStyle = '#9aaac0';
    c.fillRect(x0 - 3, y0 - 3, w + 6, h + 6);
    // céu
    const g = c.createLinearGradient(0, y0, 0, y0 + h);
    g.addColorStop(0, ceu.top); g.addColorStop(1, ceu.bot);
    c.fillStyle = g; c.fillRect(x0, y0, w, h);
    // skyline, igual para a mesma janela sempre
    let seed = s.x * 31 + s.y * 17 + 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let camada = 0; camada < 2; camada++) {
      let bx = x0 - 6;
      while (bx < x0 + w) {
        const bw = 12 + rnd() * 22;
        const bh = (camada ? 26 : 40) + rnd() * (camada ? 30 : 34);
        const cor = camada ? ceu.pred : ceu.pred2;
        c.fillStyle = cor;
        c.fillRect(bx, y0 + h - bh, bw - 2, bh);
        if (camada) {
          // janelinhas dos prédios
          for (let jy = y0 + h - bh + 4; jy < y0 + h - 4; jy += 6)
            for (let jx = bx + 3; jx < bx + bw - 5; jx += 5)
              if (rnd() < (ceu.noite ? .45 : .25)) {
                c.fillStyle = ceu.noite ? 'rgba(255,214,140,.85)' : 'rgba(255,255,255,.35)';
                c.fillRect(jx, jy, 2, 2.5);
              }
        }
        bx += bw;
      }
    }
    if (ceu.noite) {
      for (let i = 0; i < 6; i++) {
        c.fillStyle = 'rgba(255,255,255,.7)';
        c.fillRect(x0 + rnd() * w, y0 + rnd() * h * .35, 1.2, 1.2);
      }
    }
    // reflexo no vidro
    c.fillStyle = 'rgba(255,255,255,.16)';
    c.beginPath();
    c.moveTo(x0 + w * .15, y0); c.lineTo(x0 + w * .38, y0);
    c.lineTo(x0 + w * .12, y0 + h); c.lineTo(x0 - w * .1, y0 + h); c.closePath(); c.fill();
    // montantes a cada tile e travessa
    c.fillStyle = '#9aaac0';
    for (let u = ISO.TW; u < len - 4; u += ISO.TW) c.fillRect(u - 2, y0, 4, h);
    c.fillRect(x0, y0 + h * .62, w, 3);
    // peitoril
    c.fillStyle = '#ffffff';
    c.fillRect(x0 - 5, y0 + h + 2, w + 10, 4);
  }

  /* ---------- a marca da squad, na parede da recepção ---------- */
  function signMarca(c, len) {
    const x0 = 6, y0 = 14, w = len - 12, h = 78;
    c.fillStyle = BRAND.marinho;
    ISO.rrect(c, x0, y0, w, h, 6); c.fill();
    // filete laranja embaixo
    c.fillStyle = BRAND.laranja;
    c.fillRect(x0, y0 + h - 5, w, 5);
    logo(c, x0 + 14, y0 + 14, 44);
    c.textAlign = 'left'; c.textBaseline = 'middle';
    c.font = FT(600, 9); c.letterSpacing = '3px';
    c.fillStyle = BRAND.pessego;
    c.fillText('SQUAD', x0 + 70, y0 + 22);
    c.letterSpacing = '0px';
    const E = window.ESCRITORIO || {};
    const nome = String(E.nome || 'Squad Pagar & Receber').replace(/^squad\s+/i, '').toUpperCase();
    let tam = 19;
    c.font = FT(700, tam, 'Barlow');
    while (tam > 10 && c.measureText(nome).width > w - 82) { tam--; c.font = FT(700, tam, 'Barlow'); }
    c.fillStyle = '#ffffff';
    c.fillText(nome, x0 + 70, y0 + 40);
    c.font = FT(500, 8.5); c.letterSpacing = '1.5px';
    c.fillStyle = 'rgba(214,226,245,.75)';
    c.fillText(String(E.subtitulo || 'Tecnologia · Meios de Pagamento').toUpperCase().slice(0, 34), x0 + 70, y0 + 57);
    c.letterSpacing = '0px';
  }

  /* ---------- GP: roadmap do trimestre ---------- */
  function signRoadmap(c, len) {
    const x0 = 8, y0 = 12, w = len - 16, h = 84;
    painelBranco(c, x0, y0, w, h);
    tituloPlaca(c, x0 + 12, y0 + 12, 'ROADMAP · TRIMESTRE');
    const meses = ['MÊS 1', 'MÊS 2', 'MÊS 3'];
    const gx = x0 + 104, gw = w - 116;
    c.font = FT(600, 7.5); c.fillStyle = '#8a97ab';
    meses.forEach((m, i) => { c.textAlign = 'center'; c.fillText(m, gx + gw * (i + .5) / 3, y0 + 12); });
    c.strokeStyle = '#e3e8ef'; c.lineWidth = 1;
    for (let i = 1; i < 3; i++) { c.beginPath(); c.moveTo(gx + gw * i / 3, y0 + 20); c.lineTo(gx + gw * i / 3, y0 + h - 6); c.stroke(); }
    const itens = [
      ['Pix Automático',      .00, .55, BRAND.azul],
      ['Boleto + QR Code',    .20, .70, BRAND.laranja],
      ['Conciliação D+0',     .45, .95, BRAND.claro],
      ['Agenda de pagamentos',.60, 1.0, BRAND.marinho],
      ['Antifraude no fluxo', .10, .40, BRAND.pessego]
    ];
    itens.forEach((it, i) => {
      const ry = y0 + 28 + i * 11.5;
      c.textAlign = 'left'; c.font = FT(600, 8.5); c.fillStyle = BRAND.marinho;
      c.fillText(it[0], x0 + 12, ry);
      c.fillStyle = it[3];
      ISO.rrect(c, gx + gw * it[1], ry - 3.5, gw * (it[2] - it[1]), 7, 3.5); c.fill();
    });
  }

  /* ---------- Tech Leaders: arquitetura dos fluxos ---------- */
  function signArquitetura(c, len) {
    const x0 = 8, y0 = 10, w = len - 16, h = 88;
    // quadro branco com moldura de alumínio
    c.fillStyle = '#aab6c6'; ISO.rrect(c, x0 - 3, y0 - 3, w + 6, h + 6, 4); c.fill();
    c.fillStyle = '#fbfcfd'; ISO.rrect(c, x0, y0, w, h, 3); c.fill();
    tituloPlaca(c, x0 + 10, y0 + 11, 'ARQUITETURA · PAGAR & RECEBER');
    const caixa = (bx, by, bw, txt, cor) => {
      c.strokeStyle = cor; c.lineWidth = 1.6;
      ISO.rrect(c, bx, by, bw, 16, 3); c.stroke();
      c.fillStyle = ISO.rgba(cor, .08); c.fill();
      c.fillStyle = cor; c.font = FT(700, 8); c.textAlign = 'center';
      c.fillText(txt, bx + bw / 2, by + 8.5);
    };
    const seta = (ax, ay, bx, by, cor) => {
      c.strokeStyle = cor; c.lineWidth = 1.3;
      c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
      const a = Math.atan2(by - ay, bx - ax);
      c.beginPath(); c.moveTo(bx, by);
      c.lineTo(bx - 5 * Math.cos(a - .45), by - 5 * Math.sin(a - .45));
      c.lineTo(bx - 5 * Math.cos(a + .45), by - 5 * Math.sin(a + .45));
      c.closePath(); c.fillStyle = cor; c.fill();
    };
    const col = w / 4;
    caixa(x0 + 8, y0 + 46, col - 14, 'API GATEWAY', BRAND.marinho);
    caixa(x0 + col + 6, y0 + 26, col - 6, 'PAGAMENTOS', BRAND.azul);
    caixa(x0 + col + 6, y0 + 64, col - 6, 'RECEBIMENTOS', BRAND.laranja);
    caixa(x0 + col * 2 + 12, y0 + 46, col - 14, 'LEDGER', BRAND.marinho);
    caixa(x0 + col * 3 + 6, y0 + 26, col - 14, 'PIX / SPI', BRAND.claro);
    caixa(x0 + col * 3 + 6, y0 + 64, col - 14, 'BOLETO / CIP', BRAND.claro);
    seta(x0 + col - 6, y0 + 52, x0 + col + 6, y0 + 36, BRAND.marinho);
    seta(x0 + col - 6, y0 + 56, x0 + col + 6, y0 + 70, BRAND.marinho);
    seta(x0 + col * 2, y0 + 34, x0 + col * 2 + 12, y0 + 50, BRAND.azul);
    seta(x0 + col * 2, y0 + 72, x0 + col * 2 + 12, y0 + 58, BRAND.laranja);
    seta(x0 + col * 3 - 2, y0 + 52, x0 + col * 3 + 6, y0 + 36, BRAND.marinho);
    seta(x0 + col * 3 - 2, y0 + 56, x0 + col * 3 + 6, y0 + 70, BRAND.marinho);
    // canetas
    [BRAND.azul, BRAND.laranja, BRAND.marinho].forEach((cor, i) => {
      c.fillStyle = cor; ISO.rrect(c, x0 + w - 50 + i * 14, y0 + h - 6, 11, 3.5, 1.5); c.fill();
    });
  }

  /* ---------- UX: moodboard ---------- */
  function signMoodboard(c, len) {
    const x0 = 8, y0 = 10, w = len - 16, h = 88;
    c.fillStyle = '#d9c7ae'; ISO.rrect(c, x0, y0, w, h, 4); c.fill();       // cortiça
    c.fillStyle = 'rgba(0,0,0,.05)';
    for (let i = 0; i < 40; i++) c.fillRect(x0 + (i * 37) % w, y0 + (i * 23) % h, 2, 2);
    const papel = (px, py, pw, ph, rot, fn) => {
      c.save(); c.translate(px + pw / 2, py + ph / 2); c.rotate(rot);
      c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-pw / 2 + 2, -ph / 2 + 2, pw, ph);
      fn(-pw / 2, -ph / 2, pw, ph);
      c.fillStyle = BRAND.laranja; c.beginPath(); c.arc(0, -ph / 2 + 3, 2.4, 0, 7); c.fill();
      c.restore();
    };
    // paleta de cores
    papel(x0 + 10, y0 + 10, 70, 40, -.04, (x, y, pw, ph) => {
      c.fillStyle = '#fff'; c.fillRect(x, y, pw, ph);
      [BRAND.azul, BRAND.marinho, BRAND.laranja, BRAND.pessego].forEach((cor, i) => {
        c.fillStyle = cor; c.fillRect(x + 5 + i * 15.5, y + 9, 13, 18);
      });
      c.fillStyle = '#7d8aa0'; c.font = FT(600, 6.5); c.textAlign = 'left';
      c.fillText('PALETA', x + 5, y + 34);
    });
    // wireframe de celular
    papel(x0 + 92, y0 + 8, 40, 72, .05, (x, y, pw, ph) => {
      c.fillStyle = '#fff'; c.fillRect(x, y, pw, ph);
      c.strokeStyle = '#3d4a60'; c.lineWidth = 1.2; ISO.rrect(c, x + 5, y + 6, pw - 10, ph - 12, 5); c.stroke();
      c.fillStyle = BRAND.azul; c.fillRect(x + 9, y + 14, pw - 18, 8);
      c.fillStyle = '#d3dae4'; for (let i = 0; i < 4; i++) c.fillRect(x + 9, y + 28 + i * 7, pw - 18 - (i % 2) * 8, 3);
      c.fillStyle = BRAND.laranja; ISO.rrect(c, x + 9, y + ph - 22, pw - 18, 7, 3); c.fill();
    });
    // post-its da jornada
    const notas = [['jornada', '#ffe58a'], ['pagador', '#ffd0a6'], ['1 toque', '#bfe0ff'], ['acessível', '#ffe58a']];
    notas.forEach((n, i) => {
      papel(x0 + 146 + (i % 2) * 74, y0 + 12 + Math.floor(i / 2) * 38, 64, 30, (i % 2 ? .06 : -.05), (x, y, pw, ph) => {
        c.fillStyle = n[1]; c.fillRect(x, y, pw, ph);
        c.fillStyle = '#4a3d1c'; c.font = FT(600, 8.5); c.textAlign = 'center';
        c.fillText(n[0], x + pw / 2, y + ph / 2 + 3);
      });
    });
  }

  /* ---------- QA: pipeline de testes ---------- */
  function signPipeline(c, len, t) {
    const x0 = 8, y0 = 12, w = len - 16, h = 84;
    c.fillStyle = BRAND.marinho;
    ISO.rrect(c, x0, y0, w, h, 6); c.fill();
    tituloPlaca(c, x0 + 12, y0 + 13, 'PIPELINE · RELEASE', '#ffffff');
    c.font = FT(600, 8); c.textAlign = 'right'; c.fillStyle = BRAND.pessego;
    c.fillText('main · build #' + (1200 + Math.floor(t / 20) % 99), x0 + w - 12, y0 + 13);
    const etapas = ['BUILD', 'UNITÁRIOS', 'CONTRATO', 'E2E', 'SEGURANÇA', 'GO-LIVE'];
    const ativo = Math.floor(t / 4) % (etapas.length + 2);
    const ew = (w - 24) / etapas.length;
    etapas.forEach((e, i) => {
      const ex = x0 + 12 + i * ew;
      const feito = i < ativo, rodando = i === ativo;
      const cor = feito ? '#3ccf8e' : rodando ? BRAND.laranja : 'rgba(255,255,255,.18)';
      if (i) { c.fillStyle = feito ? 'rgba(60,207,142,.6)' : 'rgba(255,255,255,.14)'; c.fillRect(ex - ew / 2 + 8, y0 + 39, ew - 16, 2); }
      c.fillStyle = cor;
      c.beginPath(); c.arc(ex + ew / 2, y0 + 40, rodando ? 7 + Math.sin(t * 5) : 7, 0, 7); c.fill();
      c.fillStyle = '#ffffff'; c.font = FT(700, 8); c.textAlign = 'center';
      c.fillText(feito ? '✓' : rodando ? '…' : '', ex + ew / 2, y0 + 40.5);
      c.font = FT(600, 7); c.fillStyle = 'rgba(214,226,245,.8)';
      c.fillText(e, ex + ew / 2, y0 + 56);
    });
    const kpis = [['cobertura', '92%'], ['bugs abertos', '3'], ['regressão', 'ok']];
    kpis.forEach((k, i) => {
      const kx = x0 + 12 + i * (w - 24) / 3;
      c.textAlign = 'left'; c.font = FT(600, 7.5); c.fillStyle = 'rgba(214,226,245,.6)';
      c.fillText(k[0].toUpperCase(), kx, y0 + 70);
      c.font = FT(700, 10, 'Barlow'); c.fillStyle = '#ffffff';
      c.fillText(k[1], kx + 58, y0 + 70);
    });
  }

  /* ---------- Dev: a squad agora ---------- */
  function signEquipe(c, len, t) {
    const x0 = 8, y0 = 12, w = len - 16, h = 84;
    painelBranco(c, x0, y0, w, h);
    c.fillStyle = BRAND.laranja; c.fillRect(x0, y0, 4, h);
    tituloPlaca(c, x0 + 14, y0 + 13, 'SQUAD AGORA');
    c.strokeStyle = '#e3e8ef';
    c.beginPath(); c.moveTo(x0 + 12, y0 + 23); c.lineTo(x0 + w - 12, y0 + 23); c.stroke();

    const RO = (typeof ROSTER !== 'undefined') ? ROSTER : null;
    const SI = (typeof SISTEMAS !== 'undefined') ? SISTEMAS : null;
    const n = st => RO ? RO.count(st) : 0;
    const noAr = SI ? SI.todos().filter(s => s.estado === 'no ar' || s.estado === 'web').length : 0;
    const cels = [
      { r: 'TRABALHANDO', v: String(n('trabalhando') + n('reuniao')), cor: BRAND.azul },
      { r: 'NOS JOGOS',   v: String(n('descanso')),                   cor: BRAND.laranja },
      { r: 'OFFLINE',     v: String(n('offline')),                    cor: '#8a97ab' },
      { r: 'SISTEMAS',    v: String(noAr),                            cor: BRAND.marinho }
    ];
    const cw = (w - 24) / cels.length;
    cels.forEach((cel, i) => {
      const cx = x0 + 14 + i * cw;
      c.textAlign = 'left';
      c.font = FT(600, 8); c.fillStyle = '#8a97ab';
      c.fillText(cel.r, cx, y0 + 36);
      c.font = FT(700, 22, 'Barlow'); c.fillStyle = cel.cor;
      c.fillText(cel.v, cx, y0 + 56);
      const amp = .45 + .55 * Math.abs(Math.sin(t * .6 + i));
      c.fillStyle = ISO.rgba(cel.cor, .25);
      c.fillRect(cx, y0 + 70, cw - 20, 3);
      c.fillStyle = cel.cor;
      c.fillRect(cx, y0 + 70, (cw - 20) * amp, 3);
    });
  }

  /* ---------- GP: próximos eventos (botão Quadro) ---------- */
  function signEventos(c, len) {
    const evs = (typeof QUADRO !== 'undefined') ? QUADRO.eventos() : [];
    const x0 = 8, y0 = 12, w = len - 16, h = 84;
    painelBranco(c, x0, y0, w, h);
    tituloPlaca(c, x0 + 12, y0 + 13, 'PRÓXIMAS ENTREGAS');
    c.strokeStyle = '#e3e8ef';
    c.beginPath(); c.moveTo(x0 + 10, y0 + 23); c.lineTo(x0 + w - 10, y0 + 23); c.stroke();
    if (!evs.length) {
      c.font = FT(600, 9.5); c.fillStyle = '#8a97ab'; c.textAlign = 'left';
      c.fillText('nada marcado · use 📌 Quadro', x0 + 14, y0 + 42);
      return;
    }
    evs.slice(0, 4).forEach((e, i) => {
      const ry = y0 + 36 + i * 15;
      c.textAlign = 'left';
      c.font = FT(700, 9.5, 'Barlow'); c.fillStyle = BRAND.laranja;
      c.fillText(e.data, x0 + 14, ry);
      c.font = FT(600, 9.5); c.fillStyle = BRAND.marinho;
      c.fillText(e.nome, x0 + 56, ry);
      c.textAlign = 'right'; c.font = FT(600, 8); c.fillStyle = BRAND.azul;
      c.fillText(e.tipo, x0 + w - 14, ry);
    });
  }

  /* ---------- GP: quadro branco de ideias (botão Quadro) ---------- */
  function signQuadro(c, len) {
    const ideias = (typeof QUADRO !== 'undefined') ? QUADRO.ideias() : [];
    const x0 = 10, y0 = 10, w = len - 20, h = 88;
    c.fillStyle = '#aab6c6'; ISO.rrect(c, x0 - 3, y0 - 3, w + 6, h + 6, 4); c.fill();
    c.fillStyle = '#fbfcfd'; ISO.rrect(c, x0, y0, w, h, 3); c.fill();
    tituloPlaca(c, x0 + 12, y0 + 14, 'IDEIAS', BRAND.laranja);
    c.font = FT(600, 7.5); c.fillStyle = '#8a97ab';
    c.fillText('botão 📌 Quadro', x0 + 62, y0 + 14);
    c.strokeStyle = ISO.rgba(BRAND.laranja, .5); c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(x0 + 12, y0 + 23); c.lineTo(x0 + w - 14, y0 + 23); c.stroke();
    const cores = [BRAND.azul, BRAND.laranja, BRAND.marinho, BRAND.claro];
    ideias.slice(0, 5).forEach((txt, i) => {
      const ry = y0 + 35 + i * 12;
      c.fillStyle = cores[i % cores.length];
      c.beginPath(); c.arc(x0 + 17, ry - 1, 2, 0, 7); c.fill();
      c.font = FT(600, 9.5); c.textAlign = 'left';
      c.fillText(txt, x0 + 25, ry);
    });
    if (!ideias.length) {
      c.font = 'italic ' + FT(600, 9.5); c.fillStyle = '#8a97ab';
      c.fillText('quadro vazio', x0 + 25, y0 + 38);
    }
  }

  function drawDecals() { /* piso liso */ }

  /* ---------- pontos de interesse ---------- */
  const SPAWN = { x: 45, y: 16 };          // saída dos elevadores

  return {
    W, H, VOID, FLOOR, WALL, DOOR, C, BRAND,
    ROOMS, WORK_ROOMS, DOORS, SPAWN, WALL_H, PARAPET,
    SIGNS, signDepth, logo,
    kindAt, roomAt, isWall, walkable, setBlocked, wallOccludes,
    drawFloor, drawWallTile, drawDoorTile, drawSigns, drawDecals, drawRoomLabels,
    wallFace
  };
})();
