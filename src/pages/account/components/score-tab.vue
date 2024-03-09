<script setup lang="ts">
import type { MenuProps, PaginationProps } from "ant-design-vue";

import {
  getMyScoreVoUsingPost,
  searchScoreUsingPost,
} from "~/servers/api/scoreController.ts";
import ScoreVO = API.ScoreVO;
import router from "~/router";

const { userId } = useUserStore();

const message = useMessage();
const columns = shallowRef([
  {
    title: "任务名称",
    dataIndex: "task",
    width: "250px",
  },
  {
    title: "文章名称",
    dataIndex: "post",
    width: "350px",
  },
  // {
  //   title: "用户",
  //   dataIndex: "user",
  // },
  {
    title: "分数",
    dataIndex: "score",
  },
  {
    title: "评价",
    dataIndex: "appraisal",
  },
  {
    title: "负责人",
    dataIndex: "markUser",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
]);
const loading = shallowRef(false);
const pagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30", "40"],
  current: 1,
  total: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `总数据位：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize;
    pagination.current = current;
    init();
  },
});
const dataSource = shallowRef<ScoreVO[]>([]);
const formModel = reactive<ScoreVO>({});

const tableSize = ref<string[]>(["large"]);

const open = ref(false);
const options = computed(() => {
  return columns.value.map((item) => {
    if (item.dataIndex === "action") {
      return {
        label: item.title,
        value: item.dataIndex,
        disabled: true,
      };
    }
    return {
      label: item.title,
      value: item.dataIndex,
    };
  });
});
const dropdownVisible = ref(false);
const getCheckList = computed(() =>
  columns.value.map((item) => item.dataIndex)
);
const state = reactive({
  indeterminate: false,
  checkAll: true,
  checkList: getCheckList.value,
});

async function init() {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await getMyScoreVoUsingPost({
      id: userId,
    });
    dataSource.value = data ?? [];
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

const searchText = ref("");

async function onSearch(searchText: string) {
  const res = await searchScoreUsingPost({ searchText });
  if (res.code === 200) dataSource.value = res.data;
  if (res.data === null) dataSource.value = [];
  message.success("查询成功");
}

async function onReset() {
  // 清空所有参数重新请求
  await init();
}

/**
 * 密度切换
 *
 */
const handleSizeChange: MenuProps["onClick"] = (e) => {
  tableSize.value[0] = e.key as string;
};

/**
 * 过滤
 *
 */
function filterAction(value: string[]) {
  return columns.value.filter((item) => {
    if (value.includes(item.dataIndex)) {
      // 为true时，循环遍历的值会暴露出去
      return true;
    }
    return false;
  });
}

// 备份columns
const filterColumns = ref(filterAction(getCheckList.value));

/**
 * 全选/反选事件
 *
 */

function handleCheckAllChange(e: any) {
  Object.assign(state, {
    checkList: e.target.checked ? getCheckList.value : [],
    indeterminate: true,
  });
  filterColumns.value = e.target.checked
    ? filterAction(getCheckList.value)
    : filterColumns.value.filter((item) => item.dataIndex === "action");
}

watch(
  () => state.checkList,
  (val) => {
    state.indeterminate =
      !!val.length && val.length < getCheckList.value.length;
    state.checkAll = val.length === getCheckList.value.length;
  }
);

/**
 * 重置事件
 *
 */
function handleResetChange() {
  state.checkList = getCheckList.value;
  filterColumns.value = filterAction(getCheckList.value);
}

/**
 * checkbox点击事件
 *
 */
function handleCheckChange(value: any) {
  const filterValue = filterAction(value);
  filterColumns.value = filterValue;
}

onMounted(() => {
  init();
});

const expand = ref(false);

function getArticleDetailLink(postId: any) {
  // 使用路由的 resolve 方法获取文章详情页面的 URL
  const articleDetailUrl = router.resolve({
    name: "PostDetail", // 文章详情页面的路由名称
    params: { id: postId }, // 文章ID作为路由参数
  });
  return articleDetailUrl.href;
}
</script>

<template>
  <a-table
    :loading="loading"
    :columns="filterColumns"
    :data-source="dataSource"
  >
    <template #bodyCell="scope">
      <template v-if="scope?.column?.dataIndex === 'task'">
        <div>
          <b>{{ scope?.record?.task?.taskName }}</b>
        </div>
      </template>
      <template v-if="scope?.column?.dataIndex === 'post'">
        <div>
          <b c-blue-5
            ><a :href="getArticleDetailLink(scope?.record?.task?.post.id)"
              >《{{ scope?.record?.task?.post.title }}》</a
            ></b
          >
        </div>
      </template>
      <template v-if="scope?.column?.dataIndex === 'appraisal'">
        <div c-gray-5>{{ scope?.record?.appraisal }}</div>
        <div c-gray-5 v-if="!scope?.record?.appraisal">- 未评价 -</div>
      </template>
      <template v-if="scope?.column?.dataIndex === 'score'">
        <div v-if="scope?.record?.score !== 0 && scope?.record?.score > 90">
          <b c-green-6>{{ scope?.record?.score }}</b>
        </div>
        <div
          v-else-if="scope?.record?.score !== 0 && scope?.record?.score >= 60"
        >
          <b c-orange-6>{{ scope?.record?.score }}</b>
        </div>
        <div
          v-else-if="scope?.record?.score !== 0 && scope?.record?.score < 60"
        >
          <b c-red-6>{{ scope?.record?.score }}</b>
        </div>
        <div c-gray-5 v-if="scope?.record?.score === 0">- 未打分 -</div>
      </template>
      <template v-if="scope?.column?.dataIndex === 'markUser'">
        <a-avatar :src="scope?.record?.markUser.avatar" />
        &nbsp;{{ scope?.record?.markUser?.name }}
      </template>
    </template>
  </a-table>
</template>
