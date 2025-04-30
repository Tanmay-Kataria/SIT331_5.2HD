// src/services/exhibitionService.js
export const getExhibitionsNearLocation = async (lng, lat, radius) => {
    return prisma.exhibition.findMany({
      where: {
        location: {
          near: {
            geometry: { type: 'Point', coordinates: [lng, lat] },
            maxDistance: radius,
          },
        },
      },
    });
  };