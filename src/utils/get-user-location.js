export const getUserLocation = async () => {
    try {
      const response = await fetch(`https://ipapi.co/json/?apikey=${process.env.NEXT_PUBLIC_IPAPI_KEY}`);
      const data = await response.json();
      const { latitude, longitude } = data;
      return { lat: latitude, lon: longitude };
    } catch (error) {
      console.error("Error fetching user location:", error);
      return null;
    }
  };
  