// src/controllers/artworkController.js
import {prisma} from '../../prisma/client.js';

export const getArtworks = async (req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      include: { artist: true, symbol: true }
    });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArtworkById = async (req, res) => {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: req.params.id },
      include: { artist: true, symbol: true }
    });

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createArtwork = async (req, res) => {
  try {
    const artwork = await prisma.artwork.create({
      data: req.body
    });
    res.status(201).json(artwork);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateArtwork = async (req, res) => {
  try {
    const updatedArtwork = await prisma.artwork.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updatedArtwork);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteArtwork = async (req, res) => {
  try {
    await prisma.artwork.delete({
      where: { id: req.params.id }
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};