<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ email: string }>();

const title = 'Thanks for registration.';
const message = [
  'Check your email',
  props.email ? `(${props.email})` : '',
  'for registration confirming.',
].join(' ');

const router = useRouter();
onMounted(async () => {
  // clearing user data from url and history
  if (Object.keys(router.currentRoute.value.query).length) {
    router.push({ query: {}, replace: true });
  }
});
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style></style>
