module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.[jt]s'],
    collectCoverageFrom: ['src/**/*.{js,ts}'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/',
      '/src/app.js',
      '/src/prisma/client.js'
    ]
  };