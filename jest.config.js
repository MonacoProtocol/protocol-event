module.exports = {
    verbose: false,
    testMatch: ["**/tests/**/*.ts?(x)"],
    testPathIgnorePatterns: ["tests/util/constants.ts", "tests/util/test_util.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/util/test_util.ts"],
};
