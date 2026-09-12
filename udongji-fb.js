// 우동지 공용: 열 정의 · 텍스트 생성 · Firebase 연동 (Auth · Firestore · Storage)
export const COLS = [{"g":"식별","name":"고객번호","opts":null},{"g":"식별","name":"고객명","opts":null},{"g":"고객 기본정보","name":"연락처","opts":null},{"g":"고객 기본정보","name":"이메일","opts":null},{"g":"고객 기본정보","name":"영문 성함","opts":null},{"g":"고객 기본정보","name":"매장명","opts":null},{"g":"고객 기본정보","name":"매장 주소","opts":null},{"g":"고객 기본정보","name":"업종","opts":null},{"g":"고객 기본정보","name":"판매 물품","opts":null},{"g":"고객 기본정보","name":"매장 구분","opts":["신규 오픈","기존 운영"]},{"g":"고객 기본정보","name":"상담일","opts":null},{"g":"고객 기본정보","name":"상담자","opts":null},{"g":"공통","name":"인터넷 회선(랜선) 보유","opts":["O","X"]},{"g":"공통","name":"랜선 직접 준비 안내","opts":["O","X"]},{"g":"공통","name":"인터넷 변경/신규 필요","opts":["필요","불필요"]},{"g":"공통","name":"인터넷 상담 요청 일정","opts":null},{"g":"공통","name":"인테리어 타공","opts":["O","X","해당없음"]},{"g":"공통","name":"사업자번호","opts":null},{"g":"공통","name":"대형/개인/법인","opts":["대형","개인","법인"]},{"g":"공통","name":"단독/공동","opts":["단독","공동"]},{"g":"공통","name":"배달 필요 여부","opts":["없음","위젯만","매출연동"]},{"g":"공통","name":"POS 프로그램","opts":["사용 안 함","페이앤","오케이","기타"]},{"g":"공통","name":"안내한 상품 구성","opts":null},{"g":"공통","name":"월 이용요금","opts":null},{"g":"공통","name":"VAN","opts":["NICE","KIS"]},{"g":"공통","name":"기기 색상","opts":["블랙","화이트"]},{"g":"공통","name":"특이사항","opts":null},{"g":"공통","name":"기타 상담 내용","opts":null},{"g":"공통","name":"개인정보 제3자 제공 동의","opts":["O","X"]},{"g":"공통","name":"우동지 수신 동의","opts":["O","X"]},{"g":"공통","name":"네이버 ID","opts":null},{"g":"공통","name":"서류 분류","opts":null},{"g":"공통","name":"서류 수취 완료","opts":["O","X"]},{"g":"공통","name":"링크 접수 완료","opts":["O","X"]},{"g":"신규 오픈","name":"오픈 예정일","opts":null},{"g":"신규 오픈","name":"사업자등록증 발급","opts":["발급 완료","발급 예정"]},{"g":"기존 운영","name":"현재 운영 방식","opts":null},{"g":"기존 운영","name":"현재 단말기·POS","opts":null},{"g":"기존 운영","name":"기존 장비 모델명","opts":null},{"g":"기존 운영","name":"장비 사진","opts":["O","X"]},{"g":"기존 운영","name":"약정 잔여 개월","opts":null},{"g":"기존 운영","name":"월 납부금","opts":null},{"g":"기존 운영","name":"VAN 유실적 — NICE","opts":["무실적","유실적","모름"]},{"g":"기존 운영","name":"VAN 유실적 — KIS","opts":["무실적","유실적","모름"]},{"g":"기존 운영","name":"관리자 전달","opts":["O","X"]},{"g":"진행","name":"상담 결과","opts":["상담 진행","상담 연기","상담 거부"]},{"g":"진행","name":"상태","opts":["상담 중","서류 발송","밴 조회 대기","서명 완료","재연락 예정","보류","종료"]},{"g":"진행","name":"다음 액션 · 일시","opts":null},{"g":"진행","name":"포기 이유","opts":null},{"g":"공통","name":"연매출 3억","opts":["3억 미만","3억 이상","모름"]},{"g":"공통","name":"페이앤 접수 링크","opts":null},{"g":"공통","name":"설치 방식","opts":["자가 설치","현장 설치"]},{"g":"공통","name":"포스 연동","opts":["필요","불필요"]},{"g":"공통","name":"현재 포스","opts":null},{"g":"고객 기본정보","name":"유입 경로","opts":["Call-In","Chat-In","Out"]},{"g":"공통","name":"간판 유무","opts":["있음","없음"]}];
export const ID_COL = '레코드ID', REG_COL = '페이앤 등록';

export function norm(x) { return String(x == null ? '' : x).replace(/\s+/g, '').replace(/\//g, '·'); }
const byNorm = {}; COLS.forEach(c => { byNorm[norm(c.name)] = c; });
export function colOf(name) { return byNorm[norm(name)] || null; }
export function keyOf(header) { const c = colOf(header); return c ? c.name : String(header || '').trim(); }

export function fmtPhone(v) { const d = String(v || '').replace(/\D/g, ''); if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); if (d.length === 10) return d.slice(0, 2) === '02' ? d.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3') : d.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); if (d.length === 9 && d.slice(0, 2) === '02') return d.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3'); return String(v || '').trim(); }
export function fmtPhoneLive(v) { let d = String(v || '').replace(/\D/g, '').slice(0, 11); if (!d) return ''; if (d.startsWith('02')) { if (d.length <= 2) return d; if (d.length <= 5) return d.slice(0, 2) + '-' + d.slice(2); if (d.length <= 9) return d.slice(0, 2) + '-' + d.slice(2, 5) + '-' + d.slice(5); return d.slice(0, 2) + '-' + d.slice(2, 6) + '-' + d.slice(6, 10); } if (d.length <= 3) return d; if (d.length <= 6) return d.slice(0, 3) + '-' + d.slice(3); if (d.length <= 10) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6); return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7); }
export function fmtBiz(v) { const d = String(v || '').replace(/\D/g, ''); return d.length === 10 ? d.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : String(v || '').trim(); }
export function val(d, k) { const v = String((d || {})[k] || '').replace(/[\t\r\n]+/g, ' ').trim(); if (k === '연락처') return fmtPhone(v); if (k === '사업자번호') return fmtBiz(v); return v; }

