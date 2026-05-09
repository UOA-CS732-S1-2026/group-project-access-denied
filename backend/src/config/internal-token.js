const crypto = require('crypto');

// Process-scoped secret. Shared between the SSRF-prone fetcher (which attaches
// it to every outbound request) and the internal-only endpoint (which requires
// it). Players cannot read it from the API surface — the only way to make a
// request that carries this header is to make the server originate the request.
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN || crypto.randomBytes(16).toString('hex');

module.exports = { INTERNAL_TOKEN };
