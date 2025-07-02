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
  description: document.querySelector('#description'),
  descriptionIcon: document.querySelector('#description-icon'),
  unitSelector: document.querySelector('#unit-select'),
  langSelector: document.querySelector('#lang-select'),
  historySection: document.querySelector('#history-section'),
  historyList: document.querySelector('#history-list'),
  clearHistoryBtn: document.querySelector('#clear-history-btn'),
};

export const showLoading = () => {
  elements.loading.classList.remove('hidden');
  elements.weatherDisplay.classList.add('hidden');
  elements.error.classList.add('hidden');
};

export const hideLoading = () => {
  elements.loading.classList.add('hidden');
};

export const showError = (message) => {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
  elements.weatherDisplay.classList.add('hidden');
};

export const displayWeather = (data) => {
  elements.cityName.textContent = data.city;
  elements.temperature.textContent = data.temperature;
  elements.humidity.textContent = data.humidity;
  elements.wind.textContent = data.wind;
  elements.sunrise.textContent = data.sunrise;
  elements.sunset.textContent = data.sunset;
  elements.description.textContent = data.description;
  elements.descriptionIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`

  elements.weatherDisplay.classList.remove('hidden');
};

export const getCityInput = () => elements.cityInput.value.trim();

export const clearInput = () => {
  elements.cityInput.value = '';
};

export const renderHistory = (historyItems) => {
  elements.historyList.innerHTML = '';

  if (historyItems.length === 0) {
    elements.historyList.innerHTML = '<div class="empty">Istoricul este gol.</div>';
    return;
  }

  historyItems.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('history-item');
    div.setAttribute('data-index', index);

    div.innerHTML = `
      <div class="city-info"><strong>${item.city}, ${item.country}</strong></div>
      <div class="timestamp">${formatRelativeTime(item.timestamp)}</div>
    `;

    elements.historyList.appendChild(div);
  });
}

export const formatRelativeTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'acum câteva secunde';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minut${minutes === 1 ? '' : 'e'} în urmă`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} or${hours === 1 ? 'ă' : 'e'} în urmă`;
  const days = Math.floor(hours / 24);
  return `${days} zi${days === 1 ? '' : 'le'} în urmă`;
}
