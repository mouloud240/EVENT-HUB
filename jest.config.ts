import type { Config } from 'jest';

const config: Config = {
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    'tests/(.*)': '<rootDir>/__tests__/$1',
  },
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t(sx|s)|js)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: ['node_modules', 'dist'],
  testMatch: ['<rootDir>/src/**/(*.)+(spec).ts'],
};

export default config;
