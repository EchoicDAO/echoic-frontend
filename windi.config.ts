import { transform } from 'windicss/helpers';

module.exports = {
  plugins: [transform('daisyui')],
  daisyui: {
    themes: ['cyberpunk'],
  },
};
