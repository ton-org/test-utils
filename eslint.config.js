// eslint-disable-next-line @typescript-eslint/no-require-imports
const base = require('@ton/toolchain');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tsEslint = require('@ton/toolchain').tsEslint;

module.exports = [
    ...base,
    {
        plugins: {
            '@typescript-eslint': tsEslint,
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-require-imports': 'warn',
            '@typescript-eslint/no-namespace': 'warn',
            'no-undef': 'warn',
            'no-empty': 'warn',
        },
    },
];
