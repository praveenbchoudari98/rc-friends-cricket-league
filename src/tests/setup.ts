import '@testing-library/jest-dom';

// Mock UUID generation to return predictable values
jest.mock('../utils/uuid', () => ({
    generateUUID: () => 'test-uuid'
}));

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid'
    }
}); 