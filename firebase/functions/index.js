// 우동지 CRM — 홈페이지(아임웹) 상담신청 수신: POST /lead
// 본문: text/plain JSON {name, phone, method, event, source, ts} → Firestore leads/imweb_{전화숫자}_{분단위}
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const fs = require('fs'), path = require('path');
admin.initializeApp();
const db = admin.firestore();
// AI 키는 Firestore secrets/ai.anthropicKey (관리자 화면에서 입력) — 60초 캐시
let _key = { v: '', t: 0 };
async function aiKey() { if (Date.now() - _key.t < 60000) return _key.v; const d = await db.collection('secrets').doc('ai').get(); _key = { v: d.exists ? String(d.data().anthropicKey || '').trim() : '', t: Date.now() }; return _key.v; }

// 슬랙 알림: Firestore secrets/slack.webhookUrl (관리자 화면에서 입력)
async function notifySlack(l) {
  const d = await db.collection('secrets').doc('slack').get(); const url = d.exists ? String(d.data().webhookUrl || '').trim() : ''; if (!/^https:\/\/hooks\.slack\.com\//.test(url)) return;
  const kst = new Date(l.ts.getTime() + 9 * 3600e3), p = n => String(n).padStart(2, '0'), when = p(kst.getUTCMonth() + 1) + '/' + p(kst.getUTCDate()) + ' ' + p(kst.getUTCHours()) + ':' + p(kst.getUTCMinutes());
  const parts = [l.method, l.event ? '체험단 ' + l.event : ''].filter(Boolean).join(' · ');
  const text = ':bell: *새 홈페이지 상담신청* — ' + l.name + ' · ' + l.phone + (parts ? ' · ' + parts : '') + ' (' + when + ')' + (l.event === '참여' ? '  :star: *체험단 참여*' : '') + '\n<https://eduforward.github.io/udongji/|CRM에서 배정하기>';
  await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) });
}

const ORIGINS = ['https://udongji.co.kr', 'https://www.udongji.co.kr'];
const RATE = new Map(); // phoneDigits → [timestamps] (인스턴스 메모리, 최소 남용 방지)

exports.lead = onRequest({ region: 'asia-northeast3', cors: false, maxInstances: 5, invoker: 'public', serviceAccount: 'firebase-adminsdk-fbsvc@udongj-5d8da.iam.gserviceaccount.com' }, async (req, res) => {
  const origin = req.get('origin') || '';
  res.set('Access-Control-Allow-Origin', ORIGINS.includes(origin) ? origin : ORIGINS[0]);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' });
  const fail = (code, error) => res.status(code).json({ ok: false, error });
  try {
    const raw = typeof req.body === 'string' ? req.body : (Buffer.isBuffer(req.rawBody) ? req.rawBody.toString('utf8') : JSON.stringify(req.body || {}));
    if (Buffer.byteLength(raw, 'utf8') > 2048) return fail(400, 'body too large');
    let b; try { b = JSON.parse(raw); } catch (e) { return fail(400, 'invalid json'); }
    const name = String(b.name || '').trim(), phone = String(b.phone || '').trim(), phoneDigits = phone.replace(/\D/g, '');
    if (name.length < 1 || name.length > 30) return fail(400, 'name 1~30자');
    if (phoneDigits.length < 9 || phoneDigits.length > 11) return fail(400, 'phone 9~11자리');
    const now = Date.now(), hits = (RATE.get(phoneDigits) || []).filter(t => now - t < 60000);
    if (hits.length >= 5) return fail(429, 'too many requests');
    hits.push(now); RATE.set(phoneDigits, hits);
    let ts = new Date(String(b.ts || '')); if (isNaN(ts.getTime())) ts = new Date(now);
    const p = n => String(n).padStart(2, '0');
    const minute = ts.getUTCFullYear() + p(ts.getUTCMonth() + 1) + p(ts.getUTCDate()) + p(ts.getUTCHours()) + p(ts.getUTCMinutes());
    const id = 'imweb_' + phoneDigits + '_' + minute;
    const ref = db.collection('leads').doc(id);
    let created = false;
    await db.runTransaction(async tx => {
      const cur = await tx.get(ref); created = !cur.exists;
      const doc = { name, phone, phoneDigits, method: String(b.method || '').trim().slice(0, 20), event: ['참여', '미참여'].includes(String(b.event || '').trim()) ? String(b.event).trim() : '', source: String(b.source || 'imweb').trim().slice(0, 20), submittedAt: admin.firestore.Timestamp.fromDate(ts), channel: 'homepage', updatedAt: admin.firestore.FieldValue.serverTimestamp() };
      if (!cur.exists) Object.assign(doc, { status: 'new', createdAt: admin.firestore.FieldValue.serverTimestamp() });
      tx.set(ref, doc, { merge: true });
    });
    if (created) await notifySlack({ name, phone, method: String(b.method || '').trim(), event: String(b.event || '').trim(), ts }).catch(e => console.error('slack', e.message));
    return res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return fail(500, 'server error');
  }
});

