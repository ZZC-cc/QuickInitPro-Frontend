<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLayoutMenuProvide } from "~/components/page-container/context.ts";

const appStore = useAppStore();
const { theme } = storeToRefs(appStore);
const { antd } = useI18nLocale();
const layoutMenu = useLayoutMenu();

useLayoutMenuProvide(layoutMenu, appStore);

const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight);

onMounted(() => {
  window.addEventListener("resize", () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
  });
});
</script>

<template>
  <a-config-provider :theme="theme" :locale="antd">
    <a-app
      class="h-full font-chinese antialiased"
      :style="{
        zoom: screenWidth <= 1920 && screenHeight <= 1080 ? '80%' : '100%',
      }"
    >
      <TokenProvider>
        <RouterView />
      </TokenProvider>
    </a-app>
  </a-config-provider>
</template>
