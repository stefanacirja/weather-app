export const getCurrentWeather = async (city) => {
  try {
    // Simulează întârzierea unui apel API (~1 sec)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return import('./config.js').then((config) => {
        const data = {...config.MOCK_DATA, name: city };
        return {
            city: data.name,
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 3.6),
            sunrise: "N/A",
            sunset: "N/A",
            description: data.weather[0].description
        }
    })

  } catch (error) {
    console.error("Eroare la obținerea vremii pentru oraș:", error);
    throw new Error("Nu s-au putut obține datele meteo.");
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // MOCK DATA – poți genera date diferite în funcție de lat/lon
    return import('./config.js').then((config) => {
        return {...config.MOCK_DATA, city: `Coord: ${lat.toFixed(2)}, ${lon.toFixed(2)}` };
    })

  } catch (error) {
    console.error("Eroare la obținerea vremii pentru coordonate:", error);
    throw new Error("Nu s-au putut obține datele meteo după coordonate.");
  }
}
