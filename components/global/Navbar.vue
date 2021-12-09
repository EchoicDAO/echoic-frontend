<template>
  <div class="navbar bg-black shadow-lg text-neutral-content">
    <div class="px-2 navbar-start">
      <a href="/" class="text-lg text-white font-bold">Echoic</a>
    </div>
    <div class="hidden navbar-center md:flex">
      <div v-if="isConnected">
        <span class="text-white mt-1 mr-5">{{ account.address | truncateHash(5) }}</span>
      </div>
    </div>

    <div class="navbar-end">
      <div v-if="isConnected">
        <div class="grid grid-cols-2">
          <div class="text-right">
            <span class="text-gray-300 text-sm mt-1 mr-5">ECH</span>
            <br />
            <span class="text-gray-300 text-sm mt-1 mr-5">FTM</span>
          </div>

          <div class="text-right">
            <span class="text-white text-sm mt-1 mr-5">{{ account.balance.ech }}</span>
            <br />
            <span class="text-white text-sm mt-1 mr-5">{{ account.balance.ftm }}</span>
          </div>
        </div>
      </div>

      <div v-else>
        <a
          :href="'https://ftmscan.com/address/' + tokenContract"
          target="_blank"
          class="btn btn-sm bg-black text-white text-xs border-white mx-2"
          >Contract</a
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  components: {},
  computed: {
    ...mapGetters({
      isConnected: 'provider/isConnected',
      account: 'provider/getAccount',
    }),
  },
})
export default class Navbar extends Vue {

  tokenContract: string | undefined = process.env.TOKEN_CONTRACT
}
</script>
