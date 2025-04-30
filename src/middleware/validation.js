// src/middleware/validation.js
export const validateArtwork = (req, res, next) => {
  const { title, creationYear, artistId } = req.body;
  
  if (!title || !creationYear || !artistId) {
    return res.status(400).json({ 
      error: 'Title, creationYear and artistId are required' 
    });
  }

  if (creationYear < 1000 || creationYear > new Date().getFullYear()) {
    return res.status(400).json({ 
      error: 'Invalid creation year' 
    });
  }

  next();
};