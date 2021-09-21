module.exports = {
    ...require('../../jest.config'),
    collectCoverageFrom: ['./src/**/*', '!./src/**/*.stories.tsx', '!./src/**/*.mock.ts', '!./src/index.ts'],
}
