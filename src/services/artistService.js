import { prisma } from '../../prisma/client.js';

export const getArtists = async () => {
  return prisma.artist.findMany({
    include: { artworks: true }
  });
};

export const createArtist = async (artistData) => {
  if (!artistData.name || !artistData.nationality) {
    throw new Error('Name and nationality are required');
  }
  return prisma.artist.create({
    data: artistData
  });
};