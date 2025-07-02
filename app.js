import { getCurrentWeather } from './modules/weather-service.js';
import { historyService } from './modules/history-service.js';
import {
  elements,
  showLoading,
  hideLoading,
  showError,
  displayWeather,
  getCityInput,
  clearInput,
  renderHistory
} from './modules/ui-controller.js';

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

const handleSearch = async () => {
  const city = getCityInput();

  if (city && !isValidCity(city)) {
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

export const onHistoryClick = async (index) => {
  const history = historyService.getHistory();
  const item = history[index];

  if (!item) return;

  try {
    renderHistory(historyService.getHistory());
  } catch (error) {
    console.error('Eroare la reîncărcarea din istoric:', error);
  }
};

export const onClearHistory = () => {
  historyService.clearHistory();
  renderHistory([]);
};

// Event listeners
const setupEventListeners = () => {
  elements.searchBtn.addEventListener('click', handleSearch);
  elements.unitSelector.addEventListener('change', handleSearch);
  elements.langSelector.addEventListener('change', handleSearch);

  elements.cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  elements.historyList.addEventListener('click', (event) => {
    const item = event.target.closest('.history-item');
    if (!item) return;

    const index = parseInt(item.getAttribute('data-index'), 10);
    onHistoryClick(index);
  });

  elements.clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Ești sigur că vrei să ștergi istoricul?')) {
      onClearHistory();
    }
  });
};

const displayDefaultWeather = async () => {

    showLoading();

    try {
        const data = await getCurrentWeather();
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
  renderHistory(historyService.getHistory());
};

init();
