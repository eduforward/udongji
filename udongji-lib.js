// 우동지 공용: 열 정의 · 텍스트 생성 · 구글 시트 연동 (OAuth + Sheets API, 브라우저 직접 호출)
export const COLS = [{"g":"식별","name":"고객번호","opts":null},{"g":"식별","name":"고객명","opts":null},{"g":"고객 기본정보","name":"연락처","opts":null},{"g":"고객 기본정보","name":"이메일","opts":null},{"g":"고객 기본정보","name":"영문 성함","opts":null},{"g":"고객 기본정보","name":"매장명","opts":null},{"g":"고객 기본정보","name":"매장 주소","opts":null},{"g":"고객 기본정보","name":"업종","opts":null},{"g":"고객 기본정보","name":"판매 물품","opts":null},{"g":"고객 기본정보","name":"매장 구분","opts":["신규 오픈","기존 운영"]},{"g":"고객 기본정보","name":"상담일","opts":null},{"g":"고객 기본정보","name":"상담자","opts":null},{"g":"공통","name":"인터넷 회선(랜선) 보유","opts":["O","X"]},{"g":"공통","name":"랜선 직접 준비 안내","opts":["O","X"]},{"g":"공통","name":"인터넷 변경/신규 필요","opts":["필요","불필요"]},{"g":"공통","name":"인터넷 상담 요청 일정","opts":null},{"g":"공통","name":"인테리어 타공","opts":["O","X","해당없음"]},{"g":"공통","name":"사업자번호","opts":null},{"g":"공통","name":"대형/개인/법인","opts":["대형","개인","법인"]},{"g":"공통","name":"단독/공동","opts":["단독","공동"]},{"g":"공통","name":"배달 필요 여부","opts":["없음","위젯만","매출연동"]},{"g":"공통","name":"POS 프로그램","opts":["사용 안 함","페이앤","오케이","기타"]},{"g":"공통","name":"안내한 상품 구성","opts":null},{"g":"공통","name":"월 이용요금","opts":null},{"g":"공통","name":"VAN","opts":["NICE","KIS"]},{"g":"공통","name":"기기 색상","opts":["블랙","화이트"]},{"g":"공통","name":"특이사항","opts":null},{"g":"공통","name":"기타 상담 내용","opts":null},{"g":"공통","name":"개인정보 제3자 제공 동의","opts":["O","X"]},{"g":"공통","name":"우동지 수신 동의","opts":["O","X"]},{"g":"공통","name":"네이버 ID","opts":null},{"g":"공통","name":"서류 분류","opts":null},{"g":"공통","name":"서류 수취 완료","opts":["O","X"]},{"g":"공통","name":"링크 접수 완료","opts":["O","X"]},{"g":"신규 오픈","name":"오픈 예정일","opts":null},{"g":"신규 오픈","name":"사업자등록증 발급","opts":["발급 완료","발급 예정"]},{"g":"기존 운영","name":"현재 운영 방식","opts":null},{"g":"기존 운영","name":"현재 단말기·POS","opts":null},{"g":"기존 운영","name":"기존 장비 모델명","opts":null},{"g":"기존 운영","name":"장비 사진","opts":["O","X"]},{"g":"기존 운영","name":"약정 잔여 개월","opts":null},{"g":"기존 운영","name":"월 납부금","opts":null},{"g":"기존 운영","name":"VAN 유실적 — NICE","opts":["무실적","유실적","모름"]},{"g":"기존 운영","name":"VAN 유실적 — KIS","opts":["무실적","유실적","모름"]},{"g":"기존 운영","name":"관리자 전달","opts":["O","X"]},{"g":"진행","name":"상담 결과","opts":["상담 진행","상담 불가","상담 거부"]},{"g":"진행","name":"상태","opts":["상담 중","서류 발송","밴 조회 대기","서명 완료","재연락 예정","보류","종료"]},{"g":"진행","name":"다음 액션 · 일시","opts":null}];
export const ID_COL = '레코드ID', REG_COL = '페이앤 등록';

export function norm(x) { return String(x == null ? '' : x).replace(/\s+/g, '').replace(/\//g, '·'); }
const byNorm = {}; COLS.forEach(c => { byNorm[norm(c.name)] = c; });
export function colOf(name) { return byNorm[norm(name)] || null; }
export function keyOf(header) { const c = colOf(header); return c ? c.name : String(header || '').trim(); }

export function fmtPhone(v) { const d = String(v || '').replace(/\D/g, ''); if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); if (d.length === 10) return d.slice(0, 2) === '02' ? d.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3') : d.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); if (d.length === 9 && d.slice(0, 2) === '02') return d.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3'); return String(v || '').trim(); }
export function fmtBiz(v) { const d = String(v || '').replace(/\D/g, ''); return d.length === 10 ? d.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : String(v || '').trim(); }
export function val(d, k) { const v = String((d || {})[k] || '').replace(/[\t\r\n]+/g, ' ').trim(); if (k === '연락처') return fmtPhone(v); if (k === '사업자번호') return fmtBiz(v); return v; }

