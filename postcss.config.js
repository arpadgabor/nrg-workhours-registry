module.exports = {
  plugins: {
    'postcss-import': require('postcss-import'),
    'postcss-nested': require('postcss-nested'),
    tailwindcss: require('./tailwind.config'),
    autoprefixer: require('autoprefixer'),
  },
}