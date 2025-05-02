// src/services/authService.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
const JWT_EXPIRES_IN = '1h';

export const generateAuthToken = (email, name) => {
  // Generate a JWT token with mock user data
  const token = jwt.sign(
    { 
      sub: 'mock-user-id', // Standard OAuth 'sub' claim
      email,
      name,
      'https://ngv-api/roles': ['USER'], // Custom claim for roles
      permissions: ['read:artwork'], // Example permissions
      iat: Math.floor(Date.now() / 1000), // issued at time
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // expires in 1 hour
      aud: process.env.AUTH0_AUDIENCE,
      iss: process.env.AUTH0_ISSUER
    },
    JWT_SECRET,
    { algorithm: 'RS256' } // Matches Auth0's algorithm
  );

  // Log the token for debugging with clear separation
  console.log('\n\n====================================\n');
  console.log('DEBUG JWT TOKEN:', token);
  console.log('\n====================================\n\n');

  return { token };
};