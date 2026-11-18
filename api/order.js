// Creates a Razorpay order for the ₹999 bootcamp fee.
// Needs RAZORPAY_KEY_SECRET (and optionally RAZORPAY_KEY_ID) set in Vercel → Settings → Environment Variables.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_jofPSfDcGHfcvy';
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(503).json({ error: 'Payment key secret not configured' });
  try {
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(keyId + ':' + secret).toString('base64'),
      },
      body: JSON.stringify({
        amount: 99900,
        currency: 'INR',
        receipt: 'bootcamp_' + Date.now(),
        notes: { course: 'AI Skills Bootcamp' },
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: 'Could not create order' });
    return res.status(200).json({ id: data.id, amount: data.amount });
  } catch (e) {
    return res.status(500).json({ error: 'Order request failed' });
  }
};