export function buildPayn(d) {
  const v = k => val(d, k), isNew = v('매장 구분') === '신규 오픈', r = v('상담 결과');
  if (r && r !== '상담 진행') return ['[' + r + '] ' + (v('매장명') || v('고객명')), '· 대표 / 연락처 : ' + v('고객명') + ' / ' + v('연락처'), '· 상태 : ' + v('상태'), (r === '상담 연기' || r === '상담 불가') ? '· 다음 연락 : ' + v('다음 액션 · 일시') : '· 메모 : ' + v('특이사항')].join('\n');
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
  if (r === '상담 연기' || r === '상담 불가' || v('상태') === '재연락 예정') { const when = v('다음 액션 · 일시') || '○월 ○일'; return { kind: '재연락 안내', text: head + '\n오늘 통화 감사합니다. 말씀해주신 대로 ' + when + '에 다시 연락드리겠습니다.\n그 전에 준비되시면 미리 보내주셔도 좋아요.' + tail }; }
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

export const STAGE_COLS = { docs: '수취 완료일', handoff: '이관일', sign: '서명일', install: '설치일' };
export const DOC_CHECK_COL = '서류 체크', DOC_FILES_COL = '서류 파일', PROGRESS_NOTE_COL = '진행 메모';
export const STAGES = [
  { key: 'docs', label: '수취자료' },
  { key: 'handoff', label: '페이앤 이관' },
  { key: 'sign', label: '전자서명 완료' },
  { key: 'install', label: '커넥트 배송 완료' }
];
export const NEWSLETTER_COL = '뉴스레터 등록일';
// 진행 상태 (계약 단계·상담 결과에서 파생) — 포기 / 재연락 / 수취자료진행 / 페이앤진행 / 전자서명진행 / 커넥트진행 / 완료
export const STATUS_FLOW = ['수취자료진행', '페이앤진행', '전자서명진행', '커넥트진행', '완료'];
export function statusOf(d) {
  d = d || {}; const has = k => !!String(d[k] || '').trim();
  const r = String(d['상담 결과'] || '').trim(), st = String(d['상태'] || '').trim();
  if (r === '상담 거부' || st === '종료') return { key: 'drop', label: '포기', cls: 'hot' };
  if (r === '상담 연기' || r === '상담 불가' || st === '재연락 예정' || st === '보류') return { key: 'recall', label: '재연락', cls: 'amber' };
  if (has(STAGE_COLS.install)) return { key: 'done', label: '완료', cls: 'ok' };
  if (has(STAGE_COLS.sign)) return { key: 'install', label: '커넥트진행', cls: 'blue' };
  if (has(STAGE_COLS.handoff) || has(REG_COL)) return { key: 'sign', label: '전자서명진행', cls: 'blue' };
  if (has(STAGE_COLS.docs)) return { key: 'handoff', label: '페이앤진행', cls: 'blue' };
  return { key: 'docs', label: '수취자료진행', cls: 'blue' };
}
// 고객 조건에 따라 필요 서류 목록
export function requiredDocs(d) {
  const v = k => val(d, k), corp = v('대형/개인/법인') === '법인', joint = v('단독/공동') === '공동';
  // 페이앤 8케이스 접수 양식 기준 — 기본 6 + 법인 6 + 공동대표 4 (신규/기존은 서류 차이 없음)
  const list = [
    { id: 'biz', name: '사업자등록증', hint: '최근 발급본, 가리는 곳 없이' },
    { id: 'idcard', name: '대표자 신분증', hint: '주민등록증 또는 운전면허증 (여권 불가)' },
    { id: 'bank', name: '통장 사본 (정산계좌)', hint: corp ? '예금주 = 법인명 표기까지 완전 일치' : '예금주 = 대표 본인, 모바일 캡처 가능' },
    { id: 'license', name: '영업신고증 / 인허가증', hint: '요식업·병원·학원·통신판매 등 해당 업종만', cond: true },
    { id: 'poa', name: '위임장', hint: '대표자 외 신청 시만', cond: true },
  ];
  // 매장사진: 간판 유무에 따라 구성이 다름 (기본 = 간판 있음)
  // 한 항목 = 사진 한 장 (single: true) — 페이앤 촬영 가이드 기준
  if (v('간판 유무') === '없음') list.push(
    { id: 'photo_bldg', name: '매장사진 1/5 · 매장 외관', hint: '간판이 없는 매장 외관 전체가 나오게', single: true },
    { id: 'photo_entry', name: '매장사진 2/5 · 실내가 보이는 입구', hint: '출입문을 열어 내부가 보이도록', single: true },
    { id: 'photo_addr', name: '매장사진 3/5 · 도로명주소', hint: '건물 도로명주소 표지판이 또렷하게 (확인 불가 시 임대차계약서 제출)', single: true },
    { id: 'photo_in', name: '매장사진 4/5 · 매장 내부 전체', hint: '매장 내부 전체가 나오도록', single: true },
    { id: 'photo_biz', name: '매장사진 5/5 · 업종 확인', hint: '판매상품 · 테이블 · 계산대 등', single: true },
    { id: 'lease', name: '임대차계약서', hint: '도로명주소 확인이 불가한 경우에만', cond: true }
  ); else list.push(
    { id: 'photo_out', name: '매장사진 1/4 · 간판 포함 매장 외관', hint: '사업자등록증 상 상호명이 보이도록', single: true },
    { id: 'photo_entry', name: '매장사진 2/4 · 실내가 보이는 입구', hint: '출입문을 열어 내부가 보이도록', single: true },
    { id: 'photo_in', name: '매장사진 3/4 · 매장 내부 전체', hint: '매장 내부 전체가 나오도록', single: true },
    { id: 'photo_biz', name: '매장사진 4/4 · 업종 확인', hint: '판매상품 · 테이블 · 계산대 등', single: true }
  );
  if (corp) list.push(
    { id: 'corp_reg', name: '법인등기부등본', hint: '3개월 이내' },
    { id: 'corp_seal', name: '법인 인감증명서', hint: '3개월 이내' },
    { id: 'corp_share', name: '주주명부', hint: '' },
    { id: 'corp_owner', name: '법인 소유지배자 확인서', hint: '서식은 우리가 보내드림' },
    { id: 'corp_doc', name: '공문 / 정관 / 회칙', hint: '해당 업종만', cond: true },
    { id: 'corp_useseal', name: '사용인감계', hint: '사용인감 사용 시만', cond: true }
  );
  if (joint) list.push(
    { id: 'joint_poa', name: '공동대표자 가맹점 가입 동의 및 위임장', hint: '서식은 우리가 보내드림' },
    { id: 'joint_acct', name: '공동대표자 결제계좌 이용 신청 동의서', hint: '' },
    { id: 'joint_id', name: '공동대표자 신분증', hint: '' },
    { id: 'joint_phone', name: '공동대표자 명의 연락처', hint: '텍스트로 받음' }
  );
  return list;
}
// ── 페이앤 가맹점 접수 폼 (8케이스 단일 양식) — 값은 'PA·라벨' 열에 저장, 미입력이면 상담 기록에서 미리 채움 ──
export const PAYN_PREFIX = 'PA·';
export const PAYN_DEALER_PHONES = { '이일광': '010-9992-5432' };
const NA = '해당사항없음';
export const PAYN_FIELDS = [
  { k: 'dealer', sec: 'A. 딜러 정보', label: '딜러사 소속/담당자성명', ro: true, src: d => '우동지/' + (val(d, '상담자') || '') },
  { k: 'dealerPhone', sec: 'A. 딜러 정보', label: '딜러 담당자 연락처', mono: true, src: d => PAYN_DEALER_PHONES[val(d, '상담자')] || '' },
  { k: 'phone', sec: 'B. 가맹점 정보', label: '가맹점 대표자 연락처', mono: true, src: d => val(d, '연락처') },
  { k: 'name', sec: 'B. 가맹점 정보', label: '가맹점 대표자 성명', src: d => val(d, '고객명') },
  { k: 'store', sec: 'B. 가맹점 정보', label: '가맹점 상호명', src: d => val(d, '매장명') },
  { k: 'email', sec: 'B. 가맹점 정보', label: '가맹점 대표자 이메일', src: d => val(d, '이메일') },
  { k: 'bizno', sec: 'B. 가맹점 정보', label: '가맹점 사업자번호', mono: true, digits: 10, hint: '하이픈 없이 숫자 10자리', src: d => String(d['사업자번호'] || '').replace(/\D/g, '') },
  { k: 'goods', sec: 'B. 가맹점 정보', label: '판매 물품', hint: '예: 의류, 요식업', src: d => val(d, '판매 물품') || val(d, '업종') },
  { k: 'naver', sec: 'B. 가맹점 정보', label: '네이버 ID', hint: '대표자 명의만', src: d => val(d, '네이버 ID') },
  { k: 'corpno', sec: 'B. 가맹점 정보', label: '가맹점 법인등록번호', mono: true, digits: 13, hint: '하이픈 없이 숫자 13자리', cond: 'corp', src: d => '' },
  { k: 'joint', sec: 'B. 가맹점 정보', label: '공동 대표자 성함/연락처', hint: '예: 토세토/010-9292-0202', cond: 'joint', src: d => '' },
  { k: 'engname', sec: 'B. 가맹점 정보', label: '가맹점 대표자 영문 성명', hint: '반드시 여권상 성함과 일치', cond: 'newperson', src: d => val(d, '영문 성함') },
  { k: 'bank', sec: 'C. 자동이체 정보', label: '자동이체 은행명', src: d => '' },
  { k: 'acct', sec: 'C. 자동이체 정보', label: '자동이체 계좌번호', mono: true, src: d => '' },
  { k: 'holder', sec: 'C. 자동이체 정보', label: '자동이체 예금주명', src: d => val(d, '대형/개인/법인') === '법인' ? val(d, '매장명') : val(d, '고객명') },
  { k: 'holderRel', sec: 'C. 자동이체 정보', label: '자동이체 예금주와의 관계', src: d => '본인' },
  { k: 'holderPhone', sec: 'C. 자동이체 정보', label: '자동이체 예금주 연락처', mono: true, src: d => val(d, '연락처') },
  { k: 'holderBirth', sec: 'C. 자동이체 정보', label: '자동이체 예금주 생년월일', mono: true, digits: 6, hint: '6자리, 예: 890330', src: d => '' },
  { k: 'color', sec: 'D. 단말·설치', label: '커넥트 색상', opts: ['화이트', '블랙'], src: d => val(d, '기기 색상') },
  { k: 'cat', sec: 'D. 단말·설치', label: '캣단말기 여부', opts: ['O', 'X'], src: d => val(d, '안내한 상품 구성') ? (/카드단말기|캣/.test(val(d, '안내한 상품 구성')) ? 'O' : 'X') : '' },
  { k: 'installWhen', sec: 'D. 단말·설치', label: '설치 일정 (대략적인)', src: d => val(d, '오픈 예정일') },
  { k: 'pos', sec: 'E. 부가장비 신청', label: '포스기', opts: [NA, '윈도우', '태블릿'], src: d => NA },
  { k: 'printer', sec: 'E. 부가장비 신청', label: '영수증 프린터', opts: [NA, '유선 화이트', '유선 블랙', '무선'], src: d => /프린터/.test(val(d, '안내한 상품 구성')) ? ('유선 ' + (val(d, '기기 색상') || '화이트')) : NA },
  { k: 'drawer', sec: 'E. 부가장비 신청', label: '금전함', opts: [NA, '화이트', '블랙'], src: d => NA },
  { k: 'kiosk', sec: 'E. 부가장비 신청', label: '키오스크', opts: [NA, '단품', '스탠드', '베리어프리'], src: d => NA },
  { k: 'note', sec: 'F. 기타', label: '특이사항 (페이앤 전달용)', multi: true, opt: true, src: d => val(d, '특이사항') }
];
export function paynCase(d) { const v = k => val(d, k); return { corp: v('대형/개인/법인') === '법인', joint: v('단독/공동') === '공동', isNew: v('매장 구분') === '신규 오픈', known: !!(v('대형/개인/법인') && v('단독/공동') && v('매장 구분')) }; }
// 페이앤 채널톡 접수 워크플로 — 8케이스별 링크 (신규/기존 × 개인/법인 × 단독/공동)
export const PAYN_LINKS = { 'new|person|single': '841963', 'new|person|joint': '841961', 'new|corp|single': '841955', 'new|corp|joint': '841952', 'old|person|single': '841968', 'old|person|joint': '841965', 'old|corp|single': '841959', 'old|corp|joint': '841957' };
export function paynLink(d) { const c = paynCase(d); if (!c.known) return null; const no = PAYN_LINKS[(c.isNew ? 'new' : 'old') + '|' + (c.corp ? 'corp' : 'person') + '|' + (c.joint ? 'joint' : 'single')]; return no ? { no, url: 'https://payn.channel.io/workflows/' + no, label: (c.isNew ? '신규' : '기존') + ' · ' + (c.corp ? '법인' : '개인') + ' · ' + (c.joint ? '공동대표' : '단독') } : null; }
export function paynActive(d) { const c = paynCase(d); return PAYN_FIELDS.filter(f => !f.cond || (f.cond === 'corp' && c.corp) || (f.cond === 'joint' && c.joint) || (f.cond === 'newperson' && c.isNew && !c.corp)); }
// 저장값 있으면 저장값, 없으면 상담 기록에서 미리 채움 (ro 필드는 항상 계산값)
export function paynValue(d, f) { if (f.ro) return f.src(d); const saved = String(d[PAYN_PREFIX + f.label] || '').trim(); return saved || f.src(d); }
export function paynMissing(d) { return paynActive(d).filter(f => { const v = String(paynValue(d, f) || '').trim(); return (!f.opt && !v) || (f.digits && v && v.length !== f.digits); }); }
// 필수 서류만 (cond=해당 시에만 받는 서류는 제외)
export function requiredDocsMust(d) { return requiredDocs(d).filter(x => !x.cond); }
// 엑셀 원본이 '항목명 / 값' 2열이므로 탭 구분 2열. 해당 케이스에 없는 항목은 줄 자체를 뺀다.
export function buildPaynTSV(d) { return paynActive(d).map(f => f.label + '\t' + String(paynValue(d, f) || '').replace(/[\t\r\n]+/g, ' ').trim()).join('\n'); }
// 구 서류 id → 새 id (기존 고객의 체크·파일 유지)
const DOC_ALIAS = { photo: 'photo_out', photo_out2: 'photo_entry', photo_in2: 'photo_biz', food: 'license', corp: 'corp_reg', joint: 'joint_poa', device: 'photo_out', naver: 'poa', engname: 'poa' };
const docAlias = id => DOC_ALIAS[id] || id;
export function parseDocCheck(s) { const o = {}; String(s || '').split(',').map(x => x.trim()).filter(Boolean).forEach(x => { o[docAlias(x)] = true; }); return o; }
export function parseDocFiles(s) { try { const j = JSON.parse(s || '[]'); return Array.isArray(j) ? j.map(f => Object.assign({}, f, { doc: docAlias(f.doc) })) : []; } catch (e) { return []; } }

export function safeName(s) { return String(s || '').replace(/[\/\\:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim(); }
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

// ───────── Firebase ─────────
export const FIREBASE = { apiKey: 'AIzaSyBd9_wZ0yy8rbFFNMsF9xGKqqrqQYsPKnU', authDomain: 'udongj-5d8da.firebaseapp.com', projectId: 'udongj-5d8da', storageBucket: 'udongj-5d8da.firebasestorage.app', messagingSenderId: '794429903467', appId: '1:794429903467:web:0383bfc3c41b71fb95d72e' };
export const ROOT_ADMINS = ['daylightism@gmail.com'];
const FBV = '10.14.1', FBU = 'https://www.gstatic.com/firebasejs/' + FBV + '/';
let _app, _auth, _db, _st, _mods, _user = null, _ready;
export function init() {
  if (_ready) return _ready;
  _ready = (async () => {
    const [app, auth, fs, st] = await Promise.all([import(FBU + 'firebase-app.js'), import(FBU + 'firebase-auth.js'), import(FBU + 'firebase-firestore.js'), import(FBU + 'firebase-storage.js')]);
    _mods = { auth, fs, st };
    _app = app.getApps().length ? app.getApp() : app.initializeApp(FIREBASE);
    _auth = auth.getAuth(_app); _db = fs.getFirestore(_app); _st = st.getStorage(_app);
    await auth.setPersistence(_auth, auth.browserLocalPersistence).catch(() => {});
    _user = await new Promise(res => { const off = auth.onAuthStateChanged(_auth, u => { off(); res(u); }); });
    auth.onAuthStateChanged(_auth, u => { _user = u; });
    return true;
  })();
  return _ready;
}
export function isSignedIn() { return !!_user; }
export function userEmail() { return _user ? (_user.email || '') : ''; }
export async function signIn() {
  await init(); const { auth } = _mods;
  const p = new auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
  const r = await auth.signInWithPopup(_auth, p); _user = r.user;
    return { email: _user.email };
}
export async function signOut() { await init(); await _mods.auth.signOut(_auth); _user = null; }
export function todayStr() { const t = new Date(), p = n => String(n).padStart(2, '0'); return t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate()); }

// ── 레코드 (Firestore: customers/{id}) ── 페이지 호환을 위해 { row: id, data } 형태로 반환
const COL = 'customers';
function need() { if (!_user) throw new Error('로그인이 필요해요. 홈에서 구글 계정으로 로그인하세요.'); }
// 내 정보(역할·이름) 캐시 — 구성원(consult/sales)은 본인 상담 고객만 조회 가능
let _me = null;
export async function me(force) { if (_me && !force) return _me; await init(); const email = userEmail(); const role = await roleOf(email); const name = await myName(); _me = { email, role, name, admin: isAdminRole(role) }; return _me; }
export async function readAll(opts) {
  await init(); need(); const { fs } = _mods; opts = opts || {};
  const m = await me();
  let q;
  if (m.admin || opts.all) q = fs.collection(_db, COL);
  else if (m.name) q = fs.query(fs.collection(_db, COL), fs.where('상담자', '==', m.name));
  else return { header: FULL_HEADER(), items: [] };
  const snap = await fs.getDocs(q);
  const items = snap.docs.map((d, i) => { const data = d.data(); const clean = {}; Object.keys(data).forEach(k => { if (k[0] !== '_') clean[k] = data[k] == null ? '' : String(data[k]); }); clean[ID_COL] = d.id; return { row: d.id, id: d.id, data: clean, _createdAt: data._createdAt || '', _updatedAt: data._updatedAt || '' }; });
  items.sort((a, b) => String(a._createdAt).localeCompare(String(b._createdAt)));
  return { header: FULL_HEADER(), items };
}
export const FULL_HEADER = () => COLS.map(c => c.name).concat([ID_COL, REG_COL]).concat(PAYN_FIELDS.filter(f => !f.ro).map(f => PAYN_PREFIX + f.label));
function cleanIn(d) { const o = {}; Object.keys(d || {}).forEach(k => { if (k[0] !== '_' && k !== ID_COL) o[k] = d[k] == null ? '' : String(d[k]); }); return o; }
export async function findRowById(id) { await init(); need(); const { fs } = _mods; const s = await fs.getDoc(fs.doc(_db, COL, id)); return s.exists() ? id : null; }
export async function appendRecord(d, id) {
  await init(); need(); const { fs } = _mods; const now = new Date().toISOString();
  const nm = await myName(); if (nm) d = Object.assign({}, d, { '상담자': nm });
  const ref = id ? fs.doc(_db, COL, id) : fs.doc(fs.collection(_db, COL));
  await fs.setDoc(ref, Object.assign(cleanIn(d), { _createdAt: now, _updatedAt: now, _createdBy: userEmail() }), { merge: true });
  return ref.id;
}
export async function updateRecord(id, d) {
  await init(); need(); const { fs } = _mods;
  const nm = await myName(); if (nm) d = Object.assign({}, d, { '상담자': nm });
  const ref = fs.doc(_db, COL, id); const cur = await fs.getDoc(ref); const keep = cur.exists() ? cur.data() : {};
  const patch = cleanIn(d);
  // 계약 진행 열은 상담 폼이 덮어쓰지 않도록 보존
  [REG_COL, DOC_CHECK_COL, DOC_FILES_COL, PROGRESS_NOTE_COL, ...Object.values(STAGE_COLS)].forEach(k => { if (keep[k] !== undefined && (patch[k] === undefined || patch[k] === '')) patch[k] = keep[k]; });
  await fs.setDoc(ref, Object.assign(patch, { _updatedAt: new Date().toISOString(), _updatedBy: userEmail() }), { merge: true });
}
export async function updateCells(id, obj) { await init(); need(); const { fs } = _mods; await fs.setDoc(fs.doc(_db, COL, id), Object.assign(cleanIn(obj), { _updatedAt: new Date().toISOString(), _updatedBy: userEmail() }), { merge: true }); }
export async function setCell(id, k, v) { return updateCells(id, { [k]: v }); }
// 삭제: 원본을 deleted/{id}에 그대로 보관(누가·언제·사유) 후 customers에서 제거. 첨부 파일은 복구를 위해 남긴다.
export async function whoAmI() { const nm = await myName().catch(() => ''); return nm ? nm + '(' + userEmail() + ')' : userEmail(); }
export async function deleteRow(id, reason) {
  await init(); need(); const { fs } = _mods;
  reason = String(reason || '').trim(); if (!reason) throw new Error('삭제 사유를 입력하세요');
  const ref = fs.doc(_db, COL, id); const cur = await fs.getDoc(ref); const data = cur.exists() ? cur.data() : {};
  const now = new Date().toISOString(); const who = await whoAmI();
  await fs.setDoc(fs.doc(_db, 'deleted', id + '_' + now.replace(/[:.]/g, '')), { recordId: id, data, deletedAt: now, deletedBy: userEmail(), deletedByName: who, reason, store: String(data['매장명'] || ''), customer: String(data['고객명'] || ''), phone: String(data['연락처'] || ''), ua: navigator.userAgent.slice(0, 200) });
  await fs.deleteDoc(ref);
}
// ── 삭제 로그 (Firestore: deleted/{logId}) — 슈퍼관리자만 조회·복구, 삭제 불가 ──
export async function listDeleted() { await init(); need(); const { fs } = _mods; const s = await fs.getDocs(fs.query(fs.collection(_db, 'deleted'), fs.orderBy('deletedAt', 'desc'))); return s.docs.map(d => Object.assign({ logId: d.id }, d.data())); }
export async function restoreDeleted(logId) {
  await init(); need(); const { fs } = _mods;
  const s = await fs.getDoc(fs.doc(_db, 'deleted', logId)); if (!s.exists()) throw new Error('로그를 찾을 수 없어요');
  const L = s.data(); const now = new Date().toISOString();
  await fs.setDoc(fs.doc(_db, COL, L.recordId), Object.assign({}, L.data, { _updatedAt: now, _updatedBy: userEmail(), _restoredAt: now, _restoredBy: userEmail() }), { merge: true });
  await fs.setDoc(fs.doc(_db, 'deleted', logId), { restoredAt: now, restoredBy: await whoAmI() }, { merge: true });
}
// ── 관리자 (Firestore: admins/{email}) — 구버전 호환용. 지금은 users/{email}.role 이 기준 ──
export const ROLES = [{ key: 'consult', label: '구성원 · 상담' }, { key: 'sales', label: '구성원 · 영업' }, { key: 'admin', label: '관리자' }, { key: 'super', label: '슈퍼관리자' }];
export function roleLabel(r) { return (ROLES.find(x => x.key === r) || ROLES[0]).label; }
export function isAdminRole(r) { return r === 'admin' || r === 'super'; }
export async function listAdmins() { await init(); if (!_user) return []; const { fs } = _mods; try { const s = await fs.getDocs(fs.collection(_db, 'admins')); return s.docs.map(d => ({ email: d.id, at: d.data().at || '', by: d.data().by || '' })); } catch (e) { return []; } }
// 내 역할: root → super, users.role, (구) admins 문서 → admin, 등록만 → consult, 미등록 → ''
export async function roleOf(email) {
  const e = String(email || '').trim().toLowerCase(); if (!e) return ''; if (ROOT_ADMINS.includes(e)) return 'super';
  await init(); const { fs } = _mods;
  try { const s = await fs.getDoc(fs.doc(_db, 'users', e)); if (!s.exists()) return ''; const r = s.data().role; if (r) return r; } catch (er) { return ''; }
  try { if ((await fs.getDoc(fs.doc(_db, 'admins', e))).exists()) return 'admin'; } catch (er) {}
  return 'consult';
}
export async function isSuper(email) { return (await roleOf(email)) === 'super'; }
export async function isAdmin(email) { return isAdminRole(await roleOf(email)); }
export async function addAdmin(email, by) { const e = String(email || '').trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error('이메일 형식이 아니에요'); if (ROOT_ADMINS.includes(e)) throw new Error('이미 관리자예요'); await init(); need(); const { fs } = _mods; if ((await fs.getDoc(fs.doc(_db, 'admins', e))).exists()) throw new Error('이미 관리자예요'); await fs.setDoc(fs.doc(_db, 'admins', e), { at: todayStr(), by: by || '' }); }
export async function removeAdmin(email) { const e = String(email || '').trim().toLowerCase(); if (ROOT_ADMINS.includes(e)) throw new Error('기본 관리자는 해제할 수 없어요'); await init(); need(); await _mods.fs.deleteDoc(_mods.fs.doc(_db, 'admins', e)); }
// ── 허용 사용자 (Firestore: users/{email}) — 보안 규칙이 이 목록으로 접근 제어 ──
export async function listUsers() { await init(); if (!_user) return []; const { fs } = _mods; try { const s = await fs.getDocs(fs.collection(_db, 'users')); return s.docs.map(d => ({ email: d.id, at: d.data().at || '', by: d.data().by || '', name: d.data().name || '', role: d.data().role || '' })); } catch (e) { return []; } }
export async function addUser(email, by, name, role) { const e = String(email || '').trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error('이메일 형식이 아니에요'); await init(); need(); const patch = { at: todayStr(), by: by || '', name: name || '' }; if (role) patch.role = role; await _mods.fs.setDoc(_mods.fs.doc(_db, 'users', e), patch, { merge: true }); }
export async function setUserRole(email, role) { const e = String(email || '').trim().toLowerCase(); if (!ROLES.some(r => r.key === role)) throw new Error('역할 값이 이상해요'); if (ROOT_ADMINS.includes(e) && role !== 'super') throw new Error('기본 슈퍼관리자는 바꿀 수 없어요'); await init(); need(); await _mods.fs.setDoc(_mods.fs.doc(_db, 'users', e), { role, _roleBy: userEmail(), _roleAt: new Date().toISOString() }, { merge: true }); }
export async function removeUser(email) { const e = String(email || '').trim().toLowerCase(); if (ROOT_ADMINS.includes(e)) throw new Error('기본 관리자는 제거할 수 없어요'); await init(); need(); await _mods.fs.deleteDoc(_mods.fs.doc(_db, 'users', e)); }
export async function isAllowed(email) { const e = String(email || '').trim().toLowerCase(); if (ROOT_ADMINS.includes(e)) return true; await init(); const { fs } = _mods; try { return (await fs.getDoc(fs.doc(_db, 'users', e))).exists(); } catch (er) { return false; } }
// 로그인 계정의 등록 이름(상담자) — 슈퍼관리자가 사용자 관리에서 지정. 본인은 바꿀 수 없다.
let _myName = null;
export async function myName() { if (_myName !== null) return _myName; await init(); if (!_user) return ''; const { fs } = _mods; try { const s = await fs.getDoc(fs.doc(_db, 'users', userEmail().toLowerCase())); _myName = s.exists() ? String(s.data().name || '') : ''; } catch (e) { _myName = ''; } return _myName; }

// ── 파일 (Storage: docs/{recordId}/{name}) ──
export async function ensureCustomerFolder(label, recordId) { return recordId || safeName(label); }
export async function uploadFile(blob, folder, name) {
  await init(); need(); const { st } = _mods;
  const path = 'docs/' + folder + '/' + name;
  const r = st.ref(_st, path);
  await st.uploadBytes(r, blob, { contentType: blob.type || 'application/octet-stream' });
  const url = await st.getDownloadURL(r);
  return { id: path, name, webViewLink: url, size: blob.size };
}
export async function deleteFile(id) { await init(); need(); const { st } = _mods; try { await st.deleteObject(st.ref(_st, id)); } catch (e) { if (!/not-found/.test(String(e && e.code))) throw e; } }
// ── 뉴스레터(스티비) 연동: config/newsletter {url, secret, enabled} — 관리자만 읽기/쓰기, 전송 로그는 newsletter_log ──
let _nlCfg = null;
export async function getNewsletterConfig(force) { await init(); if (_nlCfg && !force) return _nlCfg; const { fs } = _mods; try { const s = await fs.getDoc(fs.doc(_db, 'config', 'newsletter')); _nlCfg = s.exists() ? s.data() : {}; } catch (e) { _nlCfg = {}; } return _nlCfg; }
export async function setNewsletterConfig(cfg) { await init(); need(); const { fs } = _mods; await fs.setDoc(fs.doc(_db, 'config', 'newsletter'), Object.assign({}, cfg, { _updatedAt: new Date().toISOString(), _updatedBy: userEmail() }), { merge: true }); _nlCfg = null; }
export async function listNewsletterLog() { await init(); need(); const { fs } = _mods; const s = await fs.getDocs(fs.query(fs.collection(_db, 'newsletter_log'), fs.orderBy('at', 'desc'), fs.limit(200))); return s.docs.map(d => Object.assign({ logId: d.id }, d.data())); }
// 수령 완료 시 호출. 반환: {ok, skipped?, reason?}
export async function notifyNewsletter(id, d, opts) {
  await init(); need(); const { fs } = _mods; opts = opts || {};
  const cfg = await getNewsletterConfig(); const name = val(d, '고객명'), email = val(d, '이메일').toLowerCase(), store = val(d, '매장명');
  const logIt = async (status, detail) => { try { await fs.addDoc(fs.collection(_db, 'newsletter_log'), { at: new Date().toISOString(), by: userEmail(), recordId: id, name, email, store, status, detail: detail || '' }); } catch (e) {} };
  if (!cfg.url || !cfg.secret) { return { ok: false, skipped: true, reason: '연동 미설정 (관리자 > 연동 설정)' }; }
  if (cfg.enabled === false) return { ok: false, skipped: true, reason: '연동 꺼짐' };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { await logIt('skip', '이메일 없음'); return { ok: false, skipped: true, reason: '이메일 없음' }; }
  if (val(d, '우동지 수신 동의') === 'X') { await logIt('skip', '수신 동의 X'); return { ok: false, skipped: true, reason: '수신 동의 X' }; }
  if (!opts.force && String(d[NEWSLETTER_COL] || '').trim()) return { ok: true, skipped: true, reason: '이미 등록됨 ' + d[NEWSLETTER_COL] };
  try {
    // Apps Script 웹앱은 CORS 헤더를 안 주므로 text/plain + no-cors로 보내고, 응답은 읽지 않는다 (발사 후 망각). 실패는 네트워크 오류만 감지.
    await fetch(cfg.url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ secret: cfg.secret, name, email, store, at: todayStr(), id }) });
    await updateCells(id, { [NEWSLETTER_COL]: todayStr() }); d[NEWSLETTER_COL] = todayStr();
    await logIt('sent'); return { ok: true };
  } catch (e) { await logIt('fail', e.message); return { ok: false, reason: e.message }; }
}
// ── 홈페이지 상담시간: public/consultHours {json, updatedAt} — 누구나 읽기(랜딩페이지·Apps Script), 관리자만 쓰기 ──
export const HOURS_TZ = 'Asia/Seoul';
export const DEFAULT_HOURS = () => ({ force: false, days: Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map(i => [String(i), { on: i >= 1 && i <= 5, start: '13:00', end: '21:00' }])), holidays: [] });
export function hoursPublicUrl() { return 'https://firestore.googleapis.com/v1/projects/' + FIREBASE.projectId + '/databases/(default)/documents/public/consultHours?key=' + FIREBASE.apiKey; }
export function seoulNow(d) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: HOURS_TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' }).formatToParts(d || new Date());
  const g = t => (parts.find(p => p.type === t) || {}).value || '';
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), hm: g('hour') + ':' + g('minute'), ymd: g('year') + '-' + g('month') + '-' + g('day') };
}
// 최종 상담 가능 여부 (force → 휴무일 → 요일 시간). Apps Script doGet 과 같은 규칙
export function computeLive(cfg, d) {
  cfg = cfg || DEFAULT_HOURS(); const n = seoulNow(d); const day = (cfg.days || {})[String(n.day)] || { on: false };
  if (cfg.force) return { live: false, why: '즉시 끄기 켜짐' };
  if ((cfg.holidays || []).includes(n.ymd)) return { live: false, why: '휴무일 ' + n.ymd };
  if (!day.on) return { live: false, why: '오늘 운영 안 함' };
  const ok = n.hm >= day.start && n.hm < day.end; return { live: ok, why: ok ? '운영 시간 (' + day.start + '~' + day.end + ')' : '운영 시간 외 (' + day.start + '~' + day.end + ')' };
}
export async function getConsultHours() { await init(); const { fs } = _mods; try { const s = await fs.getDoc(fs.doc(_db, 'public', 'consultHours')); if (!s.exists()) return { cfg: DEFAULT_HOURS(), updatedAt: '' }; const d = s.data(); return { cfg: Object.assign(DEFAULT_HOURS(), JSON.parse(d.json || '{}')), updatedAt: d.updatedAt || '' }; } catch (e) { return { cfg: DEFAULT_HOURS(), updatedAt: '' }; } }
export async function setConsultHours(cfg) {
  await init(); need(); const { fs } = _mods; const now = new Date().toISOString();
  const clean = { force: !!cfg.force, days: {}, holidays: Array.from(new Set((cfg.holidays || []).filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h)))).sort() };
  for (let i = 0; i < 7; i++) { const d = (cfg.days || {})[String(i)] || {}; clean.days[String(i)] = { on: !!d.on, start: /^\d{2}:\d{2}$/.test(d.start) ? d.start : '13:00', end: /^\d{2}:\d{2}$/.test(d.end) ? d.end : '21:00' }; }
  clean.updatedAt = now;
  await fs.setDoc(fs.doc(_db, 'public', 'consultHours'), { json: JSON.stringify(clean), updatedAt: now, timezone: HOURS_TZ, _updatedBy: userEmail() });
  return clean;
}
export function storageConsoleUrl() { return 'https://console.firebase.google.com/project/' + FIREBASE.projectId + '/storage'; }
export function firestoreConsoleUrl() { return 'https://console.firebase.google.com/project/' + FIREBASE.projectId + '/firestore'; }

