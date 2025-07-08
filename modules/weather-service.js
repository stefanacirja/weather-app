import {CONFIG, API_ENDPOINTS} from './config.js';
import {elements} from './ui-controller.js';
import {historyService} from './history-service.js'

/**
 * Builds a complete URL string for API requests by appending endpoint and query parameters.
 *
 * @param {string} endpoint - The API endpoint to append to the base URL.
 * @param {Object} params - An object containing additional query parameters as key-value pairs.
 * @returns {string} The fully constructed URL with all query parameters.
 */
const buildUrl = (endpoint, params) => {
    const url = new URL(`${CONFIG.API_URL}${endpoint}`);
    url.searchParams.set('appid', CONFIG.API_KEY);
    url.searchParams.set('lang', elements.langSelector.value || CONFIG.DEFAULT_LANG);
    url.searchParams.set('units', elements.unitSelector.value || CONFIG.DEFAULT_UNITS);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    return url.toString();
}

/**
 * Returns a Promise that resolves with the user's current geographic position.
 * Utilizes the browser's Geolocation API.
 *
 * @returns {Promise<GeolocationPosition>} A promise that resolves with the position object or rejects with an error.
 */
const getPosition = () =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });


/**
 * Fetches the current weather data for a given city or the user's current location if no city is provided.
 * Utilizes geolocation if available and falls back to a default city if not.
 * Adds the location to the history service upon successful retrieval.
 *
 * @async
 * @param {string} [city] - The name of the city to fetch weather for. If not provided, attempts to use geolocation.
 * @returns {Promise<Object>} An object containing weather information:
 *   - {string} city - The name of the city.
 *   - {string} temperature - The current temperature with unit.
 *   - {string} humidity - The humidity percentage.
 *   - {string} wind - The wind speed in km/h.
 *   - {string} sunrise - The local time of sunrise.
 *   - {string} sunset - The local time of sunset.
 *   - {string} description - Weather description.
 *   - {string} icon - Weather icon code.
 * @throws {Error} If weather data cannot be retrieved.
 */
export const getCurrentWeather = async (city) => {
    const params = {};

    if (!city && navigator.geolocation) {
        try {
            const position = await getPosition();
            params.lat = position.coords.latitude;
            params.lon = position.coords.longitude;
        } catch (err) {
            console.error('Pozitia nu a putut fi detectata');
            params.q = CONFIG.DEFAULT_CITY;
        }
    } else {
        params.q = city || CONFIG.DEFAULT_CITY;
    }

    const url = buildUrl(API_ENDPOINTS.WEATHER, params);
    const cached = weatherCache.get(url);
    if (cached) {
        return cached;
    }

    try {
        const data = await fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Eroare la trimiterea request-ului')
                }
                return res.json();
            });

        const sunrise = new Date((data.sys.sunrise) * 1000);
        const sunset = new Date((data.sys.sunset) * 1000);
        const temUnitMap = {
            imperial: ' °F',
            metric: ' °C',
            standard: ' K'
        }

        historyService.addLocation({
            city: data.name,
            country: data.sys.country,
            coordinates: {
                lat: data.coord.lat,
                lon: data.coord.lon
            }
        })

        const result = {
            city: data.name,
            temperature: Math.round(data.main.temp) + temUnitMap[elements.unitSelector.value],
            humidity: data.main.humidity + ' %',
            wind: Math.round(data.wind.speed * 3.6) + ' km/h',
            sunrise: sunrise.toLocaleTimeString('ro-RO', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            sunset: sunset.toLocaleTimeString('ro-RO', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            description: data.weather[0].description,
            icon: data.weather[0].icon
        };
        weatherCache.set(url, result);
        return result;

    } catch (error) {
        console.error("Eroare la obținerea vremii pentru oraș:", error);
        throw new Error("Nu s-au putut obține datele meteo.");
    }
};

class WeatherCache {
  constructor(maxAge = 10 * 60 * 1000) {
    // 10 minute
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    const { data, timestamp } = entry;
    if (Date.now() - timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }
    return data;
  }

  set(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  cleanup() {
    const now = Date.now();
    for (const [key, { timestamp }] of this.cache.entries()) {
      if (now - timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

export const weatherCache = new WeatherCache();
