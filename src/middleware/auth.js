// src/middleware/auth.js
import { expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';

export const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256']
});

export const checkRole = (role) => (req, res, next) => {
  const userRoles = req.auth?.payload?.['https://ngv-api/roles'] || [];
  if (userRoles.includes(role)) {
    return next();
  }
  res.status(403).json({ error: 'Insufficient permissions' });
};
export const checkPermission = (permission) => (req, res, next) => {
  const permissions = req.auth?.payload?.permissions || [];
  if (permissions.includes(permission)) {
    return next();
  }
  res.status(403).json({ error: `Requires ${permission} permission` });
};