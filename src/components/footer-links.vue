<script setup lang="ts">
import {GithubOutlined} from '@ant-design/icons-vue'

defineOptions({
  name: 'FooterLinks',
})
const title = import.meta.env.VITE_GLOB_APP_TITLE;
</script>

<template>
  <a decoration-none target="_blank">{{ title }}</a>
</template>
