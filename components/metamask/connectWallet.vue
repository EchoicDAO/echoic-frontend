<template>
  <div v-if="network.id === 250 || network.id === 4002">
    <div v-if="!isConnected">
      <div class="hidden-sm-and-down">
        <button
          class="btn btn-neutral bg-base-content text-white md:btn-wide lg:btn-wide border-l-0 border-t-0 border-b-3 border-r-0 border-white"
          :disabled="disabled"
          v-on:click="connectWallet"
        >
          <span v-if="!disabled"> Connect Wallet</span>
          <span v-if="disabled"> Connecting</span>
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <div v-if="!isConnected">
      <div class="hidden-sm-and-down">
        <button class="btn md:btn-wide lg:btn-wide" disabled="disabled">
          <span> Connect Wallet</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'nuxt-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters({
      isConnected: 'provider/isConnected',
      network: 'provider/getNetwork',
    }),
  },
})
export default class ConnectWallet extends Vue {
  @Prop({ default: false }) readonly mobile: boolean | undefined;

  disabled = false;

  providerTimer: ReturnType<typeof setInterval> | undefined = undefined;

  created() {
    if (localStorage.getItem('connected') && localStorage.getItem('connected') === 'true') {
      this.$store.dispatch('provider/intializeConnection');
      this.pollConnection();
    }
  }
  beforeDestroy(): void {
    if (this.providerTimer) {
      clearInterval(this.providerTimer);
    }
  }

  async initiateStore() {
    this.$store.dispatch('provider/intializeStore');
  }

  async connectWallet() {
    this.disabled = true;

    const connect = await this.$store.dispatch('provider/intializeConnection');

    if (connect) {
      this.disabled = false;
      this.pollConnection();
    } else {
      this.disabled = false;
    }
  }

  async pollConnection() {
    this.providerTimer = setInterval(() => {
      this.$store.dispatch('provider/intializeConnection');
    }, 5000);
  }
}
</script>
