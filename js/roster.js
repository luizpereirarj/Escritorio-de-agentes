/* ===========================================================
   roster.js — quem trabalha aqui.
   BOSSES  : você (sempre em serviço, na Diretoria)
   CATALOG : o agente de exemplo + vagas sugeridas para começar
   =========================================================== */
const ROSTER = (() => {

  const KEY = 'squad-pagar-receber-v1';

  /* ===========================================================
     A LIDERANÇA — o nome vem de data/config.json ("dono")
     =========================================================== */
  const BOSSES = [
    {
      id: 'boss-1', name: (window.ESCRITORIO && ESCRITORIO.dono) || 'Você', role: 'Head da Squad Pagar & Receber',
      emoji: '⭐', boss: true, dept: 'gp', slotId: 'GP-1',
      status: 'trabalhando', locked: true,
      source: 'Liderança', sistema: null,
      brief: 'Responde pela squad. Fica na sala dos Gerentes de Projeto, sempre em serviço.',
      look: {
        skin: '#d9a17a', hair: '#2a1d14', style: 'curto',
        shirt: '#0B2A55', pants: '#1e293b', shoes: '#15181f',
        glasses: null, beard: null, tattoo: false, cap: false,
        uniforme: false
      }
    }
  ];

  /* ===========================================================
     BANCO DE TALENTOS DA SQUAD
     sala: gp | tech | ux | qa | dev — define a sala da estação
     'detectado' = tem sistema no registro (data/sistemas.json)
     'sugerido'  = vaga da squad; contrate e depois ligue um sistema a ela
     =========================================================== */
  const AZ = '#0A4DA2', MA = '#0B2A55', LA = '#FF7A1A', CL = '#3E8EDE', BR = '#e9edf2', CI = '#64748b';
  const CATALOG = [
    {
      key: 'exemplo', name: 'EXEMPLO', role: 'Agente de demonstração', emoji: '🤖', sala: 'dev',
      cat: 'detectado', system: 'Agente de exemplo', sistema: 'exemplo',
      desc: 'Um sistema mínimo que vem junto, na pasta exemplo-agente: sobe na porta 4401 e mostra uma página.',
      why: 'Serve de molde. Clique no computador dele para ver o escritório ligar, embutir e conversar com um sistema. Depois cadastre os seus.',
      look: { skin: '#c9854f', hair: '#140f0c', style: 'cacheado', shirt: CL, pants: '#26304a', glasses: null, beard: null }
    },

    /* ---- Gerentes de Projeto ---- */
    {
      key: 'gp-marina', name: 'Marina', role: 'Gerente de Projeto · Pagamentos', emoji: '📋', sala: 'gp', cat: 'sugerido',
      desc: 'Conduz o roadmap de Pix, TED e agendamentos. Cuida de prazo, risco e dependência entre times.',
      why: 'Fluxo de pagamento mexe com regulatório e com outros times do banco: alguém precisa costurar tudo.',
      look: { skin: '#f0c29b', hair: '#3d2a1a', style: 'longo', shirt: AZ, pants: '#1e293b', glasses: 'retangular', beard: null }
    },
    {
      key: 'gp-paulo', name: 'Paulo', role: 'Gerente de Projeto · Recebimentos', emoji: '📆', sala: 'gp', cat: 'sugerido',
      desc: 'Toca boleto, cobrança e conciliação. Prioriza com o negócio e acompanha os indicadores.',
      why: 'Recebimento é caixa do cliente: cada atraso de entrega aparece no resultado.',
      look: { skin: '#a2643b', hair: '#140f0c', style: 'fade', shirt: BR, pants: '#26304a', glasses: null, beard: 'cavanhaque' }
    },

    /* ---- Tech Leaders ---- */
    {
      key: 'tl-rodrigo', name: 'Rodrigo', role: 'Tech Lead · Pagamentos', emoji: '🧭', sala: 'tech', cat: 'sugerido',
      desc: 'Desenha a arquitetura dos fluxos de saída: Pix, TED e integração com o SPI.',
      why: 'Decisão técnica errada em pagamento vira incidente. Revisão de desenho evita isso.',
      look: { skin: '#e0a878', hair: '#241a13', style: 'curto', shirt: MA, pants: '#1b2030', glasses: 'retangular', beard: 'cheia' }
    },
    {
      key: 'tl-aline', name: 'Aline', role: 'Tech Lead · Recebimentos', emoji: '🛠️', sala: 'tech', cat: 'sugerido',
      desc: 'Responde pela plataforma de boleto, QR Code e pelo ledger de recebimentos.',
      why: 'Garante padrão de código, observabilidade e resiliência nos fluxos de entrada.',
      look: { skin: '#7a4a2c', hair: '#140f0c', style: 'coque', shirt: CL, pants: '#1e293b', glasses: null, beard: null }
    },

    /* ---- UX ---- */
    {
      key: 'ux-bruna', name: 'Bruna', role: 'UX Designer', emoji: '🎨', sala: 'ux', cat: 'sugerido',
      desc: 'Desenha a jornada do pagador no app e no internet banking, do protótipo ao teste com usuário.',
      why: 'Pagar e receber precisa ser em poucos toques e sem dúvida: é aqui que se perde ou ganha o cliente.',
      look: { skin: '#f7d7bd', hair: '#a8702f', style: 'chanel', shirt: LA, pants: '#26304a', glasses: 'redondo', beard: null }
    },
    {
      key: 'ux-caio', name: 'Caio', role: 'UX Writer & Pesquisa', emoji: '🔎', sala: 'ux', cat: 'sugerido',
      desc: 'Escreve os textos das telas e roda as pesquisas com clientes.',
      why: 'Texto claro em tela de pagamento evita erro, reclamação e chamado no atendimento.',
      look: { skin: '#c9854f', hair: '#3d2a1a', style: 'ondulado', shirt: BR, pants: '#1b2030', glasses: null, beard: null }
    },

    /* ---- QA ---- */
    {
      key: 'qa-dan', name: 'Dan', role: 'Analista de Qualidade · Automação', emoji: '🧪', sala: 'qa', cat: 'sugerido',
      desc: 'Mantém a suíte automatizada: unitários, contrato e ponta a ponta.',
      why: 'Com várias pessoas mexendo em código de pagamento, alguém precisa ser o freio antes da produção.',
      look: { skin: '#f7d7bd', hair: '#8e8e93', style: 'curto', shirt: CL, pants: '#26304a', glasses: 'redondo', beard: null }
    },
    {
      key: 'qa-livia', name: 'Lívia', role: 'Analista de Qualidade · Funcional', emoji: '✅', sala: 'qa', cat: 'sugerido',
      desc: 'Escreve os cenários de teste a partir das regras do negócio e valida cada entrega.',
      why: 'Regra de pagamento tem muita exceção. Cenário bem escrito pega o que o código esqueceu.',
      look: { skin: '#e0a878', hair: '#140f0c', style: 'rabo', shirt: AZ, pants: '#1e293b', glasses: null, beard: null }
    },
    {
      key: 'qa-otavio', name: 'Otávio', role: 'Analista de Qualidade · Performance', emoji: '📈', sala: 'qa', cat: 'sugerido',
      desc: 'Testa carga e estresse nos picos: dia 5, dia 10 e Black Friday.',
      why: 'Pagamento cai justo no dia de pico. Teste de carga antes evita o incidente depois.',
      look: { skin: '#5a3620', hair: '#140f0c', style: 'raspado', shirt: MA, pants: '#26304a', glasses: null, beard: 'cheia' }
    },

    /* ---- Desenvolvimento ---- */
    {
      key: 'dev-leo', name: 'Léo', role: 'Dev Back-end · Pix', emoji: '⚡', sala: 'dev', cat: 'sugerido',
      desc: 'APIs de Pix: envio, devolução, agendamento e Pix Automático.',
      why: 'Pix é o fluxo de maior volume: precisa de gente dedicada.',
      look: { skin: '#f0c29b', hair: '#241a13', style: 'fade', shirt: AZ, pants: '#1b2030', glasses: null, beard: 'cavanhaque' }
    },
    {
      key: 'dev-rafa', name: 'Rafa', role: 'Dev Back-end · Boleto', emoji: '🧾', sala: 'dev', cat: 'sugerido',
      desc: 'Registro, baixa e liquidação de boletos, integração com a CIP.',
      why: 'Boleto ainda é o meio de recebimento de muita empresa cliente do banco.',
      look: { skin: '#c9854f', hair: '#1a120d', style: 'curto', shirt: BR, pants: '#26304a', glasses: 'retangular', beard: 'cheia' }
    },
    {
      key: 'dev-bia', name: 'Bia', role: 'Dev Front-end', emoji: '🖥️', sala: 'dev', cat: 'sugerido',
      desc: 'Telas de pagamento e recebimento no internet banking.',
      why: 'Transforma o protótipo do UX em tela rápida e acessível.',
      look: { skin: '#7a4a2c', hair: '#140f0c', style: 'afro', shirt: LA, pants: '#1b2030', glasses: 'redondo', beard: null }
    },
    {
      key: 'dev-nico', name: 'Nico', role: 'Dev Mobile', emoji: '📱', sala: 'dev', cat: 'sugerido',
      desc: 'Fluxos de pagar e receber no app do banco, iOS e Android.',
      why: 'A maior parte das transações nasce no celular.',
      look: { skin: '#e0a878', hair: '#5a3a22', style: 'longo', shirt: MA, pants: '#26304a', glasses: null, beard: null }
    },
    {
      key: 'dev-cami', name: 'Cami', role: 'Dev de Dados · Conciliação', emoji: '🧮', sala: 'dev', cat: 'sugerido',
      desc: 'Conciliação D+0 e os painéis de volume, falha e tempo de liquidação.',
      why: 'Sem conciliação confiável, ninguém sabe se o dinheiro chegou.',
      look: { skin: '#f0c29b', hair: '#140f0c', style: 'longo', shirt: CL, pants: '#1b2030', glasses: 'redondo', beard: null }
    },
    {
      key: 'dev-duda', name: 'Duda', role: 'SRE · Plataforma', emoji: '🛰️', sala: 'dev', cat: 'sugerido',
      desc: 'Deploy, observabilidade e plantão dos serviços da squad.',
      why: 'Pagamento é 24x7: alguém precisa cuidar de disponibilidade e alerta.',
      look: { skin: '#f7d7bd', hair: '#8b5a2b', style: 'franja', shirt: CI, pants: '#1e293b', glasses: 'retangular', beard: null }
    }
  ];

  /** quem já começa trabalhando na squad */
  const EQUIPE_INICIAL = ['exemplo', 'gp-marina', 'gp-paulo', 'tl-rodrigo', 'tl-aline',
    'ux-bruna', 'ux-caio', 'qa-dan', 'qa-livia', 'qa-otavio',
    'dev-leo', 'dev-rafa', 'dev-bia', 'dev-nico', 'dev-cami', 'dev-duda'];

  /* ===========================================================
     ESTADO
     =========================================================== */
  let team = [];

  function defaults() {
    const base = BOSSES.map(b => Object.assign({}, b, { look: Object.assign({}, b.look) }));
    // a squad completa, mais o agente de exemplo para mostrar o fluxo de sistema
    for (const k of EQUIPE_INICIAL) {
      const c = CATALOG.find(c => c.key === k);
      base.push(fromCatalog(c));
    }
    return base;
  }

  function fromCatalog(c) {
    return {
      id: 'ag-' + c.key,
      key: c.key,
      name: c.name,
      role: c.role,
      emoji: c.emoji,
      system: c.system || null,
      sistema: c.sistema || null,
      path: c.path || null,
      brief: c.desc,
      dept: c.sala || 'dev',
      slotId: null,
      status: 'trabalhando',
      boss: false,
      locked: false,
      look: AVATAR.makeLook(c.key, c.look)
    };
  }

  /* ===========================================================
     PERSISTÊNCIA

     O disco manda. A equipe já morava só no localStorage do navegador
     e um dia voltou inteira ao padrão: nome que você deu, contratação,
     estação, horário — tudo perdido de uma vez, sem aviso. O navegador
     limpa storage quando quer. Agora o arquivo é data/equipe.json, no
     servidor, e o localStorage é só um espelho para quando ele estiver
     fora do ar.
     =========================================================== */
  const doLocal = () => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      return d && Array.isArray(d.team) && d.team.length ? d.team : null;
    } catch (e) { return null; }
  };

  async function load() {
    let vindoDoDisco = null;
    try {
      const d = await (await fetch('/api/equipe')).json();
      if (d && Array.isArray(d.team) && d.team.length) vindoDoDisco = d.team;
    } catch (e) { /* servidor fora: vale o que o navegador tiver */ }

    team = vindoDoDisco || doLocal() || defaults();
    recompor();              // equipe salva antes pode não ter os campos novos
    if (!vindoDoDisco) save();   // primeira vez ou migração: carimba no disco
  }

  /** reencaixa campos que chegaram depois de a equipe já ter sido salva,
      como o id do sistema que o agente opera */
  function recompor() {
    for (const a of team) {
      const c = CATALOG.find(c => c.key === a.key);
      if (c) {
        if (!a.sistema && c.sistema) a.sistema = c.sistema;
        if (c.path && a.path !== c.path) a.path = c.path;
      }
      const b = BOSSES.find(b => b.id === a.id);
      if (b && !a.sistema && b.sistema) a.sistema = b.sistema;
      // salas da planta antiga viram as salas da squad
      if (b) { a.dept = b.dept; a.slotId = b.slotId; }
      else if (!WORLD.ROOMS[a.dept] || !WORLD.WORK_ROOMS.includes(a.dept)) a.dept = (c && c.sala) || 'dev';
      // sem look o boneco não é desenhado: fica um funcionário invisível na
      // mesa. Reconstrói a partir da key, que é determinística — o mesmo
      // agente volta com a mesma cara de sempre.
      if (!a.look || !a.look.skin) {
        const base = (c && c.look) || (b && b.look) || {};
        a.look = AVATAR.makeLook(a.key || a.id, Object.assign({}, base));
      }
    }
  }

  let gravando = null;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ team, v: 1 })); }
    catch (e) { /* storage bloqueado: o disco ainda pega */ }
    // junta as chamadas seguidas num POST só — arrastar um agente dispara
    // save() várias vezes por segundo
    clearTimeout(gravando);
    gravando = setTimeout(() => {
      fetch('/api/equipe', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, v: 1 })
      }).catch(() => { /* offline: fica o espelho do navegador */ });
    }, 300);
  }

  function reset() { team = defaults(); save(); }

  /* ---------- operações ---------- */
  function hire(key) {
    const c = CATALOG.find(c => c.key === key);
    if (!c || team.some(a => a.key === key)) return null;
    const a = fromCatalog(c);
    team.push(a); save();
    return a;
  }

  function hireCustom(data) {
    const key = 'custom-' + Date.now().toString(36);
    const a = {
      id: 'ag-' + key, key,
      name: data.name || 'Novo agente',
      role: data.role || 'Função a definir',
      emoji: data.emoji || '🤖',
      system: data.system || null, path: data.path || null,
      sistema: data.sistema || null, reuniao: data.reuniao !== false,
      brief: data.brief || '',
      dept: data.sala || 'dev', slotId: null, status: 'trabalhando',
      boss: false, locked: false, custom: true,
      look: AVATAR.makeLook(key, data.look || {})
    };
    team.push(a); save();
    return a;
  }

  function fire(id) {
    const i = team.findIndex(a => a.id === id);
    if (i < 0 || team[i].locked) return false;
    team.splice(i, 1); save();
    return true;
  }

  const get = (id) => team.find(a => a.id === id);
  const all = () => team;
  const isHired = (key) => team.some(a => a.key === key);
  const count = (st) => team.filter(a => a.status === st).length;

  return { BOSSES, CATALOG, load, save, reset, hire, hireCustom, fire,
           get, all, isHired, count, fromCatalog };
})();
