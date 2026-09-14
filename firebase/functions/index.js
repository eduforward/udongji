// 우동지 CRM — 홈페이지(아임웹) 상담신청 수신: POST /lead
// 본문: text/plain JSON {name, phone, method, source, ts} → Firestore leads/imweb_{전화숫자}_{분단위}
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const ORIGINS = ['https://udongji.co.kr', 'https://www.udongji.co.kr'];
const RATE = new Map(); // phoneDigits → [timestamps] (인스턴스 메모리, 최소 남용 방지)

exports.lead = onRequest({ region: 'asia-northeast3', cors: false, maxInstances: 5 }, async (req, res) => {
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
    await db.runTransaction(async tx => {
      const cur = await tx.get(ref);
      const doc = { name, phone, phoneDigits, method: String(b.method || '').trim().slice(0, 20), source: String(b.source || 'imweb').trim().slice(0, 20), submittedAt: admin.firestore.Timestamp.fromDate(ts), channel: 'homepage', updatedAt: admin.firestore.FieldValue.serverTimestamp() };
      if (!cur.exists) Object.assign(doc, { status: 'new', createdAt: admin.firestore.FieldValue.serverTimestamp() });
      tx.set(ref, doc, { merge: true });
    });
    return res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return fail(500, 'server error');
  }
});
