<template>
  <div>
    <div v-if="network.id === 250" class="alert bg-black text-white text-xs p-3">
      <div class="flex-1">
        <svg class="w-3 h-3 mt-1 text-success" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
        <label class="ml-2">Fantom Opera</label>
      </div>
    </div>

    <div v-else-if="network.id === 4002" class="alert bg-black text-white text-xs p-3">
      <div class="flex-1">
        <svg class="w-3 h-3 mt-1 text-warning" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
        <label class="ml-2">Fantom Testnet</label>
      </div>
      <div class="flex-none">
        <button class="btn btn-xs btn-ghost text-xs" @click="switchNetwork">Switch Network</button>
      </div>
    </div>

    <div v-else class="alert bg-black text-white text-xs p-3">
      <div class="flex-1">
        <svg class="w-3 h-3 mt-1 text-error" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
        <label class="ml-2">Not Connected</label>
      </div>
      <div class="flex-none">
        <button class="btn btn-xs btn-ghost text-xs" @click="switchNetwork">Switch Network</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters({
      network: 'provider/getNetwork',
    }),
  },
})
export default class ConnectWallet extends Vue {
  networkTimer: ReturnType<typeof setInterval> | undefined = undefined;

  async switchNetwork() {
    await this.$store.dispatch('provider/switchNetwork');
  }

  async created() {
    this.pollNetwork();
  }

  beforeDestroy(): void {
    if (this.networkTimer) {
      clearInterval(this.networkTimer);
    }
  }

  async pollNetwork() {
    await this.$store.dispatch('provider/intializeNetwork');

    this.networkTimer = setInterval(() => {
      this.$store.dispatch('provider/intializeNetwork');
    }, 10000);
  }
}
</script>
