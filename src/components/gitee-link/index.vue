<script setup lang="ts">
const appStore = useAppStore()
const { layoutSetting } = storeToRefs(appStore)
</script>

<template>
  <a
    target="_blank"
    hover="bg-[var(--hover-color)]"
    flex
    items-center
    h-48px
    px-12px
    text-16px
    class="transition-all-300"
    @click="
      appStore.toggleTheme(layoutSetting.theme === 'dark' ? 'light' : 'dark')
    "
  >
    <!-- 亮色和暗黑模式切换按钮 -->
    <template v-if="layoutSetting.theme === 'light'">
      <carbon-moon />
    </template>
    <template v-else>
      <carbon-sun />
    </template>
  </a>
</template>

<style scoped lang="less"></style>
