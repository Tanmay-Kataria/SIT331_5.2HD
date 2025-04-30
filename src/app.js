import express from 'express';
import { prisma } from '../prisma/client.js';
import { setupSwagger } from './utils/swagger.js';
import artistRoutes from './routes/artistRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import exhibitionRoutes from './routes/exhibitionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { checkJwt } from './middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Swagger Documentation
setupSwagger(app);

// Public Routes (Authentication)
app.use('/auth', authRoutes);

// Authenticated Routes
app.use('/api/artists', checkJwt, artistRoutes);
app.use('/api/artworks', checkJwt, artworkRoutes);
app.use('/api/exhibitions', checkJwt, exhibitionRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Database Connection & Server Start
prisma.$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });