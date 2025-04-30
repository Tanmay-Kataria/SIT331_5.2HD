// src/services/artworkService.js
import { prisma } from '../prisma/client.js';

export const createArtwork = async (data) => {
  // Validate required fields
  if (!data.title || !data.artistId) {
    throw new Error('Title and artistId are required');
  }

  return await prisma.artwork.create({
    data: {
      ...data,
      creationYear: data.creationYear || new Date().getFullYear(),
      // Convert string IDs to ObjectId automatically
      artistId: data.artistId,
      symbolId: data.symbolId || null,
      exhibitionId: data.exhibitionId || null
    },
    include: {
      artist: true,
      symbol: true,
      exhibition: true
    }
  });
};

export const getArtworkById = async (id) => {
  return await prisma.artwork.findUnique({
    where: { id },
    include: {
      artist: { select: { id: true, name: true } },
      symbol: { select: { id: true, name: true } },
      exhibition: { select: { id: true, title: true } },
      comments: {
        include: { user: { select: { id: true, auth0Id: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

export const getAllArtworks = async (filters = {}) => {
  const { artistId, symbolId, exhibitionId, search, page = 1, limit = 10 } = filters;
  
  const where = {};
  
  if (artistId) where.artistId = artistId;
  if (symbolId) where.symbolId = symbolId;
  if (exhibitionId) where.exhibitionId = exhibitionId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [artworks, total] = await Promise.all([
    prisma.artwork.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        artist: { select: { name: true } },
        symbol: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.artwork.count({ where })
  ]);

  return {
    data: artworks,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const updateArtwork = async (id, data) => {
  return await prisma.artwork.update({
    where: { id },
    data: {
      ...data,
      // Ensure proper type conversion
      ...(data.artistId && { artistId: data.artistId }),
      ...(data.symbolId && { symbolId: data.symbolId }),
      ...(data.exhibitionId && { exhibitionId: data.exhibitionId })
    },
    include: {
      artist: true,
      symbol: true
    }
  });
};

export const deleteArtwork = async (id) => {
  return await prisma.artwork.delete({
    where: { id }
  });
};

export const addArtworkToExhibition = async (artworkId, exhibitionId) => {
  return await prisma.artwork.update({
    where: { id: artworkId },
    data: { exhibitionId },
    include: { exhibition: true }
  });
};

export const removeArtworkFromExhibition = async (artworkId) => {
  return await prisma.artwork.update({
    where: { id: artworkId },
    data: { exhibitionId: null }
  });
};