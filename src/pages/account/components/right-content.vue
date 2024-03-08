<script setup lang="ts">
import { ref } from "vue";
import articleTab from "./post-tab.vue";
import PostVO = API.PostVO;
import { listMyPostVoUsingPost } from "~/servers/api/postController.ts";
import OrderTab from "~/pages/account/components/order-tab.vue";
import TaskTab from "~/pages/account/components/task-tab.vue";

// const { t } = useI18n()

const activeKey = ref();

const dataSource = ref<PostVO[]>();

async function getData() {
  const res = await listMyPostVoUsingPost();
  dataSource.value = res.data;
}

onMounted(() => {
  getData();
});
</script>

<template>
  <a-card :borderer="false">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="任务">
        <task-tab />
      </a-tab-pane>
      <a-tab-pane key="3" tab="文章">
        <article-tab :data-source="dataSource" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="订单" force-render>
        <OrderTab />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<style scoped lang="less">
:deep(.ant-list-item) {
  flex-direction: column !important;
  align-items: normal !important;
}

:deep(.ant-btn) {
  padding-left: 0;
}
</style>