export function buildTSV(d) { return COLS.slice(1).map(c => val(d, c.name)).join('\t'); }

export function buildPayn(d) {
  const v = k => val(d, k), isNew = v('매장 구분') === '신규 오픈', r = v('상담 결과');
  if (r && r !== '상담 진행') return ['[' + r + '] ' + (v('매장명') || v('고객명')), '· 대표 / 연락처 : ' + v('고객명') + ' / ' + v('연락처'), '· 상태 : ' + v('상태'), r === '상담 불가' ? '· 다음 연락 : ' + v('다음 액션 · 일시') : '· 메모 : ' + v('특이사항')].join('\n');
  const L = [];
  L.push('[' + (isNew ? '신규 매장' : '기존 운영 매장') + ' 상담 접수] ' + v('매장명') + (v('매장 주소') ? ' (' + v('매장 주소') + ')' : ''));
  L.push('· 대표 / 연락처 : ' + v('고객명') + ' / ' + v('연락처'));
  L.push('· 업종 : ' + v('업종') + (v('판매 물품') ? ' — ' + v('판매 물품') : ''));
  L.push(isNew ? '· 오픈 예정일 : ' + v('오픈 예정일') + (v('사업자등록증 발급') ? ' (' + v('사업자등록증 발급') + ')' : '') : '· 현재 운영 방식 : ' + v('현재 운영 방식'));
  L.push('· 인터넷 회선(랜선) 보유 여부 : ' + v('인터넷 회선(랜선) 보유') + (v('인터넷 변경/신규 필요') ? ' / 변경·신규 ' + v('인터넷 변경/신규 필요') : ''));
  L.push('· 커넥트 설치 시 랜선 직접 준비 안내 여부 : ' + v('랜선 직접 준비 안내'));
  L.push('· 사업자번호 : ' + v('사업자번호'));
  L.push('· 대형 / 개인 / 법인 / 단독 / 공동 : ' + [v('대형/개인/법인'), v('단독/공동')].filter(Boolean).join(' / '));
  L.push('· 안내한 상품 구성 및 월 이용요금 : ' + v('안내한 상품 구성') + (v('월 이용요금') ? ' / 월 ' + v('월 이용요금') + '원' : ''));
  L.push('· POS 프로그램 사용 여부 : ' + v('POS 프로그램') + (!isNew && v('현재 단말기·POS') ? ' (현재 ' + v('현재 단말기·POS') + ')' : ''));
  L.push('· VAN : ' + v('VAN'));
  L.push('· 배달 필요 여부 : ' + v('배달 필요 여부'));
  if (v('인터넷 상담 요청 일정') || v('매장 주소')) L.push('· 인터넷 상담 : ' + v('매장 주소') + ' / ' + v('인터넷 상담 요청 일정'));
  L.push('· 인테리어 타공 : ' + v('인테리어 타공'));
  L.push('· 기기 색상 : ' + v('기기 색상'));
  if (!isNew) { L.push('· VAN 전산 유실적 : NICE ' + v('VAN 유실적 — NICE') + ' / KIS ' + v('VAN 유실적 — KIS')); L.push('· 기존 약정 : 잔여 ' + v('약정 잔여 개월') + '개월 / 월 ' + v('월 납부금') + '원'); }
  L.push('· 특이사항 : ' + v('특이사항'));
  L.push('· 기타 상담 내용 : ' + v('기타 상담 내용'));
  L.push('· 서류 : 통화 후 카톡 수취 예정' + (v('서류 분류') ? ' / ' + v('서류 분류') : ''));
  return L.join('\n');
}

