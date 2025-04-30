import {prisma} from '../../prisma/client.js';
import { getArtists, createArtist } from '../services/artistService.js';

export const getAllArtists = async (req, res) => {
  try {
    const artists = await getArtists();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addArtist = async (req, res) => {
  try {
    const artist = await createArtist(req.body);
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};