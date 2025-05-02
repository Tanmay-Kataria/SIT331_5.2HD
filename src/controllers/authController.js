// src/controllers/authController.js
import { generateAuthToken } from '../services/authService.js';

export const handleAuth = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { token } = generateAuthToken(email, name || 'Test User');
    
    res.json({ 
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};