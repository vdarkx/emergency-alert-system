export const formatDateTime = (timestamp) => {
  if (!timestamp) {
    return "N/A";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString();
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

export const getNearestEmergency = (requests, currentPosition) => {
  if (!currentPosition || !requests.length) {
    return null;
  }

  const validRequests = requests.filter((request) =>
    Number.isFinite(request.latitude) && Number.isFinite(request.longitude)
  );

  if (!validRequests.length) {
    return null;
  }

  let nearest = validRequests[0];
  let shortestDistance = getDistanceKm(
    currentPosition.latitude,
    currentPosition.longitude,
    nearest.latitude,
    nearest.longitude
  );

  validRequests.slice(1).forEach((request) => {
    const distance = getDistanceKm(
      currentPosition.latitude,
      currentPosition.longitude,
      request.latitude,
      request.longitude
    );

    if (distance < shortestDistance) {
      nearest = request;
      shortestDistance = distance;
    }
  });

  return {
    request: nearest,
    distanceKm: shortestDistance.toFixed(2)
  };
};
