<script setup lang="ts">
defineOptions({
  name: 'FooterLinks',
})
const title = import.meta.env.VITE_GLOB_APP_TITLE
</script>

<template>
  <a decoration-none target="_blank">{{ title }}</a>
</template>
