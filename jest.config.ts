import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  displayName: 'Password Validator',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/src/'],
  testMatch: ['**/test/**/*.ts', '**/?(*.)+(spec|test).ts'],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
};

export default config;
