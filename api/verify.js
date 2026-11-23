// Verifies the Razorpay payment signature after checkout.
const crypto = require('crypto');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = b;
  if (!secret || !o || !p || !s) return res.status(400).json({ verified: false });
  const expected = crypto.createHmac('sha256', secret).update(o + '|' + p).digest('hex');
  const ok = s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected));
  if (ok && b.product === 'workshop') {
    const clean = (v) => String(v || '').slice(0, 100);
    console.log('WORKSHOP_PAID', JSON.stringify({ time: new Date().toISOString(), name: clean(b.name), phone: clean(b.phone), payment: clean(p) }));
  }
  return res.status(ok ? 200 : 400).json({ verified: ok });
};
