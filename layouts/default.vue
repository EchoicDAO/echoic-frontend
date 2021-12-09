<template>
  <div class="flex flex-col h-screen">
    <div>
      <Navbar />
      <div class="bg-indigo-700 h-4 mb-6" />
    </div>
    <div class="container mx-auto sm:w-11/12 md:w-10/12 lg:w-11/12 flex-grow h-full">
      <nuxt />
    </div>
    <div>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';

import Navbar from '~/components/global/Navbar.vue';
import Footer from '~/components/global/Footer.vue';

@Component({
  components: {
    Navbar,
    Footer,
  },
})
export default class Layout extends Vue {}
</script>
