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

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

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
  elements.searchBtn.addEventListener('click', handleSearch);

  elements.cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });
};

const displayDefaultWeather = async () => {

    showLoading();

    try {
        const data = await getCurrentWeather();
        console.log(data)
        hideLoading();
        displayWeather(data);
    } catch (err) {
        hideLoading();
        showError(`Nu am putut încărca vremea.`);
        console.error(err);
    }
};

const init = () => {
  setupEventListeners();
  displayDefaultWeather();
};

init();
