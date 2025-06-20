import { getCurrentWeather } from './modules/weather-service.js';
import {
  elements,
  showLoading,
  hideLoading,
  showError,
  displayWeather,
  getCityInput,
  clearInput
} from './modules/ui-controller.js';

// Validează orașul
const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

// Handlere pentru căutare
const handleSearch = async () => {
  const city = getCityInput();

  if (!isValidCity(city)) {
    showError('Introdu un oraș valid!');
    return;
  }

  clearInput();
  showLoading();

  try {
    const data = await getCurrentWeather(city);
    hideLoading();
    displayWeather(data);
  } catch (err) {
    hideLoading();
    showError('Eroare la obținerea datelor meteo.');
    console.error(err);
  }
};

// Event listeners
const setupEventListeners = () => {
  // Clic pe buton
  elements.searchBtn.addEventListener('click', handleSearch);

  // Apăsare Enter în input
  elements.cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });
};

const displayDefaultWeather = async () => {
  const defaultCity = 'București';

  showLoading();

  try {
    const data = await getCurrentWeather(defaultCity);
    hideLoading();
    displayWeather(data);
  } catch (err) {
    hideLoading();
    showError(`Nu am putut încărca vremea pentru ${defaultCity}.`);
    console.error(err);
  }
};


// Inițializare aplicație
const init = () => {
  setupEventListeners();
  displayDefaultWeather();
};

init();
