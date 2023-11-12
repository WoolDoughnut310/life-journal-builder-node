/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  transformIgnorePatterns: ['/node_modules/(?!(@notionhq/client|aws-sdk/clients/s3)/)']
};
