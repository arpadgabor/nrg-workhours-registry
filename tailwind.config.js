module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/custom-forms')
  ],
  purge: {
    content: [
      'src/**/*.vue',
      'src/assets/css/*.css',
    ]
  },
}
