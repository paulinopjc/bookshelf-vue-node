<template>
  <div class="text-center py-12 text-gray-500">
    <p class="text-lg mb-2">{{ title }}</p>
    <p class="text-sm">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>