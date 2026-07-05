const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'node', // Route Handlers run server-side, not in a browser/jsdom context
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverageFrom: [
    'src/lib/db/**/*.ts',
    'src/lib/utils/**/*.ts',
    'src/app/api/**/route.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
