/**
 * Vercel serverless: commit one binary file via GitHub Contents API.
 *
 * Env:
 *   GITHUB_TOKEN — PAT with contents:write on the repo
 *   GITHUB_REPO — owner/repo-name
 *   SUPABASE_URL, SUPABASE_ANON_KEY — verify Authorization: Bearer <user access_token>
 *   GITHUB_BRANCH — optional, default main
 */
const ALLOWED_MIME = new Set(['image/jpeg', 'image/webp']);

async function verifySupabaseUser(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const jwt = authHeader.slice(7).trim();
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon || !jwt) return null;
  const r = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: anon,
    },
  });
  if (!r.ok) return null;
  try {
    return await r.json();
  } catch {
    return null;
  }
}

function isSafeRepoPath(filePath) {
  if (filePath.includes('..')) return false;
  return /^public\/assets\/images\/[a-z0-9][a-z0-9.-]*\/[a-zA-Z0-9._-]+$/.test(filePath);
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const user = await verifySupabaseUser(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized — sign in to the admin, then try again.' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !repoFull || !repoFull.includes('/')) {
    res.status(500).json({ error: 'Server missing GITHUB_TOKEN or GITHUB_REPO' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { path: filePath, contentBase64, mime } = body;

  if (!filePath || typeof filePath !== 'string' || !contentBase64 || typeof contentBase64 !== 'string') {
    res.status(400).json({ error: 'Expected path and contentBase64' });
    return;
  }

  if (!isSafeRepoPath(filePath)) {
    res.status(400).json({ error: 'Invalid path' });
    return;
  }

  if (mime && !ALLOWED_MIME.has(mime)) {
    res.status(400).json({ error: 'Only image/jpeg and image/webp are allowed for Git commits' });
    return;
  }

  const b64 = contentBase64.replace(/\s/g, '');
  const approxBytes = (b64.length * 3) / 4;
  if (approxBytes > 4 * 1024 * 1024) {
    res.status(413).json({ error: 'File too large (max 4 MiB for this endpoint)' });
    return;
  }

  const parts = repoFull.split('/');
  const owner = parts[0];
  const repo = parts.slice(1).join('/');
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  const apiPath = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

  const putBody = {
    message: `cms(media): add ${filePath}`,
    content: b64,
    branch,
  };

  const ghRes = await fetch(apiPath, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(putBody),
  });

  const text = await ghRes.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { message: text };
  }

  if (!ghRes.ok) {
    res.status(502).json({
      error: json.message || json.error || `GitHub error ${ghRes.status}`,
    });
    return;
  }

  res.status(200).json({
    path: filePath,
    commitSha: json.commit && json.commit.sha,
  });
};
