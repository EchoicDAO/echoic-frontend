import Vue from 'vue';

Vue.filter('truncateHash', function (hash: string, length: number): string {
  if (!hash) {
    return '';
  }

  return hash.slice(0, length) + '...' + hash.slice(42 - length, 42);
});
