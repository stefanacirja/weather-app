// Colectăm toate elementele DOM într-un singur obiect
export const elements = {
  cityInput: document.querySelector('#city-input'),
  searchBtn: document.querySelector('#search-btn'),
  loading: document.querySelector('#loading'),
  error: document.querySelector('#error'),
  weatherDisplay: document.querySelector('#weather-display'),
  cityName: document.querySelector('#city-name'),
  temperature: document.querySelector('#temperature'),
  humidity: document.querySelector('#humidity'),
  wind: document.querySelector('#wind'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset'),
  description: document.querySelector('#description')
};

// Afișează spinnerul de încărcare
export const showLoading = () => {
  elements.loading.classList.remove('hidden');
  elements.weatherDisplay.classList.add('hidden');
  elements.error.classList.add('hidden');
};

// Ascunde spinnerul
export const hideLoading = () => {
  elements.loading.classList.add('hidden');
};

// Afișează o eroare
export const showError = (message) => {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
  elements.weatherDisplay.classList.add('hidden');
};

// Afișează datele meteo în interfață
export const displayWeather = (data) => {
  elements.cityName.textContent = data.city;
  elements.temperature.textContent = data.temperature;
  elements.humidity.textContent = data.humidity;
  elements.wind.textContent = data.wind;
  elements.sunrise.textContent = data.sunrise;
  elements.sunset.textContent = data.sunset;
  elements.description.textContent = data.description;

  elements.weatherDisplay.classList.remove('hidden');
};

// Obține textul introdus de utilizator
export const getCityInput = () => elements.cityInput.value.trim();

// Șterge inputul după căutare
export const clearInput = () => {
  elements.cityInput.value = '';
};
