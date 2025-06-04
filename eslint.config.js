const base = require('@ton/toolchain');
const tsEslint = require('@ton/toolchain').tsEslint;

module.exports = [
    ...base,
    {
        plugins: {
            '@typescript-eslint': tsEslint,
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        files: ['src/test/jest.ts', 'src/test/chai.ts'],
        rules: {
            'no-undef': 'off',
            'no-empty': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-namespace': 'off',
        },
    },
];
