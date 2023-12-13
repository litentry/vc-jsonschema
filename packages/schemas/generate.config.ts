/* eslint-disable */
export default {
  displayName: 'schemas-generate',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  //
  verbose: true,
  testMatch: ['**/generate.ts'],
};
