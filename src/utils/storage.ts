const CHUNK_SIZE = 500000; // 500KB chunks
const MAX_CHUNKS = 10;

export const saveToStorage = (key: string, data: any) => {
    try {
        // First try normal storage
        const jsonString = JSON.stringify(data);
        try {
            localStorage.setItem(key, jsonString);
            // If successful, clean up any chunks
            for (let i = 0; i < MAX_CHUNKS; i++) {
                localStorage.removeItem(`${key}_chunk_${i}`);
            }
            return;
        } catch (e) {
            // If failed, try chunked storage
            console.log('Normal storage failed, trying chunked storage');
        }

        // Clear existing chunks
        for (let i = 0; i < MAX_CHUNKS; i++) {
            localStorage.removeItem(`${key}_chunk_${i}`);
        }

        // Split data into chunks
        const chunks = [];
        for (let i = 0; i < jsonString.length; i += CHUNK_SIZE) {
            chunks.push(jsonString.slice(i, i + CHUNK_SIZE));
        }

        if (chunks.length > MAX_CHUNKS) {
            throw new Error('Data too large for storage');
        }

        // Store chunk count
        localStorage.setItem(`${key}_chunks`, chunks.length.toString());

        // Store chunks
        chunks.forEach((chunk, index) => {
            localStorage.setItem(`${key}_chunk_${index}`, chunk);
        });

    } catch (error) {
        console.error('Storage error:', error);
        throw error;
    }
};

export const loadFromStorage = (key: string) => {
    try {
        // Try normal storage first
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }

        // Check for chunks
        const chunkCount = localStorage.getItem(`${key}_chunks`);
        if (!chunkCount) {
            return null;
        }

        // Reconstruct from chunks
        let jsonString = '';
        for (let i = 0; i < parseInt(chunkCount); i++) {
            const chunk = localStorage.getItem(`${key}_chunk_${i}`);
            if (!chunk) {
                throw new Error('Missing chunk in storage');
            }
            jsonString += chunk;
        }

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Storage error:', error);
        throw error;
    }
};

export const clearStorage = (key: string) => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_chunks`);
    for (let i = 0; i < MAX_CHUNKS; i++) {
        localStorage.removeItem(`${key}_chunk_${i}`);
    }
}; 