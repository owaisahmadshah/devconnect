export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['module-resolver', {
      root: ['./src'],              // your source folder
      extensions: ['.ts', '.js'],   // allowed extensions
      resolvePath(sourcePath) {
        // remove .js from imports automatically
        if (sourcePath.endsWith('.js')) {
          return sourcePath.replace(/\.js$/, '');
        }
        return sourcePath;
      },
    }],
  ],
};