export function buildSMS(d) {
  const v = k => val(d, k);
  const name = v('고객명') ? v('고객명') + ' 대표님' : '대표님', agent = v('상담자') || '담당자';
  const head = '[우동지] ' + name + ', 우동지 ' + agent + '입니다.', tail = '\n\n궁금한 점은 이 번호로 카톡 주시면 바로 답드릴게요.\n감사합니다.';
  const r = v('상담 결과');
  if (r === '상담 거부') return { kind: '상담 거부 · 마무리 인사', text: head + '\n오늘 시간 내주셔서 감사합니다.\n나중에 네이버 플레이스나 결제 쪽 도움이 필요하시면 언제든 이 번호로 연락 주세요.' + tail };
  if (r === '상담 불가' || v('상태') === '재연락 예정') { const when = v('다음 액션 · 일시') || '○월 ○일'; return { kind: '재연락 안내', text: head + '\n오늘 통화 감사합니다. 말씀해주신 대로 ' + when + '에 다시 연락드리겠습니다.\n그 전에 준비되시면 미리 보내주셔도 좋아요.' + tail }; }
  const isNew = v('매장 구분') === '신규 오픈', corp = v('대형/개인/법인') === '법인', joint = v('단독/공동') === '공동';
  const food = /음식|식당|카페|주점|치킨|피자|분식|베이커리|제과|호프|술/.test(v('업종'));
  const docs = ['1. 사업자등록증 (최근 발급본, 가리는 곳 없이)', '2. 대표님 신분증 (주민등록증 또는 운전면허증 — 여권 불가)', '3. 정산받으실 통장 사본 (모바일 캡처 가능' + (corp ? ', 예금주 = 법인명' : '') + ')'];
  let n = 4;
  if (food) docs.push((n++) + '. 영업신고증');
  docs.push((n++) + '. 매장 사진 — 간판 나오는 바깥 사진 2장, 안쪽 전체 사진 2장\n   (간판이 없으면: 건물 바깥 1장, 입구에서 안이 보이게 1장, 도로명주소 표지판 1장, 안쪽 전체 2장)');
  if (corp) docs.push((n++) + '. 법인: 등기부등본, 인감증명서(3개월 이내), 주주명부, 소유지배자 확인서\n   (사용인감 쓰시면 사용인감계도)');
  if (joint) docs.push((n++) + '. 공동대표: 가입 동의·위임장, 결제계좌 동의서, 공동대표님 신분증·연락처\n   (서식은 따로 보내드릴게요)');
  const extra = [];
  if (!v('네이버 ID')) extra.push('네이버 아이디 (대표님 개인 명의 계정)');
  if (isNew && !corp && !v('영문 성함')) extra.push('성함 영문 표기 (여권 기준)');
  if (!v('이메일')) extra.push('이메일 주소');
  let body = head + '\n오늘 통화 감사합니다. 안내드린 대로 아래 서류를 이 번호로 카톡/문자로 보내주시면 제가 접수까지 넣어드릴게요. 휴대폰으로 찍으신 사진으로 충분합니다.\n\n' + docs.join('\n');
  if (extra.length) body += '\n\n함께 알려주세요:\n- ' + extra.join('\n- ');
  const summary = [];
  if (v('안내한 상품 구성')) summary.push('구성: ' + v('안내한 상품 구성') + (v('월 이용요금') ? ' / 월 ' + v('월 이용요금') + '원' : ''));
  if (v('기기 색상')) summary.push('기기 색상: ' + v('기기 색상'));
  if (v('VAN')) summary.push('밴사: ' + v('VAN'));
  if (summary.length) body += '\n\n오늘 정리된 내용\n- ' + summary.join('\n- ');
  if (v('랜선 직접 준비 안내') === 'O') body += '\n\n설치는 택배 자가설치가 기본이며, 랜선 케이블은 직접 준비해주셔야 합니다 (다이소·온라인 몇 천 원).';
  body += '\n\n서류 접수 후 페이앤에서 전자계약서가 카톡으로 발송되며, 서명하시면 완료됩니다.' + (joint ? ' 공동대표님도 함께 서명하셔야 합니다.' : '');
  if (v('상태') === '밴 조회 대기') body += '\n\n밴 등록 조회 결과는 나오는 대로 바로 연락드리겠습니다.';
  return { kind: (isNew ? '신규 오픈' : '기존 운영') + ' · 서류 안내', text: body + tail };
}

