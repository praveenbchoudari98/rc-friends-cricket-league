/**
 * Save data to localStorage
 * @param key The key to store the data under
 * @param data The data to store
 */
export const saveToStorage = (key: string, data: any): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        throw error;
    }
};

/**
 * Load data from localStorage
 * @param key The key to load the data from
 * @returns The stored data, or null if no data exists
 */
export const loadFromStorage = (key: string): any => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        throw error;
    }
}; 