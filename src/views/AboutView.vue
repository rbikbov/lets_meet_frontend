<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useCounterStore } from '@/stores/counter';

const { count, doubleCount } = storeToRefs(useCounterStore());
const { increment } = useCounterStore();
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <h2>Pinia store tests</h2>
      <p>count = {{ count }}</p>
      <p>doubleCount = {{ doubleCount }}</p>
      <div>
        <button @click="increment">Increment</button>
      </div>
    </div>
  </div>
</template>

<style></style>
