// Creates a Razorpay order: ₹999 bootcamp by default, ₹9 when body.product === 'workshop'.
// Needs RAZORPAY_KEY_SECRET (and optionally RAZORPAY_KEY_ID) set in Vercel → Settings → Environment Variables.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_U1jT81imDce1ka';
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(503).json({ error: 'Payment key secret not configured' });
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const P = {
    bootcamp: { amount: 99900, receipt: 'bootcamp_', course: 'AI Skills Bootcamp' },
    workshop: { amount: 900, receipt: 'workshop_', course: 'AI Workshop 28 Nov' },
  };
  const prod = P[b.product] || P.bootcamp;
  try {
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(keyId + ':' + secret).toString('base64'),
      },
      body: JSON.stringify({
        amount: prod.amount,
        currency: 'INR',
        receipt: prod.receipt + Date.now(),
        notes: { course: prod.course },
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: 'Could not create order' });
    return res.status(200).json({ id: data.id, amount: data.amount });
  } catch (e) {
    return res.status(500).json({ error: 'Order request failed' });
  }
};
