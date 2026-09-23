const crypto = require('crypto');

const TOKEN_SECRET = process.env.AUTH_SECRET || 'capacity-connect-development-secret';
const TOKEN_TTL_SECONDS = 60 * 60 * 8;

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const decode = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

const sign = (value) => crypto
  .createHmac('sha256', TOKEN_SECRET)
  .update(value)
  .digest('base64url');

const createToken = (user) => {
  const payload = encode({
    userId: user._id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });
  return `${payload}.${sign(payload)}`;
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const [payload, signature] = token.split('.');
    const expectedSignature = sign(payload);
    const signaturesMatch = signature
      && signature.length === expectedSignature.length
      && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    const decoded = decode(payload);

    if (!signaturesMatch || !decoded.userId || decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
    }

    req.user = decoded;
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
};

module.exports = { createToken, requireAuth };