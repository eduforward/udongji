// 우동지 공용 상단 내비 <udongji-nav current="consult">
(function () {
  const VERSION = 'v24 · 2026-09-08';
  const PAGES = [
    { key: 'home', label: '홈', file: '우동지 홈.dc.html', dep: 'index.html' },
    { key: 'consult', label: '상담 업무', file: '우동지 상담 스크립트.dc.html', dep: 'consult.html' },
    { key: 'recall', label: '재연락', file: '우동지 재연락.dc.html', dep: 'recall.html' },
    { key: 'contract', label: '계약 업무', file: '우동지 계약 업무.dc.html', dep: 'contract.html' },
    { key: 'customers', label: '고객 목록', file: '우동지 고객 목록.dc.html', dep: 'customers.html' }
  ];
  const ADMIN_PAGE = { key: 'admin', label: '관리자', file: '우동지 관리자.dc.html', dep: 'admin.html' };
  const isDeploy = !/\.dc\.html$/.test(location.pathname) && !/\.dc\.html/.test(decodeURIComponent(location.pathname));
  const css = `
    :host { display: block; position: sticky; top: 0; z-index: 10; font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; letter-spacing: -0.01em; }
    .bar { background: rgba(255,255,255,.92); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid #E4E8F0; }
    .in { max-width: 1400px; margin: 0 auto; padding: 0 20px; height: 52px; display: flex; align-items: center; gap: 4px; }
    a.brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #171C2B; font-weight: 800; font-size: 15px; margin-right: 14px; white-space: nowrap; }
    a.brand .mark { width: 28px; height: 28px; border-radius: 8px; background: #3D5AF1; color: #fff; display: grid; place-items: center; font-size: 13px; }
    nav { display: flex; gap: 2px; flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; }
    nav::-webkit-scrollbar { display: none; }
    nav a { text-decoration: none; color: #58627A; font-size: 13.5px; font-weight: 600; padding: 7px 12px; border-radius: 8px; white-space: nowrap; transition: background .12s, color .12s; }
    nav a:hover { background: #F6F8FC; color: #171C2B; }
    nav a.on { background: #EEF1FE; color: #3D5AF1; font-weight: 700; }
    .right { margin-left: auto; display: flex; align-items: center; gap: 10px; white-space: nowrap; }
    .who { font-size: 12.5px; color: #8C95A8; font-weight: 500; max-width: 220px; overflow: hidden; text-overflow: ellipsis; }
    button { font: inherit; font-size: 12.5px; font-weight: 600; color: #58627A; background: none; border: 1px solid #E4E8F0; border-radius: 8px; padding: 5px 10px; cursor: pointer; }
    button:hover { background: #F6F8FC; color: #171C2B; }
    .ver { font-size: 11px; font-weight: 700; color: #8C95A8; background: #F6F8FC; border: 1px solid #E4E8F0; border-radius: 6px; padding: 2px 7px; white-space: nowrap; font-variant-numeric: tabular-nums; }
    @media (max-width: 640px) { .who { display: none; } a.brand span { display: none; } .in { padding: 0 12px; } }
  `;
  class UNav extends HTMLElement {
    connectedCallback() {
      const cur = this.getAttribute('current') || '';
      const root = this.attachShadow({ mode: 'open' });
      const href = p => isDeploy ? p.dep : p.file;
      root.innerHTML = `<style>${css}</style><div class="bar"><div class="in">
        <a class="brand" href="${href(PAGES[0])}"><span class="mark">우</span><span>우동지CRM</span></a>
        <nav>${PAGES.map(p => `<a href="${href(p)}" class="${p.key === cur ? 'on' : ''}">${p.label}</a>`).join('')}<a id="adm" href="${href(ADMIN_PAGE)}" class="${ADMIN_PAGE.key === cur ? 'on' : ''}" hidden style="color:#D93A4A">${ADMIN_PAGE.label}</a></nav>
        <div class="right"><span class="ver" title="배포 버전">${VERSION}</span><span class="who" id="who"></span><button type="button" id="out" hidden>로그아웃</button></div>
      </div></div>`;
      const who = root.getElementById('who'), out = root.getElementById('out'), adm = root.getElementById('adm');
      const lib = this.getAttribute('lib') || './udongji-fb.js?v=3';
      import(lib).then(async m => { await m.init(); if (m.isSignedIn()) { who.textContent = m.userEmail(); out.hidden = false; out.onclick = async () => { await m.signOut(); location.href = href(PAGES[0]); }; if (await m.isAdmin(m.userEmail())) adm.hidden = false; } }).catch(() => {});
    }
  }
  if (!customElements.get('udongji-nav')) customElements.define('udongji-nav', UNav);
})();
