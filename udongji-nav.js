// 우동지 공용 상단 내비 <udongji-nav current="consult">
(function () {
  const VERSION = 'v45 · 2026-09-12';
  // 배포 이력 — 새 배포마다 맨 앞에 한 줄 추가
  const HISTORY = [
    { v: 45, d: '2026-09-12', c: ['KPI 대시보드 신설: 상담사별 신규 고객 → 수취자료 → 페이앤 이관 → 전자서명 → 커넥트 배송 전환율', '기간·전환율 기준·지연 기준 선택, 칸을 누르면 해당 고객 목록 표시'] },
    { v: 44, d: '2026-09-10', c: ['홈의 상담 업무 카드를 파란 그라데이션으로 강조 — 주 업무가 한눈에 보이도록'] },
    { v: 43, d: '2026-09-10', c: ['상단 메뉴에 "사용법" 추가 — 로그인부터 상담·재연락·계약·고객 목록·상담시간까지 업무별 안내와 자주 묻는 질문'] },
    { v: 42, d: '2026-09-10', c: ['상단 메뉴를 항목별 버튼으로 분리하고 아이콘 추가 — 현재 페이지는 파란 채움, 관리자 메뉴는 점선 테두리', '홈 업무 카드 아이콘을 메뉴와 통일, 카드에 녹아드는 큰 워터마크 스타일로'] },
    { v: 41, d: '2026-09-10', c: ['지도 버튼: 매장명만으로 네이버 지도 검색 (주소를 같이 넣어 검색이 어긋나던 문제 수정)'] },
    { v: 40, d: '2026-09-10', c: ['연락처 입력 시 하이픈 자동 삽입 · 숫자 11자 제한 (010-0000-0000, 02-123-2020, 031-123-4567 모두 인식)', '고객 목록 수정란에도 동일 적용'] },
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
  const PAGE_V = 45;
  const PAGES = [
    { key: 'home', label: '홈', file: '우동지 홈.dc.html', dep: 'index.html' },
    { key: 'consult', label: '상담 업무', file: '우동지 상담 스크립트.dc.html', dep: 'consult.html' },
    { key: 'recall', label: '재연락', file: '우동지 재연락.dc.html', dep: 'recall.html' },
    { key: 'contract', label: '계약 업무', file: '우동지 계약 업무.dc.html', dep: 'contract.html' },
    { key: 'customers', label: '고객 목록', file: '우동지 고객 목록.dc.html', dep: 'customers.html' },
    { key: 'kpi', label: 'KPI', file: '우동지 KPI 대시보드.dc.html', dep: 'kpi.html' },
    { key: 'hours', label: '상담시간', file: '우동지 상담시간.dc.html', dep: 'hours.html', admin: true },
    { key: 'guide', label: '사용법', file: '우동지 사용법.dc.html', dep: 'guide.html', help: true }
  ];
  const ADMIN_PAGE = { key: 'admin', label: '관리자', file: '우동지 관리자.dc.html', dep: 'admin.html' };
  const NAV_ICONS = {"home":"<path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V21h14V9.5\"/><path d=\"M10 21v-6h4v6\"/>","consult":"<path d=\"M4 13a8 8 0 0 1 16 0\"/><path d=\"M4 13v4a2 2 0 0 0 2 2h1v-6H4z\"/><path d=\"M20 13v4a2 2 0 0 1-2 2h-1v-6h3z\"/><path d=\"M17 19v1a2 2 0 0 1-2 2h-3\"/>","recall":"<path d=\"M21 12a9 9 0 1 1-3-6.7\"/><path d=\"M21 3v5h-5\"/><path d=\"M12 8v4l3 2\"/>","contract":"<path d=\"M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z\"/><path d=\"M14 3v6h6\"/><path d=\"M8 17c1-1.5 2-1.5 3 0s2 1.5 3 0\"/>","customers":"<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0 1 13 0\"/><path d=\"M16 4.5a3.5 3.5 0 0 1 0 7\"/><path d=\"M17.5 14a6.5 6.5 0 0 1 4 6\"/>","hours":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3.5 2\"/>","admin":"<path d=\"M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z\"/><path d=\"m9 12 2 2 4-4\"/>"};
  NAV_ICONS.kpi = '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/>';
  NAV_ICONS.guide = '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/>';
  const icon = k => NAV_ICONS[k] ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${NAV_ICONS[k]}</svg>` : '';
  const ICON = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#3D5AF1"/><path d="M20 14v24a12 12 0 0 0 24 0V14" fill="none" stroke="#fff" stroke-width="10"/><circle cx="46" cy="16" r="11" fill="#3D5AF1"/><circle cx="46" cy="16" r="7" fill="#FF4D5E"/></svg>');
  const isDeploy = !/\.dc\.html$/.test(location.pathname) && !/\.dc\.html/.test(decodeURIComponent(location.pathname));
  const css = `
    :host { display: block; position: sticky; top: 0; z-index: 10; font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; letter-spacing: -0.01em; }
    .bar { background: rgba(255,255,255,.92); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid #E4E8F0; }
    .in { max-width: 1400px; margin: 0 auto; padding: 0 20px; height: 52px; display: flex; align-items: center; gap: 4px; }
    a.brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #171C2B; font-weight: 800; font-size: 15px; margin-right: 14px; white-space: nowrap; }
    a.brand .mark { width: 28px; height: 28px; display: block; }
    nav { display: flex; align-items: center; gap: 10px; flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; }
    nav .grp { display: flex; gap: 6px; flex: none; }
    nav .grp[hidden] { display: none; }
    nav .sep { width: 1px; height: 22px; background: #E4E8F0; flex: none; }
    nav .sep[hidden] { display: none; }
    nav::-webkit-scrollbar { display: none; }
    nav a svg { width: 15px; height: 15px; flex: none; opacity: .7; }
    nav a.on svg { opacity: 1; }
    nav a { display: inline-flex; align-items: center; gap: 6px; text-decoration: none; color: #58627A; font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: 8px; border: 1px solid #E4E8F0; background: #fff; white-space: nowrap; transition: background .12s, color .12s, border-color .12s; }
    nav a:hover { background: #F6F8FC; color: #171C2B; border-color: #C9D0DE; }
    nav a.on { background: #3D5AF1; border-color: #3D5AF1; color: #fff; font-weight: 700; }
    nav a.on svg { opacity: 1; }
    nav .adm a { color: #8C95A8; border-style: dashed; }
    nav .adm a.on { background: #D93A4A; border-color: #D93A4A; border-style: solid; color: #fff; }
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
        <nav><div class="grp">${PAGES.filter(p => !p.admin && !p.help).map(p => `<a href="${href(p)}" class="${p.key === cur ? 'on' : ''}">${icon(p.key)}${p.label}</a>`).join('')}</div><span class="sep"></span><div class="grp">${PAGES.filter(p => p.help).map(p => `<a href="${href(p)}" class="${p.key === cur ? 'on' : ''}">${icon(p.key)}${p.label}</a>`).join('')}</div><span class="sep" data-admin hidden></span><div class="grp adm" data-admin hidden>${PAGES.filter(p => p.admin).map(p => `<a href="${href(p)}" class="${p.key === cur ? 'on' : ''}">${icon(p.key)}${p.label}</a>`).join('')}<a id="adm" href="${href(ADMIN_PAGE)}" class="${ADMIN_PAGE.key === cur ? 'on' : ''}">${icon('admin')}${ADMIN_PAGE.label}</a></div></nav>
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
