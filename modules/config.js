export const CONFIG = {
    API_KEY: '84ffbb09afa28c0d1d3fc8d4b42cf8ef',
    API_URL: 'https://api.openweathermap.org/data/2.5',
    DEFAULT_UNITS: 'metric',
    DEFAULT_LANG: 'ro',
    DEFAULT_CITY: 'Oradea'
}

export const API_ENDPOINTS = {
    WEATHER: '/weather',
    FORECAST: '/forecast'
}

export const MESAGES = {
    CITY_NOT_FOUND: 'Orasul nu a putut fi gasit',
    NETWORK_ERROR: 'Conexiunea la internet a fost pierduta',
    NETWORK_BACK: 'Conexiunea a fost restabilita'
}

export const MOCK_DATA = {
  name: "Oradea",
  main: {
    temp: 22,
    humidity: 65
  },
  weather: [
    { description: "senin" }
  ],
  wind: {
    speed: 3.2
  }
};