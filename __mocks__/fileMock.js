// __mocks__/fileMock.js

// Mock for file imports (images, fonts, etc.)
module.exports = 'test-file-stub';

// Mock for specific file extensions
module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    return 'fileMock';
  },
};
