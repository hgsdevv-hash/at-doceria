// Abertura: a faca corta, a fatia abre (pula na segunda visita e com movimento reduzido)
(() => {
  const intro = document.getElementById('intro');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;
  try { seen = sessionStorage.getItem('atd-intro') === '1'; } catch (e) {}
  const finish = () => { intro.remove(); document.body.classList.remove('is-loading'); };
  if (reduce || seen) return finish();
  try { sessionStorage.setItem('atd-intro', '1'); } catch (e) {}
  setTimeout(() => intro.classList.add('cut'), 800);
  setTimeout(() => intro.classList.add('done'), 2000);
  setTimeout(finish, 2900);
})();

// Camadas de cada torta
document.querySelectorAll('.torta').forEach(t => {
  const ol = t.querySelector('.layers');
  t.dataset.layers.split(',').forEach((c, i) => {
    const li = document.createElement('li');
    li.style.setProperty('--c', c);
    li.style.transitionDelay = (i * 120) + 'ms';
    ol.append(li);
  });
});

// Entrada ao rolar
document.querySelectorAll('.sec-head, .torta, .b, .bolos__text, .passos li, .box').forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Monte sua caixa
(() => {
  const N = 12, box = document.getElementById('box'), count = document.getElementById('count');
  const send = document.getElementById('enviar'), items = [];
  for (let i = 0; i < N; i++) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'slot'; b.tabIndex = -1;
    b.setAttribute('aria-label', 'Espaço vazio');
    b.addEventListener('click', () => { if (items[i]) { items.splice(i, 1); render(); } });
    box.append(b);
  }
  const slots = [...box.children];
  function render() {
    slots.forEach((s, i) => {
      const it = items[i];
      s.classList.toggle('full', !!it);
      s.tabIndex = it ? 0 : -1;
      s.style.setProperty('--c', it ? it.c : '');
      s.setAttribute('aria-label', it ? it.s + ', tocar para tirar' : 'Espaço vazio');
    });
    count.textContent = items.length;
    const full = items.length === N;
    send.classList.toggle('is-off', !full);
    send.setAttribute('aria-disabled', String(!full));
    send.textContent = full ? 'Enviar pedido no WhatsApp' : `Faltam ${N - items.length} docinhos`;
    if (full) {
      const tally = {};
      items.forEach(it => tally[it.s] = (tally[it.s] || 0) + 1);
      const lines = Object.entries(tally).map(([s, n]) => `${n}x ${s}`).join('\n');
      send.href = 'https://wa.me/5519992386612?text=' + encodeURIComponent(`Olá, AT Doceria! Quero uma caixa com 12 docinhos:\n${lines}`);
    }
  }
  document.querySelectorAll('#sabores button').forEach(btn => btn.addEventListener('click', () => {
    if (items.length >= N) return;
    items.push({ s: btn.dataset.s, c: btn.style.getPropertyValue('--c') });
    render();
  }));
  document.getElementById('limpar').addEventListener('click', () => { items.length = 0; render(); });
  render();
})();
