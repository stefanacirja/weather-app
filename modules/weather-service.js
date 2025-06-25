import {CONFIG, API_ENDPOINTS} from './config.js';

const buildUrl = (endpoint, params) => {
    const url = new URL(`${CONFIG.API_URL}${endpoint}`);
    url.searchParams.set('appid', CONFIG.API_KEY);
    url.searchParams.set('lang', CONFIG.DEFAULT_LANG);
    url.searchParams.set('units', CONFIG.DEFAULT_UNITS);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    return url.toString();
}


export const getCurrentWeather = async (city = CONFIG.DEFAULT_CITY) => {
    try {
        const url = buildUrl(API_ENDPOINTS.WEATHER, {
            q: city
        })
        return await fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Eroare la trimiterea request-ului')
                }

                return res.json();
            }).then(data => {
                const sunrise = new Date(data.sys.sunrise + 1000);
                const sunset = new Date(data.sys.sunset + 1000);

                return {
                    city: data.name,
                    temperature: Math.round(data.main.temp),
                    humidity: data.main.humidity,
                    wind: Math.round(data.wind.speed * 3.6),
                    sunrise: `${sunrise.getHours()}:${sunrise.getMinutes()}:${sunrise.getSeconds()}`,
                    sunset: `${sunset.getHours()}:${sunset.getMinutes()}:${sunset.getSeconds()}`,
                    description: data.weather[0].description,
                    icon: data.weather[0].icon
                }
            });

    } catch (error) {
        console.error("Eroare la obținerea vremii pentru oraș:", error);
        throw new Error("Nu s-au putut obține datele meteo.");
    }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {...config.MOCK_DATA, city: `Coord: ${lat.toFixed(2)}, ${lon.toFixed(2)}` };

  } catch (error) {
    console.error("Eroare la obținerea vremii pentru coordonate:", error);
    throw new Error("Nu s-au putut obține datele meteo după coordonate.");
  }
}
