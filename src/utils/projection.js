/**
 * Simple approximate projection for the contiguous U.S.
 * Good enough for a concept animation, not intended for geospatial analysis.
 */
export function projectUSPoint(lat, lon) {
  const minLon = -125;
  const maxLon = -66;
  const minLat = 24;
  const maxLat = 50;

  const x = ((lon - minLon) / (maxLon - minLon)) * 760 + 120;

  // Add a small horizontal curve adjustment so the abstract map feels less flat.
  const normalizedLat = (lat - minLat) / (maxLat - minLat);
  const y = (1 - normalizedLat) * 270 + 160;
  const curve = Math.sin(((lon - minLon) / (maxLon - minLon)) * Math.PI) * 25;

  return {
    x,
    y: y + curve
  };
}
