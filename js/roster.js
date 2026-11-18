/* ===========================================================
   roster.js — quem trabalha aqui.
   BOSSES  : o gerente da squad (sempre em serviço, na Gerência)
   CATALOG : a Squad de Consórcio Pagar & Receber + o agente de exemplo
   =========================================================== */
const ROSTER = (() => {

  const KEY = 'squad-consorcio-pr-v2';
  /** versão da planta. Equipe salva numa planta anterior é trocada pela
      squad padrão: as mesas da planta antiga não existem mais. */
  const PLANTA = 2;

  /* ===========================================================
     A LIDERANÇA
     =========================================================== */
  const BOSSES = [
    {
      id: 'boss-1', name: 'Marcelo Bordotti', role: 'Gerente da Squad de Consórcio Pagar & Receber',
      emoji: '⭐', boss: true, dept: 'ger', slotId: 'GER-1',
      status: 'trabalhando', locked: true,
      source: 'Liderança', sistema: null,
      brief: 'Gerente da squad. Fica na sala da Gerência, sempre em serviço.',
      look: {
        skin: '#e0a878', hair: '#2a1d14', style: 'curto',
        shirt: '#0A1F5C', pants: '#1e293b', shoes: '#15181f',
        glasses: null, beard: null, tattoo: false, cap: false,
        uniforme: false
      }
    }
  ];

  /* ===========================================================
     A SQUAD
     sala: ger | produto | tech | dev | qa | sre | atendimento | processos
     'detectado' = tem sistema no registro (data/sistemas.json)
     'sugerido'  = pessoa da squad; ligue um sistema a ela quando quiser
     A aparência de cada um é sorteada a partir do nome e pode ser
     trocada na ficha (botão do Visual).
     =========================================================== */
  const AZ = '#123C8C', MA = '#0A1F5C', LA = '#EC7000', CL = '#3F7FD6', BR = '#e9edf2', CI = '#64748b';
  const pessoa = (key, name, role, emoji, sala, shirt, desc, why) =>
    ({ key, name, role, emoji, sala, cat: 'sugerido', desc, why,
       look: { shirt, tattoo: false, cap: false } });

  const CATALOG = [
    /* ---- Produto ---- */
    pessoa('pm-filipe', 'Filipe Coelho', 'Gerente de Produto', '📋', 'produto', AZ,
      'Cuida da visão de produto dos fluxos de pagar e receber do consórcio e prioriza o backlog.',
      'Liga o que o cliente precisa ao que a squad entrega.'),
    pessoa('pm-raphaela', 'Raphaela', 'Gerente de Produto', '📆', 'produto', LA,
      'Conduz discovery e roadmap das jornadas de recebimento: parcelas, lances e boletos.',
      'Garante que cada entrega resolva uma dor real do consorciado.'),
    pessoa('pm-luane', 'Luane', 'Gerente de Produto', '🎯', 'produto', CL,
      'Acompanha indicadores e entregas das jornadas de pagamento: crédito, bem e devoluções.',
      'Mede o resultado do que foi para produção.'),

    /* ---- Tech Lead ---- */
    pessoa('tl-matheus', 'Matheus Oliveira', 'Tech Lead', '🧭', 'tech', MA,
      'Responde pela arquitetura, pelos padrões de código e pelas decisões técnicas da squad.',
      'Decisão técnica errada em pagamento vira incidente. Revisão de desenho evita isso.'),

    /* ---- Desenvolvimento ---- */
    pessoa('dev-emesron', 'Emesron Bilieri', 'Engenharia de Software', '⚡', 'dev', AZ,
      'Desenvolve as APIs de recebimento de parcelas e lances.', 'Back-end dos fluxos de receber.'),
    pessoa('dev-edison', 'Edison Maciel', 'Engenharia de Software', '🧾', 'dev', BR,
      'Integrações de boleto e Pix com as plataformas do banco.', 'Integração é onde o dinheiro entra.'),
    pessoa('dev-bruno-c', 'Bruno Cavalcanti', 'Engenharia de Software', '🖥️', 'dev', MA,
      'Telas e jornadas de pagar e receber no app e no internet banking.', 'Transforma o fluxo em tela simples.'),
    pessoa('dev-luiz', 'Luiz Pereira', 'Engenharia de Software', '🛠️', 'dev', LA,
      'Fluxos de pagamento do bem e devoluções aos consorciados.', 'Back-end dos fluxos de pagar.'),
    pessoa('dev-thiago', 'Thiago Pereira', 'Engenharia de Software', '🧮', 'dev', CL,
      'Conciliação de cotas e os dados de volume, falha e liquidação.', 'Sem conciliação ninguém sabe se o dinheiro chegou.'),
    pessoa('dev-jose', 'Jose Ergildo', 'Engenharia de Software', '🔌', 'dev', CI,
      'Mensageria, jobs de lote e integração com os sistemas legados do consórcio.', 'Mantém o lote noturno rodando.'),

    /* ---- Qualidade ---- */
    pessoa('qa-bianca', 'Bianca Mancuso', 'Qualidade (QA)', '🧪', 'qa', CL,
      'Estratégia de testes, automação e validação de cada entrega antes da produção.',
      'Regra de consórcio tem muita exceção. Teste bem feito pega o que o código esqueceu.'),

    /* ---- SRE ---- */
    pessoa('sre-natalia', 'Natalia Galdino', 'SRE', '🛰️', 'sre', MA,
      'Observabilidade, SLOs e alertas dos serviços da squad.', 'Pagamento é 24x7: alguém cuida de disponibilidade.'),
    pessoa('sre-bruno-r', 'Bruno Roberto', 'SRE', '📡', 'sre', AZ,
      'Pipelines de deploy, infraestrutura e plantão.', 'Deploy seguro e rollback rápido.'),

    /* ---- Atendimento ---- */
    pessoa('at-nathalia', 'Nathalia Chaves', 'Atendimento', '🎧', 'atendimento', LA,
      'Recebe os chamados de clientes e áreas parceiras e acompanha até a solução.',
      'É a voz do consorciado dentro da squad.'),

    /* ---- Processos ---- */
    pessoa('pr-gabriel', 'Gabriel Simplicio', 'Processos', '🗂️', 'processos', BR,
      'Mapeia e melhora os processos da jornada do consorciado, da adesão à contemplação.',
      'Processo claro reduz retrabalho e chamado.'),

    /* ---- Agente de demonstração ---- */
    {
      key: 'exemplo', name: 'EXEMPLO', role: 'Agente de demonstração', emoji: '🤖', sala: 'dev',
      cat: 'detectado', system: 'Agente de exemplo', sistema: 'exemplo',
      desc: 'Um sistema mínimo que vem junto, na pasta exemplo-agente: sobe na porta 4401 e mostra uma página.',
      why: 'Serve de molde. Contrate e clique no computador dele para ver o escritório ligar, embutir e conversar com um sistema.',
      look: { shirt: CL, tattoo: false, cap: false }
    }
  ];

  /** quem já começa trabalhando na squad */
  const EQUIPE_INICIAL = CATALOG.filter(c => c.key !== 'exemplo').map(c => c.key);

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
      return d && Array.isArray(d.team) && d.team.length && d.v >= PLANTA ? d.team : null;
    } catch (e) { return null; }
  };

  async function load() {
    let vindoDoDisco = null;
    try {
      const d = await (await fetch('/api/equipe')).json();
      if (d && Array.isArray(d.team) && d.team.length && d.v >= PLANTA) vindoDoDisco = d.team;
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
    try { localStorage.setItem(KEY, JSON.stringify({ team, v: PLANTA })); }
    catch (e) { /* storage bloqueado: o disco ainda pega */ }
    // junta as chamadas seguidas num POST só — arrastar um agente dispara
    // save() várias vezes por segundo
    clearTimeout(gravando);
    gravando = setTimeout(() => {
      fetch('/api/equipe', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, v: PLANTA })
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
