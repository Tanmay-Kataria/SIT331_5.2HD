import {prisma} from '../../prisma/client.js';
export const getExhibitions = async (req, res) => {
  try {
    const { upcoming, current, page = 1, limit = 10 } = req.query;
    const where = {};
    const now = new Date();

    // Date filtering
    if (upcoming === 'true') {
      where.startDate = { gt: now };
    }
    if (current === 'true') {
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }

    const exhibitions = await prisma.exhibition.findMany({
      where,
      include: {
        artworks: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            artist: { select: { name: true } }
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { startDate: 'asc' }
    });

    const total = await prisma.exhibition.count({ where });

    res.json({
      data: exhibitions,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch exhibitions',
      details: error.message 
    });
  }
};

export const getExhibitionById = async (req, res) => {
  try {
    const exhibition = await prisma.exhibition.findUnique({
      where: { id: req.params.id },
      include: {
        artworks: {
          include: {
            artist: { select: { id: true, name: true } },
            symbol: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!exhibition) {
      return res.status(404).json({ error: 'Exhibition not found' });
    }

    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch exhibition',
      details: error.message 
    });
  }
};

export const createExhibition = async (req, res) => {
  try {
    const { title, startDate, endDate, artworkIds = [] } = req.body;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Verify artworks exist
    const artworksCount = await prisma.artwork.count({
      where: { id: { in: artworkIds } }
    });
    
    if (artworksCount !== artworkIds.length) {
      return res.status(400).json({ error: 'One or more artworks not found' });
    }

    const exhibition = await prisma.exhibition.create({
      data: {
        title,
        startDate: start,
        endDate: end,
        artworks: { connect: artworkIds.map(id => ({ id })) }
      },
      include: { artworks: true }
    });

    res.status(201).json(exhibition);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create exhibition',
      details: error.message
    });
  }
};

export const updateExhibition = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, artworkIds } = req.body;
    
    const existing = await prisma.exhibition.findUnique({
      where: { id },
      include: { artworks: true }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Exhibition not found' });
    }

    // Calculate artworks to connect/disconnect
    const currentArtworkIds = existing.artworks.map(a => a.id);
    const toConnect = artworkIds?.filter(id => !currentArtworkIds.includes(id)) || [];
    const toDisconnect = currentArtworkIds.filter(id => !artworkIds?.includes(id)) || [];

    const updated = await prisma.exhibition.update({
      where: { id },
      data: {
        title: title || existing.title,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        artworks: {
          connect: toConnect.map(id => ({ id })),
          disconnect: toDisconnect.map(id => ({ id }))
        }
      },
      include: { artworks: true }
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ 
      error: 'Failed to update exhibition',
      details: error.message 
    });
  }
};

export const deleteExhibition = async (req, res) => {
  try {
    await prisma.exhibition.delete({ 
      where: { id: req.params.id } 
    });
    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Exhibition not found' });
    }
    res.status(500).json({ 
      error: 'Failed to delete exhibition',
      details: error.message 
    });
  }
};