// ── 고객 이관 (Firestore: transfers/{id}) — 보낸 사람이 요청, 받는 사람이 수락해야 상담자가 바뀐다 ──
export const TRANSFER_LOG_COL = '이관 이력';
export async function listTransfers() {
  await init(); need(); const { fs } = _mods; const m = await me();
  const s = await fs.getDocs(fs.query(fs.collection(_db, 'transfers'), fs.orderBy('at', 'desc'), fs.limit(300)));
  return s.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(t => m.admin || t.toEmail === m.email || t.fromEmail === m.email);
}
export async function requestTransfers(items, toUser) {
  await init(); need(); const { fs } = _mods; const m = await me(); if (!toUser || !toUser.email) throw new Error('받을 사람을 고르세요'); if (!toUser.name) throw new Error('받을 사람 계정에 이름이 없어요 (관리자에서 이름 등록)');
  const now = new Date().toISOString(); const batch = fs.writeBatch(_db); let n = 0;
  for (const it of items) { const d = it.data || {}; batch.set(fs.doc(fs.collection(_db, 'transfers')), { customerId: it.id, store: String(d['매장명'] || ''), customer: String(d['고객명'] || ''), phone: String(d['연락처'] || ''), from: m.name || m.email, fromEmail: m.email, to: toUser.name, toEmail: String(toUser.email).toLowerCase(), at: now, status: 'pending' }); n++; }
  await batch.commit(); return n;
}
export async function acceptTransfer(t) {
  await init(); need(); const { fs } = _mods; const m = await me(); if (!m.name) throw new Error('내 계정에 이름이 없어 수락할 수 없어요');
  const now = new Date().toISOString(), stamp = '[' + todayStr() + '] ' + (t.from || '') + ' → ' + m.name;
  let prev = ''; try { const s = await fs.getDoc(fs.doc(_db, COL, t.customerId)); if (s.exists()) prev = String(s.data()[TRANSFER_LOG_COL] || ''); } catch (e) {}
  await updateCells(t.customerId, { '상담자': m.name, [TRANSFER_LOG_COL]: (prev ? prev + '\n' : '') + stamp });
  await fs.setDoc(fs.doc(_db, 'transfers', t.id), { status: 'accepted', decidedAt: now, decidedBy: m.email }, { merge: true });
}
export async function rejectTransfer(t) { await init(); need(); const { fs } = _mods; await fs.setDoc(fs.doc(_db, 'transfers', t.id), { status: 'rejected', decidedAt: new Date().toISOString(), decidedBy: userEmail() }, { merge: true }); }
export async function cancelTransfer(t) { await init(); need(); const { fs } = _mods; await fs.deleteDoc(fs.doc(_db, 'transfers', t.id)); }

// ── 시트 내보내기 (엑셀/시트에 붙일 TSV 전체) ──
export function buildExportTSV(items) { const header = FULL_HEADER().concat([DOC_CHECK_COL, ...Object.values(STAGE_COLS), PROGRESS_NOTE_COL]); return [header.join('\t')].concat(items.map(it => header.map(h => val(it.data, h).replace(/\t/g, ' ')).join('\t'))).join('\n'); }