// ───────── 구글 시트 연동 ─────────
const CFG_KEY = 'udongji-gsheet-cfg', TOK_KEY = 'udongji-gtoken';
// 기본 연결값 (관리자가 설정에서 덤어쓸 수 있음)
export const DEFAULT_CFG = { clientId: '400925977165-l9e7jj8vkh3t9lu7k32vq2m8jtqgrb26.apps.googleusercontent.com', sheetId: '1FXAdF7g2rlGvPlTdixoDUNogSFe2Q8LlBKmG5pc7k44', tab: '고객목록', folderId: '0AISqPUckBM19Uk9PVA' };
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email';
export function getCfg() { try { const saved = JSON.parse(localStorage.getItem(CFG_KEY) || '{}'); const c = Object.assign({}, DEFAULT_CFG); for (const k of ['clientId', 'sheetId', 'tab', 'folderId']) if (saved[k] && String(saved[k]).trim()) c[k] = saved[k]; return c; } catch (e) { return Object.assign({}, DEFAULT_CFG); } }
export function setCfg(c) { const cur = getCfg(); const next = Object.assign(cur, c); next.sheetId = parseSheetId(next.sheetId); next.folderId = parseFolderId(next.folderId); try { localStorage.setItem(CFG_KEY, JSON.stringify(next)); } catch (e) {} return next; }
export function parseFolderId(s) { const m = /\/folders\/([a-zA-Z0-9-_]+)/.exec(String(s || '')); return m ? m[1] : String(s || '').trim(); }
export function parseSheetId(s) { const m = /\/d\/([a-zA-Z0-9-_]+)/.exec(String(s || '')); return m ? m[1] : String(s || '').trim(); }
export function isConfigured() { const c = getCfg(); return !!(c.clientId && c.sheetId && c.tab); }
export function getToken() { try { const t = JSON.parse(localStorage.getItem(TOK_KEY) || sessionStorage.getItem(TOK_KEY) || 'null'); return t && t.exp > Date.now() ? t : null; } catch (e) { return null; } }
export function hasEverSignedIn() { try { return !!localStorage.getItem(TOK_KEY + '-hint'); } catch (e) { return false; } }
export function isSignedIn() { return !!getToken(); }
export function userEmail() { const t = getToken(); return t ? (t.email || '') : ''; }
export function clearToken() { try { localStorage.removeItem(TOK_KEY); sessionStorage.removeItem(TOK_KEY); } catch (e) {} }
function gis() { return new Promise((res, rej) => { let n = 0; const t = () => { if (window.google && window.google.accounts && window.google.accounts.oauth2) return res(window.google); if (++n > 100) return rej(new Error('구글 로그인 스크립트를 불러오지 못했어요 (네트워크/차단 확인)')); setTimeout(t, 100); }; t(); }); }
export async function signIn(interactive = true) {
  const cfg = getCfg(); if (!cfg.clientId) throw new Error('OAuth 클라이언트 ID가 없어요. 홈 → 구글 시트 연결에서 입력하세요.');
  const g = await gis();
  return new Promise((res, rej) => {
    const tc = g.accounts.oauth2.initTokenClient({
      client_id: cfg.clientId, scope: SCOPE,
      callback: async r => {
        if (r.error) return rej(new Error(r.error_description || r.error));
        const tok = { access_token: r.access_token, exp: Date.now() + (Number(r.expires_in || 3600) - 60) * 1000, email: '' };
        try { const u = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: 'Bearer ' + r.access_token } }).then(x => x.json()); tok.email = u.email || ''; } catch (e) {}
        try { localStorage.setItem(TOK_KEY, JSON.stringify(tok)); localStorage.setItem(TOK_KEY + '-hint', tok.email || '1'); } catch (e) {}
        res(tok);
      },
      error_callback: e => rej(new Error(e && e.type === 'popup_closed' ? '로그인 창이 닫혔어요' : (e && e.message) || '로그인 실패'))
    });
    const hint = (() => { try { return localStorage.getItem(TOK_KEY + '-hint') || ''; } catch (e) { return ''; } })();
    tc.requestAccessToken(interactive ? { prompt: hint ? '' : 'select_account', hint: hint && hint !== '1' ? hint : undefined } : { prompt: '', hint: hint && hint !== '1' ? hint : undefined });
  });
}
// 만료 시 조용히 재로그인 시도(이전에 동의한 계정이면 팝업이 바로 닫힘). 실패하면 null.
export async function ensureSignedIn() {
  if (getToken()) return getToken();
  if (!isConfigured() || !hasEverSignedIn()) return null;
  try { return await signIn(false); } catch (e) { return null; }
}
export async function signOut() { const t = getToken(); clearToken(); try { localStorage.removeItem(TOK_KEY + '-hint'); } catch (e) {} try { const g = await gis(); if (t) g.accounts.oauth2.revoke(t.access_token, () => {}); } catch (e) {} }

