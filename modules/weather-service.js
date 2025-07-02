import {CONFIG, API_ENDPOINTS} from './config.js';
import {elements} from './ui-controller.js';

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

const getPosition = () =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });


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

    try {
        const url = buildUrl(API_ENDPOINTS.WEATHER, params);
        return await fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Eroare la trimiterea request-ului')
                }

                return res.json();
            }).then(data => {
                const sunrise = new Date((data.sys.sunrise) * 1000);
                const sunset = new Date((data.sys.sunset) * 1000);
                const temUnitMap = {
                    imperial: ' °F',
                    metric: ' °C',
                    standard: ' K'
                }

                return {
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
                }
            });

    } catch (error) {
        console.error("Eroare la obținerea vremii pentru oraș:", error);
        throw new Error("Nu s-au putut obține datele meteo.");
    }
};
