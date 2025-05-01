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

export const checkPermission = (requiredPermission) => (req, res, next) => {
  const tokenPayload = req.auth?.payload || {};
  
  // Check both Auth0 permissions array and OAuth scope string
  const hasPermission = 
    tokenPayload.permissions?.includes(requiredPermission) ||
    tokenPayload.scope?.split(' ').includes(requiredPermission);

  if (hasPermission) {
    return next();
  }

  // Detailed error response
  res.status(403).json({
    error: 'Insufficient permissions',
    required: requiredPermission,
    available: {
      permissions: tokenPayload.permissions || [],
      scopes: tokenPayload.scope?.split(' ') || []
    },
    decoded_token: tokenPayload // For debugging
  });
};