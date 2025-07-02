import { CONFIG } from './config.js';
import { logger } from './logger.js';

export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY;
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS;
  }

  addLocation(weatherData) {
    const location = {
      city: weatherData.city,
      country: weatherData.country,
      timestamp: Date.now(),
      coordinates: {
        lat: weatherData.coordinates.lat,
        lon: weatherData.coordinates.lon,
      },
    };

    let history = this._loadFromStorage();

    const existingIndex = history.findIndex(
      (item) => item.city === location.city && item.country === location.country
    );

    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }

    history.unshift(location);

    if (history.length > this.maxItems) {
      history = history.slice(0, this.maxItems);
    }

    this._saveToStorage(history);
    logger.info('Location added to history', location);
  }

  getHistory() {
    return this._loadFromStorage();
  }

  removeLocation(city) {
    let history = this._loadFromStorage();
    history = history.filter((item) => item.city !== city);
    this._saveToStorage(history);
    logger.info(`Location removed from history: ${city}`);
  }

  clearHistory() {
    this._saveToStorage([]);
    logger.info('Search history cleared');
  }

  _saveToStorage(history) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (e) {
      logger.error('Failed to save history to localStorage', e);
    }
  }

  _loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      logger.error('Failed to load history from localStorage', e);
      return [];
    }
  }
}

export const historyService = new HistoryService();
