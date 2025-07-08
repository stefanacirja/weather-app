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

/**
 * Checks if the provided city name is valid.
 * A valid city name must be at least 2 characters long and contain only letters (including Romanian diacritics), spaces, or hyphens.
 *
 * @param {string} city - The city name to validate.
 * @returns {boolean} True if the city name is valid, false otherwise.
 */
const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

/**
 * Handles the search action for weather data based on user input.
 * Validates the city input, displays loading state, fetches current weather data,
 * and updates the UI with the results or error messages.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the weather data has been fetched and displayed or an error has been handled.
 */
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

/**
 * Handles the click event on a history item.
 * Retrieves the selected item from the history by its index and re-renders the history list.
 * If the item does not exist, the function returns early.
 * Logs an error to the console if re-rendering fails.
 *
 * @async
 * @param {number} index - The index of the history item that was clicked.
 * @returns {Promise<void>}
 */
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

/**
 * Clears the weather search history and updates the UI to reflect the empty history.
 *
 * Calls the `clearHistory` method from `historyService` to remove all stored history,
 * then re-renders the history section with an empty array.
 */
export const onClearHistory = () => {
  historyService.clearHistory();
  renderHistory([]);
};

/**
 * Sets up event listeners for various UI elements in the weather app.
 * - Handles search button clicks, unit and language selection changes, and Enter key presses in the city input.
 * - Handles clicks on history items and the clear history button.
 *
 * @function
 * @returns {void}
 */
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

/**
 * Fetches and displays the current weather data.
 * Shows a loading indicator while fetching, then displays the weather or an error message if the fetch fails.
 * Hides the loading indicator after the operation completes.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the weather data has been displayed or an error has been handled.
 */
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

/**
 * Initializes the weather application by setting up event listeners,
 * displaying the default weather, and rendering the search history.
 */
const init = () => {
  setupEventListeners();
  displayDefaultWeather();
  renderHistory(historyService.getHistory());
};

init();
