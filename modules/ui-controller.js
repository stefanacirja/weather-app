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
  descriptionIcon: document.querySelector('#description-icon')
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
