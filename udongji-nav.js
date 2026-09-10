// 우동지 공용 상단 내비 <udongji-nav current="consult">
(function () {
  const VERSION = 'v39 · 2026-09-10';
  // 배포 이력 — 새 배포마다 맨 앞에 한 줄 추가
  const HISTORY = [
    { v: 39, d: '2026-09-10', c: ['계약 업무 마지막 단계 명칭을 "커넥트 설치 완료" → "커넥트 배송 완료"로 변경 (설치 여부는 확인 불가, 배송까지만 추적)'] },
    { v: 38, d: '2026-09-09', c: ['브라우저 탭 파비콘 추가 — 탭이 많아도 우동지 CRM을 바로 찾을 수 있어요', '상단 로고 마크를 파비콘과 같은 디자인으로 통일'] },
    { v: 37, d: '2026-09-09', c: ['상단 버전 배지를 클릭하뱴 배포 이력이 열려요'] },
    { v: 36, d: '2026-09-09', c: ['홈 화면 안의 관리자 링크 제거 (상단 네비에만)'] },
    { v: 35, d: '2026-09-09', c: ['계정 역할 4단계: 구성원(상담·영업) < 관리자 < 슈퍼관리자', '관리자 화면에 역할 드롭다운 — 관리자/슈퍼 지정은 슈퍼관리자만', '상담시간 설정은 관리자 이상만 (네비에도 관리자에게만 표시)'] },
    { v: 34, d: '2026-09-09', c: ['상담시간이 관리자 탭에서 나와 독립 페이지로'] },
    { v: 33, d: '2026-09-09', c: ['홈페이지 상담시간 설정 신설: 즉시 끄기 · 요일별 시간 · 휴무일', '랜딩페이지용 공개 JSON 엔드포인트 (Apps Script, 한국시간 서버 계산)'] },
    { v: 32, d: '2026-09-09', c: ['뉴스레터 자동 등록: 커넥트 수령 완료 시 구글 시트 → 스티비 0일·30일차 발송', '관리자 > 뉴스레터 연동 탭 (URL·시크릿·테스트·전송 로그)', '상담 폼 이메일 필수'] },
    { v: 31, d: '2026-09-08', c: ['고객 목록에서 필수 서류 [보기 N] → 전체화면 보기, 없으면 [업로드]', '홈 대시보드: 나의 진행 중 / 총 진행 중, 상담은 나의 오늘 / 총 오늘'] },
    { v: 30, d: '2026-09-08', c: ['상담 중 "일시 종료" → 상담 연기(다음 연락 예약) / 상담 거부, 둘 다 재연락 목록으로', '결과 선택 UI 제거', '등록 업무를 계약 업무의 "페이앤 이관" 단계로 합침', '커넥트 설치 → 커넥트 수령 완료'] },
    { v: 29, d: '2026-09-08', c: ['상담자 이름은 계정에 등록된 이름으로 고정 (본인 수정 불가, 서버 검증)', '삭제 시 원본 보관 → 관리자 삭제 로그에서 복구', '네비 z-index 수정 — 서랍·모달이 네비 위로'] }
  ];
  // 페이지 캠시 방지: 각 페이지가 <udongji-nav page-v="N">으로 자기 버전을 알리고, 네바가 기대하는 버전과 다르면 한 번 강제 새로고침
  const PAGE_V = 39;
  const PAGES = [
    { key: 'home', label: '홈', file: '우동지 홈.dc.html', dep: 'index.html' },
    { key: 'consult', label: '상담 업무', file: '우동지 상담 스크립트.dc.html', dep: 'consult.html' },
    { key: 'recall', label: '재연락', file: '우동지 재연락.dc.html', dep: 'recall.html' },
    { key: 'contract', label: '계약 업무', file: '우동지 계약 업무.dc.html', dep: 'contract.html' },
    { key: 'customers', label: '고객 목록', file: '우동지 고객 목록.dc.html', dep: 'customers.html' },
    { key: 'hours', label: '상담시간', file: '우동지 상담시간.dc.html', dep: 'hours.html', admin: true }
  ];
  const ADMIN_PAGE = { key: 'admin', label: '관리자', file: '우동지 관리자.dc.html', dep: 'admin.html' };
  const ICON = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#3D5AF1"/><path d="M20 14v24a12 12 0 0 0 24 0V14" fill="none" stroke="#fff" stroke-width="10"/><circle cx="46" cy="16" r="11" fill="#3D5AF1"/><circle cx="46" cy="16" r="7" fill="#FF4D5E"/></svg>');
  const isDeploy = !/\.dc\.html$/.test(location.pathname) && !/\.dc\.html/.test(decodeURIComponent(location.pathname));
  const css = `
    :host { display: block; position: sticky; top: 0; z-index: 10; font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; letter-spacing: -0.01em; }
    .bar { background: rgba(255,255,255,.92); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid #E4E8F0; }
    .in { max-width: 1400px; margin: 0 auto; padding: 0 20px; height: 52px; display: flex; align-items: center; gap: 4px; }
    a.brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #171C2B; font-weight: 800; font-size: 15px; margin-right: 14px; white-space: nowrap; }
    a.brand .mark { width: 28px; height: 28px; display: block; }
    nav { display: flex; gap: 2px; flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; }
    nav::-webkit-scrollbar { display: none; }
    nav a { text-decoration: none; color: #58627A; font-size: 13.5px; font-weight: 600; padding: 7px 12px; border-radius: 8px; white-space: nowrap; transition: background .12s, color .12s; }
    nav a:hover { background: #F6F8FC; color: #171C2B; }
    nav a.on { background: #EEF1FE; color: #3D5AF1; font-weight: 700; }
    .right { margin-left: auto; display: flex; align-items: center; gap: 10px; white-space: nowrap; }
    .who { font-size: 12.5px; color: #8C95A8; font-weight: 500; max-width: 220px; overflow: hidden; text-overflow: ellipsis; }
    button { font: inherit; font-size: 12.5px; font-weight: 600; color: #58627A; background: none; border: 1px solid #E4E8F0; border-radius: 8px; padding: 5px 10px; cursor: pointer; }
    button:hover { background: #F6F8FC; color: #171C2B; }
    .ver { font-size: 11px; font-weight: 700; color: #8C95A8; background: #F6F8FC; border: 1px solid #E4E8F0; border-radius: 6px; padding: 2px 7px; white-space: nowrap; font-variant-numeric: tabular-nums; cursor: pointer; }
    .ver:hover { color: #171C2B; background: #EEF1F6; }
    .hb { position: fixed; inset: 0; background: rgba(20,27,45,.4); display: none; align-items: flex-start; justify-content: center; padding: 70px 16px 16px; z-index: 50; }
    .hb.on { display: flex; }
    .hp { background: #fff; border-radius: 14px; box-shadow: 0 20px 60px rgba(20,27,45,.25); width: min(560px, 100%); max-height: calc(100vh - 90px); overflow: auto; }
    .hh { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #E4E8F0; position: sticky; top: 0; background: #fff; }
    .hh b { font-size: 15px; font-weight: 800; color: #171C2B; } .hh small { color: #8C95A8; font-size: 12px; }
    .hh button { margin-left: auto; }
    .he { padding: 12px 18px; border-bottom: 1px solid #EEF1F6; display: grid; grid-template-columns: 84px 1fr; gap: 6px 14px; }
    .he:last-child { border-bottom: 0; }
    .he .v { font-weight: 800; font-size: 13px; color: #3D5AF1; font-variant-numeric: tabular-nums; } .he .v.cur { color: #1E9E66; }
    .he .d { grid-column: 1; font-size: 11px; color: #8C95A8; white-space: nowrap; }
    .he ul { grid-column: 2; grid-row: 1 / span 2; margin: 0; padding-left: 16px; font-size: 13px; color: #171C2B; line-height: 1.5; }
    .he li + li { margin-top: 3px; }
    @media (max-width: 640px) { .who { display: none; } a.brand span { display: none; } .in { padding: 0 12px; } }
  `;
  class UNav extends HTMLElement {
    connectedCallback() {
      const pv = parseInt(this.getAttribute('page-v') || '0', 10);
      if (pv && pv < PAGE_V) { try { const k = 'udongji-reload-' + PAGE_V; if (!sessionStorage.getItem(k)) { sessionStorage.setItem(k, '1'); fetch(location.href, { cache: 'reload' }).catch(() => {}).then(() => location.reload()); return; } } catch (e) {} }
      if (!document.querySelector('link[rel="icon"]')) { const l = document.createElement('link'); l.rel = 'icon'; l.type = 'image/svg+xml'; l.href = ICON; document.head.appendChild(l); }
      const cur = this.getAttribute('current') || '';
      const root = this.attachShadow({ mode: 'open' });
      const href = p => isDeploy ? p.dep : p.file;
      root.innerHTML = `<style>${css}</style><div class="bar"><div class="in">
        <a class="brand" href="${href(PAGES[0])}"><img class="mark" src="${ICON}" alt=""><span>우동지CRM</span></a>
        <nav>${PAGES.map(p => `<a href="${href(p)}" class="${p.key === cur ? 'on' : ''}" ${p.admin ? 'data-admin hidden' : ''}>${p.label}</a>`).join('')}<a id="adm" href="${href(ADMIN_PAGE)}" class="${ADMIN_PAGE.key === cur ? 'on' : ''}" hidden style="color:#D93A4A">${ADMIN_PAGE.label}</a></nav>
        <div class="right"><span class="ver" id="ver" title="배포 이력 보기" role="button" tabindex="0">${VERSION}</span><span class="who" id="who"></span><button type="button" id="out" hidden>로그아웃</button></div>
      </div></div>
      <div class="hb" id="hb"><div class="hp" role="dialog" aria-label="배포 이력">
        <div class="hh"><b>배포 이력</b><small>현재 ${VERSION}</small><button type="button" id="hx">닫기</button></div>
        ${HISTORY.map(h => `<div class="he"><span class="v ${h.v === PAGE_V ? 'cur' : ''}">v${h.v}</span><span class="d">${h.d}</span><ul>${h.c.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
      </div></div>`;
      const hb = root.getElementById('hb'), ver = root.getElementById('ver');
      const openH = () => { hb.classList.add('on'); }, closeH = () => { hb.classList.remove('on'); };
      ver.onclick = openH; ver.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openH(); } };
      root.getElementById('hx').onclick = closeH; hb.onclick = e => { if (e.target === hb) closeH(); };
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeH(); });
      const who = root.getElementById('who'), out = root.getElementById('out'), adm = root.getElementById('adm');
      const lib = this.getAttribute('lib') || './udongji-fb.js?v=6';
      import(lib).then(async m => { await m.init(); if (m.isSignedIn()) { who.textContent = m.userEmail(); out.hidden = false; out.onclick = async () => { await m.signOut(); location.href = href(PAGES[0]); }; if (await m.isAdmin(m.userEmail())) { adm.hidden = false; root.querySelectorAll('[data-admin]').forEach(a => { a.hidden = false; }); } } }).catch(() => {});
    }
  }
  if (!customElements.get('udongji-nav')) customElements.define('udongji-nav', UNav);
})();
