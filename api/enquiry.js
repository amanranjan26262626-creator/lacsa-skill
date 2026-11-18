// Records each enquiry in the Vercel function logs (Project → Logs, search "ENQUIRY").
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const clean = (v) => String(v || '').slice(0, 300);
  console.log('ENQUIRY', JSON.stringify({
    time: new Date().toISOString(), name: clean(b.name), phone: clean(b.phone),
    course: clean(b.course), who: clean(b.who), msg: clean(b.msg),
  }));
  return res.status(204).end();
};
