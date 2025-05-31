module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Code Quality
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'warn',

    // Best Practices
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // Style
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',

    // ES6+
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',

    // Performance
    'no-loop-func': 'error',
    'no-new-object': 'error'
  },
  globals: {
    // Web Audio API
    AudioContext: 'readonly',
    webkitAudioContext: 'readonly',
    AnalyserNode: 'readonly',
    MediaStreamAudioSourceNode: 'readonly',

    // Canvas API
    CanvasRenderingContext2D: 'readonly',
    ImageData: 'readonly',

    // File API
    FileReader: 'readonly',
    File: 'readonly',

    // DOM APIs
    requestAnimationFrame: 'readonly',
    cancelAnimationFrame: 'readonly'
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '*.min.js']
};
