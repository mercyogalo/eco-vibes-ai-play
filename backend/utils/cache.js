class Cache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  set(key, value, ttl = 3600) {
    // ttl in seconds
    this.store.set(key, value);

    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set new timer to delete key after ttl
    const timer = setTimeout(() => {
      this.store.delete(key);
      this.timers.delete(key);
    }, ttl * 1000);

    this.timers.set(key, timer);
  }

  get(key) {
    return this.store.get(key) || null;
  }

  delete(key) {
    this.store.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  clear() {
    this.store.clear();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  getStats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

module.exports = new Cache();