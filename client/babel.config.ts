module.exports = {
  comments: false,
  presets: ['@babel/preset-env', '@babel/preset-react'],
  overrides: [
    {
      test: /\.tsx?$/,
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
        [
          '@babel/typescript',
          {
            allExtensions: true,
            isTSX: true,
            esModuleInterop: true,
          },
        ],
      ],
    },
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
}
