module.exports = {
    verbose: false,
    testMatch: ["**/tests/**/*.ts?(x)"],
    testPathIgnorePatterns: [ "tests/setup.ts", "tests/util/*"],
    globalSetup: "<rootDir>/tests/setup.ts",
    setupFilesAfterEnv: ["<rootDir>/tests/util/test_util.ts"],
};
