module.exports = {
    parser: '@babel/eslint-parser',
    extends: ['eslint:recommended', 'google'],
    env: {
        browser: true,
        node: true
    },
    rules: {
        'comma-dangle': 'off',
        'indent': ['error', 4],
        'max-len': ['error', 120]
    }
};
