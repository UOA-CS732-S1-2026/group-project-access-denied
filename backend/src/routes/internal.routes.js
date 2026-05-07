const express = require('express');
const router = express.Router();
const { INTERNAL_TOKEN } = require('../config/internal-token');

// GET /internal/server-status
// "Internal" service endpoint. Trusts any caller bearing the shared
// X-Internal-Token, on the assumption that only the server itself ever
// attaches it. The image-import fetcher attaches this token to every
// outbound request, so any URL it fetches becomes a trusted caller.
// CTF: intentional vulnerability — SSRF target.
router.get('/server-status', (req, res) => {
  const token = req.headers['x-internal-token'];

  if (token !== INTERNAL_TOKEN) {
    return res.status(403).json({ error: 'Internal endpoint — token required' });
  }

  return res.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    internalNote: process.env.INTERNAL_FLAG || 'CTF{ssrf_localhost_isnt_a_perimeter}',
  });
});

module.exports = router;
