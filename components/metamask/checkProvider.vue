<template>
  <div v-if="!ethereumSupported" class="alert bg-black text-white text-xs p-3">
    <div class="flex-1">
      <label>Unsupported browser detected.</label>
    </div>
    <div class="flex-none">
      <button class="btn btn-xs btn-ghost text-xs" href="https://metamask.io/" target="_blank">Install MetaMask</button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import detectEthereumProvider from '@metamask/detect-provider';

@Component({})
export default class CheckProvider extends Vue {
  ethereumSupported = false;

  async mounted() {
    this.ethereumSupported = (await this.isEthereumSupported()) || false;
  }

  async isEthereumSupported() {
    const provider = await detectEthereumProvider();

    if (provider) {
      console.log('Supported browser detected.');

      return true;
    } else {
      console.log('Unsupported browser detected. You should consider trying MetaMask!');
      return false;
    }
  }
}
</script>
