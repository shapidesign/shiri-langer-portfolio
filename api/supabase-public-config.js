/**
 * Returns public Supabase client settings for the browser when REACT_APP_* were
 * not available at build time (common with Vercel–Supabase integration).
 */
module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url?.trim() || !publishableKey?.trim()) {
    res.status(404).json({ error: 'not_configured' });
    return;
  }

  if (req.method === 'HEAD') {
    res.status(204).end();
    return;
  }

  res.status(200).json({ url: url.trim(), publishableKey: publishableKey.trim() });
};
