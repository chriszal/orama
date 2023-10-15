export const isPointInGreece = (longitude, latitude) => {
    // Approximate boundaries of Greece
    const GREECE_BOUNDS = {
      WEST: 19.3,
      EAST: 29.7,
      NORTH: 42,
      SOUTH: 34.8,
    };
    return (
      longitude >= GREECE_BOUNDS.WEST &&
      longitude <= GREECE_BOUNDS.EAST &&
      latitude >= GREECE_BOUNDS.SOUTH &&
      latitude <= GREECE_BOUNDS.NORTH
    );
  };
  