// ── AI 상담 도우미: POST /ai  (Authorization: Bearer <Firebase ID token>) ──
// 본문 JSON { messages:[{role:'user'|'assistant', content}], context:string }  → { ok:true, text }
let KNOWLEDGE = ''; try { KNOWLEDGE = fs.readFileSync(path.join(__dirname, 'knowledge.txt'), 'utf8'); } catch (e) { console.error('knowledge.txt 없음', e.message); }
const RULES = `당신은 '우동지'(에듀포워드) 상담사를 실시간으로 돕는 내부 AI 도우미다. 상담사는 지금 점주(고객)와 전화·채팅 중이며, 당신의 답을 보며 바로 응대한다. 우동지는 페이앤스토어의 딜러사로 네이버페이 커넥트(+카드단말기·포스) 도입 상담을 한다.

답변 규칙
- 한국어. 짧은 요점 정리: 굵은 소제목 없이 3~6개의 불릿(각 1~2문장). 첫 불릿은 "지금 이렇게 말하세요:" 로 시작해 점주에게 바로 읽어줄 수 있는 한 문장 멘트(따옴표)를 준다. 이어서 확인할 것·다음 액션·주의점.
- 근거는 아래 [지식]만 사용. 지식에 없는 수수료·기간·금액·정책은 단정하지 말고 "담당자(관리자) 확인 후 안내"로 표시.
- 절대 금지: 위약금 대납 약속, 확정되지 않은 조건 약속, 무리한 해지 유도, 대형가맹점(연매출 3억 초과)에 할인 제공. 합법 업종은 카드가맹 가능.
- 핵심 원칙: 기존 약정 잔여 개월·위약금은 투명하게 확인/안내 → (남은 위약금 + 앞으로 낮은 CMS) vs 현재 부담 비교 → 잔여가 짧으면 만료 시점에 맞춰 재연락 약속(날짜 확보). 커넥트+CAT(SET-07)은 월 0원(3억 이하). 커넥트는 모든 구성에 필수, 결제(밴)를 우리 쪽으로 가져와야 함.
- 상담사에게 말하는 톤(~하세요/~해요). 고객용 멘트는 정중한 존댓말(~습니다/~세요).
- 마크다운은 불릿(- )과 **굵게**만. 표·헤딩 금지. 400자 안쪽.`;
const AI_RATE = new Map();
exports.ai = onRequest({ region: 'asia-northeast3', cors: false, maxInstances: 5, timeoutSeconds: 60, memory: '512MiB', invoker: 'public', serviceAccount: 'firebase-adminsdk-fbsvc@udongj-5d8da.iam.gserviceaccount.com' }, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' });
  const fail = (code, error) => res.status(code).json({ ok: false, error });
  try {
    const m = /^Bearer (.+)$/.exec(req.get('authorization') || ''); if (!m) return fail(401, '로그인이 필요해요');
    let tok; try { tok = await admin.auth().verifyIdToken(m[1]); } catch (e) { return fail(401, '로그인 정보가 만료됐어요. 새로고침 후 다시 시도하세요'); }
    const email = String(tok.email || '').toLowerCase(); if (!email) return fail(401, '이메일 없는 계정');
    const uDoc = await db.collection('users').doc(email).get();
    const isRoot = email === 'daylightism@gmail.com';
    if (!isRoot && (!uDoc.exists || !uDoc.data().role)) return fail(403, '우동지 구성원으로 등록된 계정만 쓸 수 있어요');
    const role = isRoot ? 'super' : uDoc.data().role; if (role === 'close') return fail(403, '이 역할은 AI 도우미를 쓸 수 없어요');
    const now = Date.now(), hits = (AI_RATE.get(email) || []).filter(t => now - t < 60000); if (hits.length >= 20) return fail(429, '잠시 후 다시 시도하세요 (1분 20회)'); hits.push(now); AI_RATE.set(email, hits);
    const key = await aiKey(); if (!key) return fail(503, 'AI 서버 키가 아직 설정되지 않았어요. 관리자에게 알려주세요');
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    let msgs = Array.isArray(b.messages) ? b.messages : []; msgs = msgs.filter(x => x && (x.role === 'user' || x.role === 'assistant') && typeof x.content === 'string' && x.content.trim()).slice(-12).map(x => ({ role: x.role, content: x.content.slice(0, 3000) }));
    if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return fail(400, '질문이 없어요');
    const context = String(b.context || '').slice(0, 2000);
    const system = [{ type: 'text', text: RULES }, { type: 'text', text: '[지식]\n' + KNOWLEDGE, cache_control: { type: 'ephemeral', ttl: '1h' } }];
    if (context) system.push({ type: 'text', text: '[지금 상담 중인 고객 화면 정보]\n' + context });
    const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'extended-cache-ttl-2025-04-11' }, body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 600, system, messages: msgs }) });
    const j = await r.json();
    if (!r.ok) { console.error('anthropic', r.status, JSON.stringify(j).slice(0, 500)); return fail(502, 'AI 응답 실패 (' + (j.error && j.error.message ? j.error.message.slice(0, 120) : r.status) + ')'); }
    const text = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
    const q = msgs[msgs.length - 1].content;
    db.collection('ailogs').add({ email, name: uDoc.exists ? (uDoc.data().name || '') : '', q, a: text, context, turns: msgs.length, model: j.model || '', usage: j.usage || null, at: admin.firestore.FieldValue.serverTimestamp() }).catch(e => console.error('log', e.message));
    return res.status(200).json({ ok: true, text });
  } catch (e) {
    console.error(e);
    return fail(500, 'server error');
  }
});