const q = s => encodeURIComponent(s);
async function api(path, opt = {}) {
  let t = getToken(); if (!t) t = await ensureSignedIn(); if (!t) throw new Error('로그인이 필요해요. 홈에서 구글 계정으로 로그인하세요.');
  const cfg = getCfg();
  const r = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + cfg.sheetId + path, Object.assign({}, opt, { headers: Object.assign({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + t.access_token }, opt.headers || {}) }));
  if (r.status === 401) { clearToken(); const t2 = await ensureSignedIn(); if (t2 && !opt._retry) return api(path, Object.assign({}, opt, { _retry: true })); throw new Error('로그인이 만료됐어요. 다시 로그인하세요.'); }
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error((e.error && e.error.message) || ('HTTP ' + r.status)); }
  return r.json();
}
function colLetter(n) { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
export async function getHeader() { const cfg = getCfg(); const res = await api('/values/' + q(cfg.tab + '!1:1')); return ((res.values || [[]])[0] || []).map(h => String(h)); }
export const FULL_HEADER = () => COLS.map(c => c.name).concat([ID_COL, REG_COL]);
// 헤더 보증: 바른 헤더가 있으면 그대로(무는 열만 덧붙임), 본문 열이 하나도 없으면(빈 시트 / ID·등록만 있는 시트) 전체 헤더로 교체
export async function ensureHeader() {
  const cfg = getCfg(); const h = await getHeader();
  const hasBody = h.some(x => { const k = colOf(x); return k && k.name !== '고객번호'; });
  if (!hasBody) {
    const header = FULL_HEADER();
    await api('/values/' + q(cfg.tab + '!1:1') + '?valueInputOption=RAW', { method: 'PUT', body: JSON.stringify({ range: cfg.tab + '!1:1', majorDimension: 'ROWS', values: [header] }) });
    // 기존에 ID·등록만 있던 헤더로 들어간 행들을 새 열 위치로 이동
    if (h.length) {
      const res = await api('/values/' + q(cfg.tab) + '?majorDimension=ROWS'); const rows = res.values || [];
      const fixed = [];
      for (let i = 1; i < rows.length; i++) { const r = rows[i] || []; const d = {}; h.forEach((name, j) => { d[keyOf(name)] = r[j] == null ? '' : r[j]; }); fixed.push(header.map(name => d[keyOf(name)] || '')); }
      if (fixed.length) await api('/values/' + q(cfg.tab + '!A2') + '?valueInputOption=USER_ENTERED', { method: 'PUT', body: JSON.stringify({ values: fixed }) });
    }
    try { await styleHeader(); } catch (e) {}
    return header;
  }
  return ensureColumns(h, [ID_COL, REG_COL]);
}
async function styleHeader() {
  const cfg = getCfg(); const meta = await api('?fields=sheets.properties'); const sh = (meta.sheets || []).find(s => s.properties && s.properties.title === cfg.tab); if (!sh) return;
  await api(':batchUpdate', { method: 'POST', body: JSON.stringify({ requests: [{ updateSheetProperties: { properties: { sheetId: sh.properties.sheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 2 } }, fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount' } }, { repeatCell: { range: { sheetId: sh.properties.sheetId, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.93, green: 0.95, blue: 1 } } }, fields: 'userEnteredFormat(textFormat,backgroundColor)' } }] }) });
}
export async function initHeaderIfEmpty() { const before = await getHeader(); const header = await ensureHeader(); return { created: !before.some(x => colOf(x) && colOf(x).name !== '고객번호'), header }; }
export async function listTabs() { const meta = await api('?fields=sheets.properties.title'); return (meta.sheets || []).map(s => s.properties.title); }
export async function ensureColumns(header, names) {
  const cfg = getCfg(); const missing = names.filter(n => !header.some(h => norm(h) === norm(n))); if (!missing.length) return header;
  const next = header.concat(missing);
  await api('/values/' + q(cfg.tab + '!1:1') + '?valueInputOption=RAW', { method: 'PUT', body: JSON.stringify({ range: cfg.tab + '!1:1', majorDimension: 'ROWS', values: [next] }) });
  return next;
}
export function rowFor(header, d, extra = {}) { return header.map(h => { const key = keyOf(h); if (!key) return ''; if (extra[key] !== undefined) return extra[key]; return val(d, key); }); }
export async function readAll() {
  const cfg = getCfg(); const res = await api('/values/' + q(cfg.tab) + '?majorDimension=ROWS');
  const rows = res.values || [], header = (rows[0] || []).map(h => String(h)), items = [];
  for (let i = 1; i < rows.length; i++) { const r = rows[i] || []; if (!r.some(x => String(x).trim())) continue; const d = {}; header.forEach((h, j) => { const key = keyOf(h); if (key) d[key] = r[j] == null ? '' : String(r[j]); }); items.push({ row: i + 1, data: d }); }
  return { header, items };
}
export async function appendRecord(d, id) {
  const cfg = getCfg(); const header = await ensureHeader();
  const res = await api('/values/' + q(cfg.tab + '!A1') + ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS', { method: 'POST', body: JSON.stringify({ values: [rowFor(header, d, { [ID_COL]: id })] }) });
  const m = /![A-Z]+(\d+)(?::|$)/.exec((res.updates && res.updates.updatedRange) || ''); return m ? Number(m[1]) : null;
}
export async function findRowById(id) { const { items } = await readAll(); const it = items.find(x => x.data[ID_COL] === id); return it ? it.row : null; }
export async function updateRecord(row, d, id) {
  const cfg = getCfg(); const header = await ensureHeader();
  const regIdx = header.findIndex(h => norm(h) === norm(REG_COL));
  const cur = await api('/values/' + q(cfg.tab + '!' + colLetter(regIdx + 1) + row)).catch(() => ({}));
  const reg = cur.values && cur.values[0] ? cur.values[0][0] : '';
  await api('/values/' + q(cfg.tab + '!A' + row) + '?valueInputOption=USER_ENTERED', { method: 'PUT', body: JSON.stringify({ values: [rowFor(header, d, { [ID_COL]: id, [REG_COL]: reg || '' })] }) });
}
export async function setCell(row, headerName, value) {
  const cfg = getCfg(); let header = await getHeader(); header = await ensureColumns(header, [headerName]);
  const idx = header.findIndex(h => norm(h) === norm(headerName));
  await api('/values/' + q(cfg.tab + '!' + colLetter(idx + 1) + row) + '?valueInputOption=USER_ENTERED', { method: 'PUT', body: JSON.stringify({ values: [[value]] }) });
}
// 행 삭제 (시트에서 행 자체를 제거)
export async function deleteRow(row) {
  const cfg = getCfg(); const meta = await api('?fields=sheets.properties'); const sh = (meta.sheets || []).find(s => s.properties && s.properties.title === cfg.tab); if (!sh) throw new Error('탭을 찾지 못했어요');
  await api(':batchUpdate', { method: 'POST', body: JSON.stringify({ requests: [{ deleteDimension: { range: { sheetId: sh.properties.sheetId, dimension: 'ROWS', startIndex: row - 1, endIndex: row } } }] }) });
}
// 여러 셀 한 번에 수정: patch = { 열이름: 값 }
export async function updateCells(row, patch) {
  const cfg = getCfg(); let header = await getHeader(); header = await ensureColumns(header, Object.keys(patch));
  const data = Object.keys(patch).map(k => { const idx = header.findIndex(h => norm(h) === norm(k)); return { range: cfg.tab + '!' + colLetter(idx + 1) + row, values: [[patch[k] == null ? '' : String(patch[k])]] }; });
  await api('/values:batchUpdate', { method: 'POST', body: JSON.stringify({ valueInputOption: 'USER_ENTERED', data }) });
}
export function todayStr() { const t = new Date(), p = n => String(n).padStart(2, '0'); return t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate()); }

// ──── 슈퍼관리자: 시트의 '관리자' 탭에 이메일 목록. 코드 기본 관리자는 항상 포함.
export const ROOT_ADMINS = ['daylightism@gmail.com'];
const ADMIN_TAB = '관리자';
async function ensureAdminTab() {
  const meta = await api('?fields=sheets.properties.title'); const tabs = (meta.sheets || []).map(s => s.properties.title);
  if (tabs.includes(ADMIN_TAB)) return;
  await api(':batchUpdate', { method: 'POST', body: JSON.stringify({ requests: [{ addSheet: { properties: { title: ADMIN_TAB } } }] }) });
  await api('/values/' + q(ADMIN_TAB + '!A1') + '?valueInputOption=RAW', { method: 'PUT', body: JSON.stringify({ values: [['이메일', '추가일', '추가한 사람']] }) });
}
export async function listAdmins() {
  try { const res = await api('/values/' + q(ADMIN_TAB + '!A2:C')); return (res.values || []).filter(r => r[0] && String(r[0]).trim()).map(r => ({ email: String(r[0]).trim().toLowerCase(), at: r[1] || '', by: r[2] || '' })); }
  catch (e) { return []; }
}
export async function isAdmin(email) {
  const e = String(email || '').trim().toLowerCase(); if (!e) return false;
  if (ROOT_ADMINS.includes(e)) return true;
  const list = await listAdmins(); return list.some(a => a.email === e);
}
export async function addAdmin(email, by) {
  const e = String(email || '').trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error('이메일 형식이 아니에요');
  await ensureAdminTab();
  const list = await listAdmins(); if (ROOT_ADMINS.includes(e) || list.some(a => a.email === e)) throw new Error('이미 관리자예요');
  await api('/values/' + q(ADMIN_TAB + '!A1') + ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', { method: 'POST', body: JSON.stringify({ values: [[e, todayStr(), by || '']] }) });
}
export async function removeAdmin(email) {
  const e = String(email || '').trim().toLowerCase(); if (ROOT_ADMINS.includes(e)) throw new Error('기본 관리자는 해제할 수 없어요');
  const res = await api('/values/' + q(ADMIN_TAB + '!A2:A')); const rows = res.values || [];
  const i = rows.findIndex(r => String(r[0] || '').trim().toLowerCase() === e); if (i < 0) return;
  const meta = await api('?fields=sheets.properties'); const sh = (meta.sheets || []).find(s => s.properties.title === ADMIN_TAB);
  await api(':batchUpdate', { method: 'POST', body: JSON.stringify({ requests: [{ deleteDimension: { range: { sheetId: sh.properties.sheetId, dimension: 'ROWS', startIndex: i + 1, endIndex: i + 2 } } }] }) });
}

// ──── 계약 업무: 단계 · 서류 · 파일 ────
export const STAGE_COLS = { docs: '수취 완료일', handoff: '이관일', sign: '서명일', install: '설치일' };
export const DOC_CHECK_COL = '서류 체크', DOC_FILES_COL = '서류 파일', PROGRESS_NOTE_COL = '진행 메모';
export const STAGES = [
  { key: 'docs', label: '수취자료' },
  { key: 'handoff', label: '페이앤 이관' },
  { key: 'sign', label: '전자서명 완료' },
  { key: 'install', label: '커넥트 설치 완료' }
];
// 고객 조건에 따라 필요 서류 목록
export function requiredDocs(d) {
  const v = k => val(d, k), corp = v('대형/개인/법인') === '법인', joint = v('단독/공동') === '공동', isNew = v('매장 구분') === '신규 오픈', isOld = v('매장 구분') === '기존 운영';
  const food = /음식|식당|카페|주점|치킨|피자|분식|베이카리|제과|호프|술|구이|횟집|국수|돈까스|버거|토스트|떡|디저트/.test(v('업종'));
  const list = [
    { id: 'biz', name: '사업자등록증', hint: '최근 발급본, 가리는 곳 없이' },
    { id: 'idcard', name: '대표 신분증', hint: '주민등록증 또는 운전면허증 (여관 불가)' },
    { id: 'bank', name: '정산 통장 사본', hint: corp ? '예금주 = 법인명' : '모바일 캡처 가능' },
    { id: 'photo_out', name: '매장 바깥 사진 2장', hint: '간판 나오게 (간판 없으면 건물 바깥 1 + 입구 1 + 도로명주소 표지판 1)' },
    { id: 'photo_in', name: '매장 안쪽 사진 2장', hint: '전체가 보이게' }
  ];
  if (food) list.push({ id: 'food', name: '영업신고증', hint: '음식점' });
  if (corp) list.push({ id: 'corp', name: '법인 서류', hint: '등기부등본 · 인감증명서(3개월) · 주주명부 · 소유지배자 확인서 (사용인감계)' });
  if (joint) list.push({ id: 'joint', name: '공동대표 서류', hint: '가입 동의·위임장 · 결제계좌 동의서 · 공동대표 신분증·연락처' });
  if (isOld && (v('기존 장비 모델명') || v('현재 단말기·POS'))) list.push({ id: 'device', name: '기존 장비 사진', hint: '포스기·프린터 뒷면 모델명' });
  if (!v('네이버 ID')) list.push({ id: 'naver', name: '네이버 아이디', hint: '대표 개인 명의 계정 (텍스트로 받음)' });
  if (isNew && !corp && !v('영문 성함')) list.push({ id: 'engname', name: '영문 성함', hint: '여관 기준 (텍스트)' });
  return list;
}
export function parseDocCheck(s) { const o = {}; String(s || '').split(',').map(x => x.trim()).filter(Boolean).forEach(x => { o[x] = true; }); return o; }
export function parseDocFiles(s) { try { const j = JSON.parse(s || '[]'); return Array.isArray(j) ? j : []; } catch (e) { return []; } }

// Drive 업로드. 대상 폴더: 설정의 folderId(공유 드라이브/공유 폴더) → 없으면 로그인 계정 "우동지 계약서류"
const FOLDER_KEY = 'udongji-drive-folder';
const SD = '&supportsAllDrives=true&includeItemsFromAllDrives=true';
async function driveApi(path, opt = {}) {
  let t = getToken(); if (!t) t = await ensureSignedIn(); if (!t) throw new Error('로그인이 필요해요.');
  const url = 'https://www.googleapis.com/drive/v3' + path + (path.includes('?') ? SD : '?' + SD.slice(1));
  const r = await fetch(url, Object.assign({}, opt, { headers: Object.assign({ Authorization: 'Bearer ' + t.access_token }, opt.headers || {}) }));
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error((e.error && e.error.message) || ('HTTP ' + r.status)); }
  return r.json();
}
export async function ensureRootFolder() {
  const cfg = getCfg();
  if (cfg.folderId) { await driveApi('/files/' + cfg.folderId + '?fields=id,name,trashed').then(f => { if (f.trashed) throw new Error('설정된 서류 폴더가 휴지통에 있어요'); }); return cfg.folderId; }
  let id = ''; try { id = localStorage.getItem(FOLDER_KEY) || ''; } catch (e) {}
  if (id) { try { await driveApi('/files/' + id + '?fields=id,trashed').then(f => { if (f.trashed) throw new Error('trashed'); }); return id; } catch (e) { id = ''; } }
  const q = encodeURIComponent("name='우동지 계약서류' and mimeType='application/vnd.google-apps.folder' and trashed=false");
  const found = await driveApi('/files?q=' + q + '&fields=files(id)');
  if (found.files && found.files.length) id = found.files[0].id;
  else { const f = await driveApi('/files?fields=id', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: '우동지 계약서류', mimeType: 'application/vnd.google-apps.folder' }) }); id = f.id; }
  try { localStorage.setItem(FOLDER_KEY, id); } catch (e) {}
  return id;
}
export function safeName(s) { return String(s || '').replace(/[\/\\:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim(); }
export async function ensureCustomerFolder(label) {
  const root = await ensureRootFolder();
  const name = safeName(label) || '이름 없음';
  const q = encodeURIComponent("name='" + name.replace(/'/g, "\\'") + "' and '" + root + "' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false");
  const found = await driveApi('/files?q=' + q + '&fields=files(id)');
  if (found.files && found.files.length) return found.files[0].id;
  const f = await driveApi('/files?fields=id', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [root] }) });
  return f.id;
}
// 업로드 전 변환: PNG/WebP/HEIC → JPG, PDF → 페이지별 JPG. 반환: [{blob, ext:'jpg', page}] (이미 JPG면 그대로)
let pdfjsP = null;
function loadPdfjs() {
  if (pdfjsP) return pdfjsP;
  pdfjsP = import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs').then(m => { m.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs'; return m; });
  return pdfjsP;
}
function canvasToJpg(canvas, q = 0.9) { return new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error('이미지 변환 실패')), 'image/jpeg', q)); }
async function drawImageToJpg(file, maxSide = 2400) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('이미지를 열 수 없어요: ' + file.name)); i.src = url; });
    const s = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
    return canvasToJpg(c);
  } finally { URL.revokeObjectURL(url); }
}
export async function toJpgs(file) {
  const type = (file.type || '').toLowerCase(), name = (file.name || '').toLowerCase();
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    const pdfjs = await loadPdfjs();
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const out = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p); const vp0 = page.getViewport({ scale: 1 }); const scale = Math.min(3, 2000 / Math.max(vp0.width, vp0.height)); const vp = page.getViewport({ scale });
      const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      out.push({ blob: await canvasToJpg(c), ext: 'jpg', page: p, pages: pdf.numPages });
    }
    return out;
  }
  if (type === 'image/jpeg' || /\.jpe?g$/.test(name)) return [{ blob: file, ext: 'jpg', page: 1, pages: 1 }];
  if (type.startsWith('image/') || /\.(png|webp|gif|bmp|heic|heif|tiff?)$/.test(name)) {
    try { return [{ blob: await drawImageToJpg(file), ext: 'jpg', page: 1, pages: 1 }]; }
    catch (e) { if (/heic|heif/.test(type + name)) throw new Error('HEIC 파일은 이 보라우저가 열 수 없어요. 아이폰에서 "가장 호환성 높은 형식"으로 받으세요.'); throw e; }
  }
  const ext = (/\.([a-zA-Z0-9]{1,5})$/.exec(name) || [])[1] || 'bin';
  return [{ blob: file, ext, page: 1, pages: 1 }];
}
// 파일명 규칙: [매장명]_[고객명]_[서류명]_[순번].확장자
export function docFileName(d, docName, seq, ext) {
  ext = String(ext || 'jpg').replace(/^\./, '').toLowerCase() || 'jpg';
  const parts = [val(d, '매장명') || '매장', val(d, '고객명') || '고객', docName, String(seq)].map(x => safeName(x).replace(/\s+/g, ''));
  return parts.join('_') + '.' + ext;
}
export async function uploadFile(file, folderId, name) {
  let t = getToken(); if (!t) t = await ensureSignedIn(); if (!t) throw new Error('로그인이 필요해요.');
  const meta = { name: name || file.name || 'file', parents: [folderId] };
  const fd = new FormData();
  fd.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  fd.append('file', file, meta.name);
  const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink,size', { method: 'POST', headers: { Authorization: 'Bearer ' + t.access_token }, body: fd });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error((e.error && e.error.message) || ('HTTP ' + r.status)); }
  return r.json();
}
export async function deleteFile(id) { let t = getToken(); if (!t) t = await ensureSignedIn(); if (!t) throw new Error('로그인이 필요해요.'); const r = await fetch('https://www.googleapis.com/drive/v3/files/' + id + '?supportsAllDrives=true', { method: 'DELETE', headers: { Authorization: 'Bearer ' + t.access_token } }); if (!r.ok && r.status !== 404) throw new Error('HTTP ' + r.status); }
export async function folderInfo(id) { return driveApi('/files/' + id + '?fields=id,name,driveId,webViewLink'); }

// 새 스프레드시트 생성 + 헤더 행 작성 + 설정 저장. 리턴: { id, url }
export async function createSheet(title = '우동지 고객 목록', tab = '고객목록') {
  const t = getToken() || await ensureSignedIn(); if (!t) throw new Error('로그인이 필요해요.');
  const header = COLS.map(c => c.name).concat([ID_COL, REG_COL]);
  const body = {
    properties: { title, locale: 'ko_KR', timeZone: 'Asia/Seoul' },
    sheets: [{ properties: { title: tab, gridProperties: { frozenRowCount: 1, frozenColumnCount: 2 } }, data: [{ startRow: 0, startColumn: 0, rowData: [{ values: header.map(h => ({ userEnteredValue: { stringValue: h }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.93, green: 0.95, blue: 1 } } })) }] }] }]
  };
  const r = await fetch('https://sheets.googleapis.com/v4/spreadsheets', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t.access_token }, body: JSON.stringify(body) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error((e.error && e.error.message) || ('HTTP ' + r.status)); }
  const j = await r.json();
  setCfg({ sheetId: j.spreadsheetId, tab });
  return { id: j.spreadsheetId, url: j.spreadsheetUrl };
}
