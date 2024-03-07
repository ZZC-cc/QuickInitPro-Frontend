<script setup lang="ts">
import { notification } from "ant-design-vue";
import IntroduceRow from "~/pages/home/analysis/introduce-row.vue";
import SalesCard from "~/pages/home/analysis/sales-card.vue";
import TopSearch from "~/pages/home/analysis/components/top-search.vue";
import ProportionSales from "~/pages/home/analysis/proportion-sales.vue";
import OfflineData from "~/pages/home/analysis/offline-data.vue";
import { getNewsNoticeUsingGet } from "~/servers/api/noticeController.ts";

defineOptions({
  name: "Analysis",
});

const loading = ref(false);

const visitData = ref([]);

onMounted(() => {
  getNewsNoticeUsingGet().then((res) => {
    if (res.code === 200 && res.data) {
      notification.success({
        message: res.data?.title,
        description: res.data?.content,
        duration: 5,
        style: {
          width: "100%",
          whiteSpace: "pre-line",
          marginTop: "30px",
        },
      });
    }
  });
});
</script>

<template>
  <page-container>
    <Suspense :fallback="null">
      <IntroduceRow :loading="loading" :visit-data="visitData" />
    </Suspense>

    <Suspense :fallback="null">
      <SalesCard />
    </Suspense>

    <a-row :gutter="24" :style="{ marginTop: '24px' }">
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <TopSearch />
        </Suspense>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <ProportionSales />
        </Suspense>
      </a-col>
    </a-row>

    <Suspense :fallback="null">
      <OfflineData />
    </Suspense>
  </page-container>
</template>
