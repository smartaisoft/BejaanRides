// utils/maps.ts

export const fetchPlaceSuggestions = async (
  query: string,
  apiKey: string,
): Promise<any[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${apiKey}`,
    );
    const data = await response.json();
    return data.status === 'OK' ? data.predictions : [];
  } catch (error) {
    console.error('Places API Error:', error);
    return [];
  }
};
